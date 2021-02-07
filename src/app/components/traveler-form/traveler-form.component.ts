import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../_helpers/ngbDateCustomParserFormatter';
import { CheckOutService } from '../../services/checkout.service';
import { travelersFileds } from '../../_helpers/traveller.helper';
import { CartService } from '../../services/cart.service';
declare var $: any;
import * as moment from 'moment';
import { TravelerService } from '../../services/traveler.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-traveler-form',
  templateUrl: './traveler-form.component.html',
  styleUrls: ['./traveler-form.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})

export class TravelerFormComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() totalTraveler;
  travelerForm: FormGroup;
  @Input() cartNumber: number;
  @Input() cartId: number;
  @Input() cartItem;
  traveler_number: number = 0;
  countries = []
  myTravelers;
  travelers = {
    type0: {
      adults: []
    },
    type1: {
      adults: []
    },
    type2: {
      adults: []
    },
    type3: {
      adults: []
    },
    type4: {
      adults: []
    }
  };
  dobMinDate = new Date();
  baggageDescription: string = '';

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public commonFunction: CommonFunction,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private travelerService: TravelerService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.bsConfig = Object.assign({}, { dateInputFormat: 'MMM DD, YYYY', containerClass: 'theme-default', showWeekNumbers: false,adaptivePosition: true });

    this.checkOutService.getTravelers.subscribe((travelers: any) => {
      this.myTravelers = travelers;
    })
    this.cartService.getCartTravelers.subscribe((travelers:any)=>{
      this.travelers =travelers;
      console.log(this.travelers,"=====>")
    })

    //this.travelers = travelers;
    for (let i = 0; i < this.cartItem.module_info.adult_count; i++) {
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.adult));
      //this.cartService.setCartTravelers(this.travelers)
    }
    for (let i = 0; i < this.cartItem.module_info.child_count; i++) {
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.child));
      //this.cartService.setCartTravelers(this.travelers)
    }
    for (let i = 0; i < this.cartItem.module_info.infant_count; i++) {
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.infant));
    }

    for (let i = 0; i < this.cartItem.travelers.length; i++) {
      let traveler = this.myTravelers.find(traveler => traveler.userId == this.cartItem.travelers[i].userId)
      this.travelers[`type${this.cartNumber}`].adults[i].type = traveler.user_type;
      this.travelers[`type${this.cartNumber}`].adults[i].userId = traveler.userId;
      this.travelers[`type${this.cartNumber}`].adults[i].first_name = traveler.firstName;
      this.travelers[`type${this.cartNumber}`].adults[i].last_name = traveler.lastName;
      this.travelers[`type${this.cartNumber}`].adults[i].gender = traveler.gender;
      this.travelers[`type${this.cartNumber}`].adults[i].email = traveler.email;
      this.travelers[`type${this.cartNumber}`].adults[i].country_code = traveler.countryCode;
      this.travelers[`type${this.cartNumber}`].adults[i].phone_no = traveler.phoneNo;
      this.travelers[`type${this.cartNumber}`].adults[i].country_id = traveler.country != null ? traveler.country.id : '';
      this.travelers[`type${this.cartNumber}`].adults[i].dob = moment(traveler.dob, "YYYY-MM-DD").format('MMM DD, yy');
    }
    //console.log(this.travelers,"=====>")
    this.cartService.setCartTravelers(this.travelers)

    this.travelerForm = this.formBuilder.group({
      type0: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type1: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      /* type2: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type3: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type4: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }) */
    });
    
    this.patch();


    this.travelerForm.valueChanges.subscribe(value => {
      if (typeof this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number] !== 'undefined') {
        console.log("dob", this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.dob)
        if (this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].status == 'VALID') {

          let data = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value;
          data.dob = moment(this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.dob).format("YYYY-MM-DD")
          let userId = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.userId;
          if (userId) {
            //Edit
            this.travelerService.updateAdult(data, userId).subscribe(traveler => {
            })
          }
          else {
            //Add
            this.travelerService.addAdult(data).subscribe((traveler: any) => {
              this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].userId = traveler.userId;
              console.log("New Traveler=>>>", this.travelers)
              this.checkOutService.setTravelers([...this.myTravelers, traveler])
            }, error => {

            })
          }
        }
      }
      this.checkOutService.emitTravelersformData(this.travelerForm)
      console.log('this.travelerForm:::', this.travelerForm);
    })

    this.cartService.getSelectedCart.subscribe(cartNumber => {
      this.cartNumber = cartNumber;
    })


    this.checkOutService.getTraveler.subscribe((traveler: any) => {
      if (Object.keys(traveler).length > 0) {
        console.log("this.travelers",this.travelers,this.cartNumber,traveler)
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].first_name = traveler.firstName;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].last_name = traveler.lastName;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].email = traveler.email;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].userId = traveler.userId;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].gender = traveler.gender;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].phone_no = traveler.phoneNo;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].country_code = traveler.countryCode;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].dob = moment(traveler.dob, "YYYY-MM-DD").format('MMM DD, yy');
        this.patch()
      }
    })

    this.baggageDescription = this.formatBaggageDescription(this.cartItem.module_info.routes[0].stops[0].cabin_baggage, this.cartItem.module_info.routes[0].stops[0].checkin_baggage)

  }

  changeDateOfBirth(date) {
    // console.log(date);
    if (this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].status == 'VALID') {
      console.log('this.travelerForm:::', this.travelerForm);
    } else {
      console.log('this.travelerForm:::', this.travelerForm);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkOutService.getCountries.subscribe(res => {
      this.countries = res;
    })
  }

  patch() {
    let control: any = <FormArray>this.travelerForm.get(`type${this.cartNumber}.adults`);
    control.controls = [];
    this.travelers[`type${this.cartNumber}`].adults.forEach((x, i) => {
      control.push(this.patchValues(x))
    })

  }

  patchValues(x) {
    if (x.type == 'adult') {

      return this.formBuilder.group({
        first_name: [x.first_name, [Validators.required]],
        last_name: [x.last_name, [Validators.required]],
        email: [x.email, [Validators.required]],
        phone_no: [x.phone_no, [Validators.required]],
        country_code: [x.country_code, [Validators.required]],
        dob: [x.dob, [Validators.required]],
        country_id: [x.country_id, [Validators.required]],
        gender: [x.gender, [Validators.required]],
        userId: [x.userId],
        type: [x.type],
        dobMinDate: [x.dobMinDate],
        dobMaxDate: [x.dobMaxDate]
      }, { updateOn: 'blur' })
    }
    else {
      return this.formBuilder.group({
        first_name: [x.first_name, [Validators.required]],
        last_name: [x.last_name, [Validators.required]],
        dob: [x.dob, [Validators.required]],
        country_id: [x.country_id, [Validators.required]],
        gender: [x.gender, [Validators.required]],
        userId: [x.userId],
        type: [x.type],
        dobMinDate: [x.dobMinDate],
        dobMaxDate: [x.dobMaxDate]
      }, { updateOn: 'blur' })
    }
  }

  submit(value) {
    //console.log(this.travelerForm.get('type.adults')['controls']);
    console.log("value", value)
  }

  typeOf(value) {
    return typeof value;
  }

  /**
   * 
   * @param type ['adult','child','infant']
   */
  selectTravelerType(type, traveler_number) {
    this.travelers[`type${this.cartNumber}`].adults[traveler_number] = {};
    this.travelers[`type${this.cartNumber}`].adults[traveler_number].type = type;
    this.travelers[`type${this.cartNumber}`].adults[traveler_number].dobMinDate = travelersFileds.flight[type].dobMinDate;
    this.travelers[`type${this.cartNumber}`].adults[traveler_number].dobMaxDate = travelersFileds.flight[type].dobMaxDate;
    this.patch()
  }

  selectTravelerNumber(event, traveler_number) {
    console.log("traveler_number", traveler_number)
    this.traveler_number = traveler_number;
  }

  formatBaggageDescription(cabbinBaggage, checkInBaggage) {

    let cabbinBaggageWight;
    let checkInBaggageWight;
    let description = '';
    if (cabbinBaggage != "" && cabbinBaggage.includes("KG") == true) {
      cabbinBaggageWight = this.convertKgToLB(cabbinBaggage.replace("KG", ""))
      description = `Cabin bag upto ${cabbinBaggageWight} lbs (${cabbinBaggage})`;
    }
    else if (cabbinBaggage != '') {
      description = `Cabin bag upto ${cabbinBaggage}`;
    }

    if (checkInBaggage != "" && checkInBaggage.includes("KG") == true) {
      checkInBaggageWight = this.convertKgToLB(checkInBaggage.replace("KG", ""))
      if (description != '') {
        description += ` and checkin bag upto ${checkInBaggageWight} lbs (${checkInBaggage})`;
      }
      else {
        description += `checkin bag upto ${checkInBaggageWight} lbs (${checkInBaggage})`;

      }
    }
    else if (checkInBaggage != '') {
      if (description != '') {
        description += ` and checkin bag upto ${checkInBaggage}`;
      }
      else {
        description += `checkin bag upto ${checkInBaggage}`;
      }
    }

    return description;
  }

  convertKgToLB(weight) {
    return (2.20462 * Number(weight)).toFixed(2);
  }

}
