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
      adult: 0,
      child: 0,
      infant: 0
    },
    type1: {
      adults: [],
      adult: 0,
      child: 0,
      infant: 0
    },
    type2: {
      adults: [],
      adult: 0,
      child: 0,
      infant: 0
    },
    type3: {
      adults: [],
      adult: 0,
      child: 0,
      infant: 0
    },
    type4: {
      adults: [],
      adult: 0,
      child: 0,
      infant: 0
    }
  };
  dobMinDate = new Date();
  baggageDescription: string = '';

  bsConfig: Partial<BsDatepickerConfig>;
  passPortMinDate = new Date();

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

    this.bsConfig = Object.assign({}, { dateInputFormat: 'MM/DD/YYYY', containerClass: 'theme-default', showWeekNumbers: false, adaptivePosition: true });

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
      this.travelers[`type${this.cartNumber}`].cartId = this.cartId
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.adult));

      if (!this.cartItem.module_info.is_passport_required) {
        delete this.travelers[`type${this.cartNumber}`].adults[i].passport_expiry;
        delete this.travelers[`type${this.cartNumber}`].adults[i].passport_number;
      }
      else {
        this.travelers[`type${this.cartNumber}`].adults[i].is_passport_required = true;
      }

      this.travelers[`type${this.cartNumber}`].adult = this.cartItem.module_info.adult_count;

      this.cd.detectChanges();
    }
    for (let i = 0; i < this.cartItem.module_info.child_count; i++) {
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.child));
      this.travelers[`type${this.cartNumber}`].child = this.cartItem.module_info.child_count;

      this.cd.detectChanges();
    }
    for (let i = 0; i < this.cartItem.module_info.infant_count; i++) {
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.infant));
      this.travelers[`type${this.cartNumber}`].infant = this.cartItem.module_info.infant_count;
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
        this.travelers[`type${this.cartNumber}`].adults[i].dob = moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY');
        if (this.travelers[`type${this.cartNumber}`].adults[i].is_passport_required) {
          this.travelers[`type${this.cartNumber}`].adults[i].passport_number = traveler.passportNumber;
          this.travelers[`type${this.cartNumber}`].adults[i].passport_expiry = traveler.passportExpiry ? moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy') : '';
        }
      }
      this.patch();
      this.cartService.setCartTravelers(this.travelers);
      this.cd.detectChanges();
    }

    this.travelerForm.valueChanges.subscribe(value => {
      if (typeof this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number] !== 'undefined') {
        if (this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].status == 'VALID') {
          let data = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value;
          data.dob = moment(this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.dob).format("YYYY-MM-DD");
          data.passport_number = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.passport_number;
          data.passport_expiry = moment(this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.passport_expiry).format("YYYY-MM-DD");
          let userId = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.userId;
          if (userId) {
            //Edit
            this.travelerService.updateAdult(data, userId).subscribe((traveler: any) => {

              let index = this.myTravelers.findIndex(x => x.userId == traveler.userId)
              this.myTravelers[index] = traveler;

              /* for (let i = 0; i < 5; i++) {
                for (let j = 0; j < this.travelers[`type${i}`].adults.length; j++) {

                  if(typeof this.travelers[`type${i}`].adults[j]!=='undefined' && this.travelers[`type${i}`].adults[j].length>0){
                    console.log(this.travelers[`type${i}`].adults[j],j,"this.travelers[`type${i}`].")
                    index = this.travelers[`type${i}`].adults[j].findIndex(x => x.userId == traveler.userId);
                    if (index > -1) {
                      this.travelers[`type${i}`].adults[j] = traveler;
                    }
                  }
                }
              } */
              //this.patch()
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
                this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].dob = moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY');
                if (this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].is_passport_required) {
                  this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].passport_number = traveler.passportNumber;
                  this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].passport_expiry = moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy');
                }

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
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].first_name = traveler.firstName;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].last_name = traveler.lastName;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].email = traveler.email;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].userId = traveler.userId;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].gender = traveler.gender;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].phone_no = traveler.phoneNo;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].country_code = traveler.countryCode;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].dob = traveler.dob ? moment(traveler.dob, "YYYY-MM-DD").format('MMM DD, yy') : '';

        if (this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].is_passport_required) {
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].passport_number = traveler.passportNumber;
          this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].passport_expiry = traveler.passportExpiry ? moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy') : '';
        }
        this.patch();
      }
    })
    this.checkOutService.emitTravelersformData(this.travelerForm);
    this.baggageDescription = this.formatBaggageDescription(this.cartItem.module_info.routes[0].stops[0].cabin_baggage, this.cartItem.module_info.routes[0].stops[0].checkin_baggage)
  }


  ngOnChanges(changes: SimpleChanges) {
    this.checkOutService.getCountries.subscribe(res => {
      this.countries = res;
      this.setUSCountryInFirstElement(this.countries)
    });
  }

  setUSCountryInFirstElement(countries){

    var usCountryObj = countries.find(x=> x.id === 233);
    var removedUsObj = countries.filter( obj => obj.id !== 233);
    this.countries=[];
    removedUsObj.sort(function(a, b) {
      return (a['name'].toLowerCase() > b['name'].toLowerCase()) ? 1 : ((a['name'].toLowerCase() < b['name'].toLowerCase()) ? -1 : 0);          
    });
    removedUsObj.unshift(usCountryObj);
    
    const filteredArr = removedUsObj.reduce((acc, current) => {
      const x = acc.find(item => item.phonecode == current.phonecode);
      if (!x) {        
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    this.countries = filteredArr;  
  }

  patch() {
    for (let i = 0; i < Object.keys(this.travelers).length; i++) {
      //this.travelerForm.controls[`type${i}`]['controls'].cartId.setValue(this.travelers[`type${i}`].cartId);
      let control: any = <FormArray>this.travelerForm.get(`type${i}.adults`);
      control.controls = [];
      this.travelers[`type${i}`].adults.forEach((x, i) => {
        control.push(this.patchValues(x))
      })
    }
  }

  patchValues(x) {
    return this.formBuilder.group({
      first_name: [x.first_name, [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]$')]],
      last_name: [x.last_name, [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]$')]],
      email: (x.type === 'adult' || x.type === '') ? [x.email, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]] : [x.email],
      phone_no: (x.type === 'adult' || x.type === '') ? [x.phone_no, [Validators.required, Validators.minLength(10)]] : [x.phone_no],
      country_code: (x.type === 'adult' || x.type === '') ? [x.country_code, [Validators.required]] : [x.country_code],
      passport_number: (x.is_passport_required) ? [x.passport_number, [Validators.required]] : [x.passport_number],
      passport_expiry: (x.is_passport_required) ? [x.passport_expiry, [Validators.required]] : [x.passport_expiry],
      is_passport_required: [x.is_passport_required, [Validators.required]],
      dob: [ x.dob ? moment(x.dob).toDate() : '', [Validators.required]],
      country_id: [ x.country_id ? x.country_id : 233, [Validators.required]],
      gender: [x.gender, [Validators.required]],
      userId: [x.userId],
      type: [x.type],
      dobMinDate: [x.dobMinDate],
      dobMaxDate: [x.dobMaxDate]
    }, { updateOn: 'blur' });
  }

  submit(value) {

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
    this.travelers[`type${this.cartNumber}`].adults[traveler_number].country_code = travelersFileds.flight[type].country_code;
    this.travelers[`type${this.cartNumber}`].adults[traveler_number].passport_number = travelersFileds.flight[type].passport_number;
    this.travelers[`type${this.cartNumber}`].adults[traveler_number].passport_expiry = travelersFileds.flight[type].passport_expiry;
    // this.travelers[`type${this.cartNumber}`].adults[traveler_number].is_passport_required = travelersFileds.flight[type].is_passport_required;
    this.patch();
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

  // preventNumberInput(event: any) {
  //   var a = [];
  //   var k = event.which;

  //   for (let i = 48; i < 58; i++)
  //     a.push(i);

  //   if ((a.indexOf(k) >= 0))
  //     event.preventDefault();
  // }

}
