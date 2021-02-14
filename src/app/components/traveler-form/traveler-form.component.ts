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
      adults: [],
      adult:0,
      child:0,
      infant:0
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
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.bsConfig = Object.assign({}, { dateInputFormat: 'MMM DD, YYYY', containerClass: 'theme-default', showWeekNumbers: false, adaptivePosition: true });

    this.travelerForm = this.formBuilder.group({
      type0: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type1: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type2: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type3: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type4: this.formBuilder.group({
        adults: this.formBuilder.array([])
      })
    });

    this.checkOutService.getTravelers.subscribe((travelers: any) => {
      this.myTravelers = travelers;
    })
    this.cartService.getCartTravelers.subscribe((travelers: any) => {
      this.travelers = travelers;
    })

    for (let i = 0; i < this.cartItem.module_info.adult_count; i++) {
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.adult));
      this.travelers[`type${this.cartNumber}`].adult=this.cartItem.module_info.adult_count;
      
      this.cd.detectChanges();
    }
    for (let i = 0; i < this.cartItem.module_info.child_count; i++) {
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.child));
      this.travelers[`type${this.cartNumber}`].child=this.cartItem.module_info.child_count;
      
      this.cd.detectChanges();
    }
    for (let i = 0; i < this.cartItem.module_info.infant_count; i++) {
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.infant));
      this.travelers[`type${this.cartNumber}`].infant=this.cartItem.module_info.infant_count;
      this.cd.detectChanges();
    }

    if (this.travelers && this.travelers[`type${this.cartNumber}`] && this.travelers[`type${this.cartNumber}`].adults) {
      for (let i = 0; i < this.cartItem.travelers.length; i++) {
        let traveler = this.myTravelers.find(traveler => traveler.userId == this.cartItem.travelers[i].userId);
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
      this.patch();
      this.cartService.setCartTravelers(this.travelers);
      this.cd.detectChanges();
    }

    this.travelerForm.valueChanges.subscribe(value => {
      if (typeof this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number] !== 'undefined') {
        // console.log("dob", this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.dob)
        if (this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].status == 'VALID') {

          let data = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value;
          data.dob = moment(this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.dob).format("YYYY-MM-DD")
          let userId = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.userId;
          if (userId) {
            //Edit
            this.travelerService.updateAdult(data, userId).subscribe((traveler:any) => {
              /* let index = this.myTravelers.findIndex(x=>x.userId=traveler.userId)
              this.myTravelers[index]=traveler;
              for(let i=0; i <5; i++){
                for(let j=0; j< this.travelers[`type${i}`].adults.length; j++){
                  
                  index = this.travelers[`type${i}`].adults[j].findIndex(x=>x.userId=traveler.userId);
                  if(index>-1){
                    this.travelers[`type${i}`].adults[j]=traveler;
                  }
                }
              }
              this.patch(); */
            })
          }
          else {
            //Add
            this.travelerService.addAdult(data).subscribe((traveler: any) => {
              if (traveler) {
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].type = traveler.user_type;
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].userId = traveler.userId;
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].first_name = traveler.firstName;
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].last_name = traveler.lastName;
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].gender = traveler.gender;
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].email = traveler.email;
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].country_code = traveler.countryCode;
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].phone_no = traveler.phoneNo;
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].dob = moment(traveler.dob, "YYYY-MM-DD").format('MMM DD, yy');

                this.checkOutService.setTravelers([...this.myTravelers, traveler]);
                this.patch();
              }
            }, error => {

            })
          }
        }
      }
      this.checkOutService.emitTravelersformData(this.travelerForm);
    })

    this.cartService.getSelectedCart.subscribe(cartNumber => {
      this.cartNumber = cartNumber;
    })

    this.checkOutService.getTraveler.subscribe((traveler: any) => {
      if (traveler && Object.keys(traveler).length > 0) {
        if (this.travelers && this.travelers[`type${this.cartNumber}`] && this.travelers[`type${this.cartNumber}`].adults && traveler.traveler_number && this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number]) {
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].first_name = traveler.firstName;
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].last_name = traveler.lastName;
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].email = traveler.email;
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].userId = traveler.userId;
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].gender = traveler.gender;
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].phone_no = traveler.phoneNo;
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].country_code = traveler.countryCode;
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].dob = traveler.dob ? moment(traveler.dob, "YYYY-MM-DD").format('MMM DD, yy') : '';
          this.patch();
        }
      }
    })
    this.checkOutService.emitTravelersformData(this.travelerForm);
    this.baggageDescription = this.formatBaggageDescription(this.cartItem.module_info.routes[0].stops[0].cabin_baggage, this.cartItem.module_info.routes[0].stops[0].checkin_baggage)
  }


  ngOnChanges(changes: SimpleChanges) {
    this.checkOutService.getCountries.subscribe(res => {
      this.countries = res;
    })
  }

  patch() {
    for (let i = 0; i < Object.keys(this.travelers).length; i++) {
      let control: any = <FormArray>this.travelerForm.get(`type${i}.adults`);
      control.controls = [];
      this.travelers[`type${i}`].adults.forEach((x, i) => {
        control.push(this.patchValues(x))
      })
    }
  }

  patchValues(x) {
    return this.formBuilder.group({
      first_name: [x.first_name, [Validators.required]],
      last_name: [x.last_name, [Validators.required]],
      email: (x.type === 'adult' || x.type === '') ? [x.email, [Validators.required]] : [x.email],
      phone_no: (x.type === 'adult' || x.type === '') ? [x.phone_no, [Validators.required]] : [x.phone_no],
      country_code: (x.type === 'adult' || x.type === '') ? [x.country_code, [Validators.required]] : [x.country_code],
      dob: [x.dob, [Validators.required]],
      country_id: [x.country_id, [Validators.required]],
      gender: [x.gender, [Validators.required]],
      userId: [x.userId],
      type: [x.type],
      dobMinDate: [x.dobMinDate],
      dobMaxDate: [x.dobMaxDate]
    }, { updateOn: 'blur' });

    // if (x.type == 'adult') {

    //   return this.formBuilder.group({
    //     first_name: [x.first_name, [Validators.required]],
    //     last_name: [x.last_name, [Validators.required]],
    //     email: [x.email, [Validators.required]],
    //     phone_no: [x.phone_no, [Validators.required]],
    //     country_code: [x.country_code, [Validators.required]],
    //     dob: [x.dob, [Validators.required]],
    //     country_id: [x.country_id, [Validators.required]],
    //     gender: [x.gender, [Validators.required]],
    //     userId: [x.userId],
    //     type: [x.type],
    //     dobMinDate: [x.dobMinDate],
    //     dobMaxDate: [x.dobMaxDate]
    //   }, { updateOn: 'blur' })
    // }
    // else {
    //   return this.formBuilder.group({
    //     first_name: [x.first_name, [Validators.required]],
    //     last_name: [x.last_name, [Validators.required]],
    //     dob: [x.dob, [Validators.required]],
    //     country_id: [x.country_id, [Validators.required]],
    //     gender: [x.gender, [Validators.required]],
    //     userId: [x.userId],
    //     type: [x.type],
    //     dobMinDate: [x.dobMinDate],
    //     dobMaxDate: [x.dobMaxDate]
    //   }, { updateOn: 'blur' })
    // }
  }

  submit(value) {
    // console.log("value", value)
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
