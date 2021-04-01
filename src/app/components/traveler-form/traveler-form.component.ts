import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../_helpers/ngbDateCustomParserFormatter';
import { CheckOutService } from '../../services/checkout.service';
import { travelersFileds, travlerLabels } from '../../_helpers/traveller.helper';
import { CartService } from '../../services/cart.service';
declare var $: any;
import * as moment from 'moment';
import { TravelerService } from '../../services/traveler.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { getLoginUserInfo } from 'src/app/_helpers/jwt.helper';
import { getPhoneFormat } from 'src/app/_helpers/phone-masking.helper';

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
  selectedType;
  traveler_number: number = 0;
  countries = [];
  phoneCodelist=[]
  myTravelers = [];
  travlerLabels;
  userId;
  userInfo;
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
  dateYeaMask = {
    guide: false,
    showMask: false,
    mask: [
      /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };
  isAdultTravller: boolean = true;
  isChildTravller: boolean = true;
  isInfantTravller: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public commonFunction: CommonFunction,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private travelerService: TravelerService,
    private cd: ChangeDetectorRef
  ) {
    this.travlerLabels = travlerLabels;
    this.userInfo = getLoginUserInfo();

  }

  ngOnInit() {
    this.loadJquery();
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
      if (this.myTravelers.length == 0) {
        this.isAdultTravller = false;
        this.isChildTravller = false;
        this.isInfantTravller = false;
      }
      else {
        let adult = this.myTravelers.findIndex(x=>x.user_type=='adult')
        if(adult!=-1){ this.isAdultTravller = true; }else{ this.isAdultTravller = false;}
        let child = this.myTravelers.findIndex(x=>x.user_type=='child')
        if(child!=-1){ this.isChildTravller = true; }else{ this.isChildTravller = false;}
        let infant = this.myTravelers.findIndex(x=>x.user_type=='infant')
        if(infant!=-1){ this.isInfantTravller = true; }else{ this.isInfantTravller = false;}
      }
    })
    this.cartService.getCartTravelers.subscribe((travelers: any) => {
      this.travelers = travelers;
    })

    if(this.cartItem.type=='flight'){
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
          
          if (!this.cartItem.module_info.is_passport_required) {
            delete this.travelers[`type${this.cartNumber}`].adults[i].passport_expiry;
            delete this.travelers[`type${this.cartNumber}`].adults[i].passport_number;
          }
          else {
            this.travelers[`type${this.cartNumber}`].adults[i].is_passport_required = true;
          }
          this.cd.detectChanges();
        }
        for (let i = 0; i < this.cartItem.module_info.infant_count; i++) {
          this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.infant));
          this.travelers[`type${this.cartNumber}`].infant = this.cartItem.module_info.infant_count;

          this.cd.detectChanges();
        }
    }
    if(this.cartItem.type=='hotel'){
      for (let i = 0; i < this.cartItem.module_info.input_data.num_rooms; i++) {
        this.travelers[`type${this.cartNumber}`].cartId = this.cartId
        this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.hotel.adult));
        if(i!=0){
          this.travelers[`type${this.cartNumber}`].adults[i].is_email_required=false;
          this.travelers[`type${this.cartNumber}`].adults[i].is_phone_required=false;
        }
        this.travelers[`type${this.cartNumber}`].adult = this.cartItem.module_info.adult_count;
        
        this.cd.detectChanges();
      }
    }
      
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
        this.travelers[`type${this.cartNumber}`].adults[i].passport_expiry = traveler.passportExpiry ? moment(traveler.passportExpiry, "YYYY-MM-DD").format('MM/DD/YYYY') : '';
      }
    }
    this.patch();
    this.cartService.setCartTravelers(this.travelers);
    this.cd.detectChanges();
    

    this.travelerForm.valueChanges.subscribe(value => {
      this.checkOutService.emitTravelersformData(this.travelerForm);
    })

    this.cartService.getSelectedCart.subscribe(cartNumber => {
      this.cartNumber = cartNumber;
    })

    this.checkOutService.emitTravelersformData(this.travelerForm);
    //this.baggageDescription = this.formatBaggageDescription(this.cartItem.module_info.routes[0].stops[0].cabin_baggage, this.cartItem.module_info.routes[0].stops[0].checkin_baggage)
  }

  loadJquery() {

    $(document).on("click", ".card-header", function () {
      if ($(this).find('.card-link').hasClass('collapsed')) {
        $(this).find('.traveler_drop_down').addClass('hide_section')
        $(this).find('.mob_names').addClass('hide_section')
      }
      else {
        $(this).find('.trv_name').addClass('hide_section')
        $(this).find('.traveler_drop_down').removeClass('hide_section')
        $(this).find('.mob_names').removeClass('hide_section')
      }
    })

  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkOutService.getCountries.subscribe(res => {
      this.countries = res;
      this.setUSCountryInFirstElement(this.countries)
    });
  }

  setUSCountryInFirstElement(countries) {

    var usCountryObj = countries.find(x => x.id === 233);
    var removedUsObj = countries.filter(obj => obj.id !== 233);
    this.phoneCodelist = [];
    removedUsObj.sort(function (a, b) {
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
    this.phoneCodelist = filteredArr;
  }

  patch() {
    for (let i = 0; i < Object.keys(this.travelers).length; i++) {
      //this.travelerForm.controls[`type${i}`]['controls'].cartId.setValue(this.travelers[`type${i}`].cartId);
      let control: any = <FormArray>this.travelerForm.get(`type${i}.adults`);
      control.controls = [];
      this.travelers[`type${i}`].adults.forEach((x, i) => {
        control.push(this.patchValues(x,i))
      })
    }
  }

  patchValues(x,i) {

    if(x.module=='flight'){
      return this.formBuilder.group({
        first_name: [x.first_name, [Validators.required,Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
        last_name: [x.last_name, [Validators.required,Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
        email: (x.type === 'adult' || x.type === '') ? [x.email, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]] : [x.email],
        phone_no: (x.type === 'adult' || x.type === '') ? [x.phone_no, [Validators.required, Validators.minLength(10)]] : [x.phone_no],
        phone_no_format: (x.type === 'adult' || x.type === '') ? [x.phone_no_format, [Validators.required]] : [x.phone_no_format],
        phone_no_length: (x.type === 'adult' || x.type === '') ? [x.phone_no_length, [Validators.required]] : [x.phone_no_length],
        country_code: (x.type === 'adult' || x.type === '') ? [x.country_code, [Validators.required]] : [x.country_code],
        passport_number: (x.is_passport_required) ? [x.passport_number, [Validators.required]] : [x.passport_number],
        passport_expiry: (x.is_passport_required) ? [x.passport_expiry || null, [Validators.required]] : [x.passport_expiry],
        is_passport_required: [x.is_passport_required, [Validators.required]],
        dob: [x.dob ? x.dob : '', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/)]],
        country_id: [x.country_id ? x.country_id : 233, [Validators.required]],
        gender: [x.gender, [Validators.required]],
        userId: [x.userId],
        type: [x.type],
        dobMinDate: [x.dobMinDate],
        dobMaxDate: [x.dobMaxDate],
        module: [x.module],
        is_valid_date: [x.is_valid_date],
        is_email_required: [x.is_email_required],
        is_phone_required: [x.is_phone_required]
      }, { updateOn: 'blur' });
    }
    if(x.module=='hotel'){
      return this.formBuilder.group({
        first_name: [x.first_name, [Validators.required,Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
        last_name: [x.last_name, [Validators.required,Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
        email: (i == 0 ) ? [x.email, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]] : [x.email],
        phone_no: (i ==0 ) ? [x.phone_no, [Validators.required, Validators.minLength(10)]] : [x.phone_no],
        phone_no_format: (i == 0 ) ? [x.phone_no_format, [Validators.required]] : [x.phone_no_format],
        phone_no_length: (i == 0 ) ? [x.phone_no_length, [Validators.required]] : [x.phone_no_length],
        country_code: (i == 0 ) ? [x.country_code, [Validators.required]] : [x.country_code],
        userId: [x.userId],
        type: [x.type],
        module: [x.module],
        is_valid_date: [x.is_valid_date],
        is_email_required: [x.is_email_required],
        is_phone_required: [x.is_phone_required]
      }, { updateOn: 'blur' });
    }
    
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

  selectTravelerNumber(event,cartNumber ,traveler_number) {
    this.traveler_number = traveler_number;
    let userId= this.travelers[`type${cartNumber}`].adults[traveler_number].userId;
    $(document).on("click", ".card-header", function () {
      if ($(this).find('.card-link').hasClass('collapsed')) {
        $(this).find('.traveler_drop_down').addClass('hide_section')
        $(this).find('.trv_name').removeClass('hide_section')
        if(userId!=""){
          $(this).find('.mob_names').addClass('hide_section')
        }
      }
      else {
        $(this).find('.trv_name').addClass('hide_section')
        $(this).find('.traveler_drop_down').removeClass('hide_section')
        if(userId!=""){
          $(this).find('.mob_names').removeClass('hide_section')
        }
      }
    })
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

  /* preventNumberInput(event: any) {
    var a = [];
    var k = event.which;

    for (let i = 48; i < 58; i++)
      a.push(i);

    if ((a.indexOf(k) >= 0))
      event.preventDefault();
  } */
  saveTraveler(cartNumber, traveler_number) {

    this.travelers[`type${cartNumber}`].adults[traveler_number].is_submitted = true;
    console.log(this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.email.validator({} as AbstractControl),"save")

    //return false;
    this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].markAllAsTouched()
    if (this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].status == 'VALID') {
      let data = this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value;
      data.dob = moment(this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value.dob, "MM/DD/YYYY").format("YYYY-MM-DD");
      if (this.travelers[`type${cartNumber}`].adults[traveler_number].is_passport_required) {
        data.passport_number = this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value.passport_number;
        data.passport_expiry = moment(this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value.passport_expiry).format("YYYY-MM-DD");
      }
      this.cartService.setLoaderStatus(true)
      let userId = this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value.userId;
      if (userId) {
        //Edit
        this.travelerService.updateAdult(data, userId).subscribe((traveler: any) => {
          this.travelers[`type${cartNumber}`].adults[traveler_number].is_submitted = false;
          this.cartService.setLoaderStatus(false);
          let index = this.myTravelers.findIndex(x => x.userId == traveler.userId)
          this.myTravelers[index] = traveler;
          //this.checkOutService.setTravelers([this.myTravelers]);
          this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].markAsUntouched();
          this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].disable()
        })
      }
      else{
        this.travelerService.addAdult(data).subscribe((traveler: any) => {
          this.travelers[`type${cartNumber}`].adults[traveler_number].is_submitted = false;
          this.cartService.setLoaderStatus(false)
          if (traveler) {
            this.travelers[`type${cartNumber}`].adults[traveler_number].type = traveler.user_type;
            
            this.travelers[`type${cartNumber}`].adults[traveler_number].userId = traveler.userId;
            this.travelers[`type${cartNumber}`].adults[traveler_number].first_name = traveler.firstName;
            this.travelers[`type${cartNumber}`].adults[traveler_number].last_name = traveler.lastName;
            this.travelers[`type${cartNumber}`].adults[traveler_number].gender = traveler.gender;
            this.travelers[`type${cartNumber}`].adults[traveler_number].email = traveler.email;
            this.travelers[`type${cartNumber}`].adults[traveler_number].country_code = traveler.countryCode;
            this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no = traveler.phoneNo;
            this.travelers[`type${cartNumber}`].adults[traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
            this.travelers[`type${cartNumber}`].adults[traveler_number].dob = moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY');
            if (this.travelers[`type${cartNumber}`].adults[traveler_number].is_passport_required) {
              this.travelers[`type${cartNumber}`].adults[traveler_number].passport_number = traveler.passportNumber;
              this.travelers[`type${cartNumber}`].adults[traveler_number].passport_expiry = moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy');
            }


            this.travelers[`type${cartNumber}`].adults[traveler_number].module = this.cartItem.type;
            if((this.cartItem.type=='flight' && traveler.type=='adult') || (this.cartItem.type=='hotel' && traveler_number==0)){
              this.travelers[`type${cartNumber}`].adults[traveler_number].is_email_required = true;
              this.travelers[`type${cartNumber}`].adults[traveler_number].is_phone_required = true;
            }
            else{
              this.travelers[`type${cartNumber}`].adults[traveler_number].is_email_required = false;
              this.travelers[`type${cartNumber}`].adults[traveler_number].is_phone_required = false;
            }
            
            if(traveler.user_type=='adult'){ this.isAdultTravller = true; }
            if(traveler.user_type=='child'){ this.isChildTravller = true; }
            if(traveler.user_type=='infant'){ this.isInfantTravller = true; }
            this.checkOutService.setTravelers([...this.myTravelers, traveler]);
            console.log("llll",this.travelers)
            this.patch();

            this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].markAsUntouched();
            this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].disable()
          }
        }, error => {
          this.cartService.setLoaderStatus(false)
          if (error.status == 409) {
            
          }
        })
      }

      
    }
  }

  deleteTraveler(cartNumber, traveler_number) {

    //let traveler = { traveler_number: traveler_number };
    this.travelers[`type${cartNumber}`].adults[traveler_number].first_name = "";
    this.travelers[`type${cartNumber}`].adults[traveler_number].last_name = "";
    this.travelers[`type${cartNumber}`].adults[traveler_number].email = "";
    this.travelers[`type${cartNumber}`].adults[traveler_number].userId = "";
    this.travelers[`type${cartNumber}`].adults[traveler_number].gender = "";
    this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no = "";
    this.travelers[`type${cartNumber}`].adults[traveler_number].country_code = '+1';
    this.travelers[`type${cartNumber}`].adults[traveler_number].country_id = '';
    this.travelers[`type${cartNumber}`].adults[traveler_number].dob = '';
    this.setPhoneNumberFormat('+1',cartNumber,traveler_number);
    if (this.travelers[`type${cartNumber}`].adults[traveler_number].is_passport_required) {
      this.travelers[`type${cartNumber}`].adults[traveler_number].passport_number = "";
      this.travelers[`type${cartNumber}`].adults[traveler_number].passport_expiry = '';
    }
    this.patch();
    this.checkOutService.emitTravelersformData(this.travelerForm);
  }

  editTravelerNotinUse(cartNumber, traveler_number) {
    this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].markAllAsTouched()
    if (this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].status == 'VALID') {
      this.cartService.setLoaderStatus(true);
      let data = this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value;
      data.dob = moment(this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value.dob, "MM/DD/YYYY").format("YYYY-MM-DD");
      data.passport_number = this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value.passport_number;
      data.passport_expiry = moment(this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value.passport_expiry).format("YYYY-MM-DD");
      let userId = this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value.userId;
      if (userId) {
        //Edit
        this.travelerService.updateAdult(data, userId).subscribe((traveler: any) => {
          this.cartService.setLoaderStatus(false);
          let index = this.myTravelers.findIndex(x => x.userId == traveler.userId)
          this.myTravelers[index] = traveler;

        })
      }
      this.checkOutService.emitTravelersformData(this.travelerForm);
    }
  }

  editTraveler(cartNumber, traveler_number) {
    this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].enable()
    this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].markAsTouched();
  }

  selectTraveler(travlerId, traveler_number,cartNumber) {
    let traveler = this.myTravelers.find(x => x.userId == travlerId)
    if (traveler && Object.keys(traveler).length > 0) {
      //this.travelers[`type${cartNumber}`].adults[traveler_number].module = traveler.module;
      this.travelers[`type${this.cartNumber}`].adults[traveler_number].first_name = traveler.firstName;
      this.travelers[`type${this.cartNumber}`].adults[traveler_number].last_name = traveler.lastName;
      this.travelers[`type${this.cartNumber}`].adults[traveler_number].email = traveler.email;
      this.travelers[`type${this.cartNumber}`].adults[traveler_number].userId = traveler.userId;
      this.travelers[`type${this.cartNumber}`].adults[traveler_number].gender = traveler.gender;
      this.travelers[`type${this.cartNumber}`].adults[traveler_number].phone_no = traveler.phoneNo;
      this.travelers[`type${this.cartNumber}`].adults[traveler_number].country_code = traveler.countryCode || '+1';
      this.travelers[`type${this.cartNumber}`].adults[traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
      this.travelers[`type${this.cartNumber}`].adults[traveler_number].dob = traveler.dob ? moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY') : '';

      if (this.travelers[`type${this.cartNumber}`].adults[traveler_number].is_passport_required) {
        this.travelers[`type${this.cartNumber}`].adults[traveler_number].passport_number = traveler.passportNumber;
        this.travelers[`type${this.cartNumber}`].adults[traveler_number].passport_expiry = traveler.passportExpiry ? `${moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy')}` : '';
      }
      this.patch();
      this.setPhoneNumberFormat(this.travelers[`type${this.cartNumber}`].adults[traveler_number].country_code,cartNumber,traveler_number)
    }
    
    this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].disable()
    this.checkOutService.emitTravelersformData(this.travelerForm);
    this.cd.detectChanges();
  }

  checkMaximumMinimum(event, dobValue, cartNumber, traveler_number) {
    // CHECK MAXIMUM OR MINIMUM DATE OF BIRTH
    let traveler = this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value;

    if (
      moment(dobValue)
        .isAfter(moment(this.travelers[`type${cartNumber}`].adults[traveler_number].dobMinDate).format('MM/DD/YYYY')) &&
      moment(moment(this.travelers[`type${cartNumber}`].adults[traveler_number].dobMaxDate).format('MM/DD/YYYY'))
        .isBefore(dobValue)) {
      this.travelers[`type${cartNumber}`].adults[traveler_number].is_valid_date = false;
    } else {
      this.travelers[`type${cartNumber}`].adults[traveler_number].is_valid_date = true;
    }
    this.travelers[`type${cartNumber}`].adults[traveler_number].first_name = traveler.first_name;
    this.travelers[`type${cartNumber}`].adults[traveler_number].last_name = traveler.last_name;
    this.travelers[`type${cartNumber}`].adults[traveler_number].email = traveler.email;
    this.travelers[`type${cartNumber}`].adults[traveler_number].userId = traveler.userId;
    this.travelers[`type${cartNumber}`].adults[traveler_number].gender = traveler.gender;
    this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no = traveler.phone_no;
    this.travelers[`type${cartNumber}`].adults[traveler_number].country_code = traveler.country_code || '+1';
    this.travelers[`type${cartNumber}`].adults[traveler_number].country_id = traveler.country_id != null ? traveler.country_id : '';
    this.travelers[`type${cartNumber}`].adults[traveler_number].dob = dobValue;

    if (this.travelers[`type${cartNumber}`].adults[traveler_number].is_passport_required) {
      this.travelers[`type${cartNumber}`].adults[traveler_number].passport_number = traveler.passport_number;
      this.travelers[`type${cartNumber}`].adults[traveler_number].passport_expiry = traveler.passport_expiry ? `${moment(traveler.passport_expiry, "YYYY-MM-DD").format('MMM DD, yy')}` : '';
    }
    this.patch();
    this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.dob.markAsTouched();
  }

  validateCountryWithPhoneNumber(event,cartNumber,traveler_number): void {

    //console.log(this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.phone_no,"======")
    this.setPhoneNumberFormat(event.phonecode,cartNumber,traveler_number);
  }

  setPhoneNumberFormat(phonecode,cartNumber,traveler_number){
    if(this.travelers[`type${cartNumber}`].adults[traveler_number].type=='adult'){
      let phoneFormat = getPhoneFormat(phonecode);
      this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.phone_no.setValidators([Validators.minLength(phoneFormat.length)]);
      this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.phone_no.updateValueAndValidity();
      this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no_format = phoneFormat.format;
      this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no_length = phoneFormat.length;
    }
  }

  
}
