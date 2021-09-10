import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
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
import { checkValidDate } from 'src/app/_helpers/custom.validators';
import { HttpClient, HttpParams } from '@angular/common/http';

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
  phoneCodelist = []
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
    },
    type5: {
      adults: [],
      adult: 0,
      child: 0,
      infant: 0
    },
    type6: {
      adults: [],
      adult: 0,
      child: 0,
      infant: 0
    },
    type7: {
      adults: [],
      adult: 0,
      child: 0,
      infant: 0
    },
    type8: {
      adults: [],
      adult: 0,
      child: 0,
      infant: 0
    },
    type9: {
      adults: [],
      adult: 0,
      child: 0,
      infant: 0
    },

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
  accountHolderEmail: string = '';
  userLang: string = "en";

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public commonFunction: CommonFunction,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private travelerService: TravelerService,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) {
    this.travlerLabels = travlerLabels;
    this.userInfo = getLoginUserInfo();
    if (this.userInfo.roleId != 7) {
      this.accountHolderEmail = this.userInfo.email;
    }
  }

  ngOnInit() {
    this.loadJquery();
    this.bsConfig = Object.assign({}, { dateInputFormat: 'MMM DD, YYYY', containerClass: 'theme-default', showWeekNumbers: false, adaptivePosition: true });

    // Author: xavier | 2021/7/30
    // Description: To support localized installment types
    this.userLang = JSON.parse(localStorage.getItem('_lang')).iso_1Code;

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
      }),
      type5: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type6: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type7: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type8: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type9: this.formBuilder.group({
        adults: this.formBuilder.array([])
      })
    });


    this.checkOutService.getTravelers.subscribe((travelers: any) => {
      this.myTravelers = travelers;
    })
    this.cartService.getCartTravelers.subscribe((travelers: any) => {
      this.travelers = travelers;
    })

    if (this.cartItem.type == 'flight') {
      for (let i = 0; i < this.cartItem.module_info.adult_count; i++) {
        this.travelers[`type${this.cartNumber}`].cartId = this.cartId
        this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.flight.adult));
         this.travelers[`type${this.cartNumber}`].adults[i].email=(this.accountHolderEmail && i==0)?this.accountHolderEmail:'';
         this.travelers[`type${this.cartNumber}`].adults[i].is_active=(i==0)?true:false;
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
    if (this.cartItem.type == 'hotel') {
      for (let i = 0; i < this.cartItem.module_info.input_data.num_rooms; i++) {
        this.travelers[`type${this.cartNumber}`].cartId = this.cartId
        this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({}, travelersFileds.hotel.adult));
        this.travelers[`type${this.cartNumber}`].adults[i].email=(this.accountHolderEmail && i==0)?this.accountHolderEmail:'';
        this.travelers[`type${this.cartNumber}`].adults[i].is_active=(i==0)?true:false;
        if (i != 0) {
          this.travelers[`type${this.cartNumber}`].adults[i].is_email_required = false;
          this.travelers[`type${this.cartNumber}`].adults[i].is_phone_required = false;
        }
        this.travelers[`type${this.cartNumber}`].adult = this.cartItem.module_info.adult_count;

        this.cd.detectChanges();
      }
    }

    if (this.userInfo.roleId != 7 && this.cartItem.travelers.length==0) {

      let traveler = this.myTravelers.find(traveler => traveler.userId ==this.userInfo.user_id);
      if(typeof traveler != 'undefined'){

        this.travelers[`type${this.cartNumber}`].adults[0].type = 'adult';
        this.travelers[`type${this.cartNumber}`].adults[0].userId = traveler.userId;
        this.travelers[`type${this.cartNumber}`].adults[0].first_name = traveler.firstName;
        this.travelers[`type${this.cartNumber}`].adults[0].last_name = traveler.lastName;
        this.travelers[`type${this.cartNumber}`].adults[0].gender = traveler.gender || '';
        this.travelers[`type${this.cartNumber}`].adults[0].email = traveler.email;
        this.travelers[`type${this.cartNumber}`].adults[0].country_code = traveler.countryCode || '';
        this.travelers[`type${this.cartNumber}`].adults[0].phone_no = traveler.phoneNo || '';
        this.travelers[`type${this.cartNumber}`].adults[0].country_id = traveler.country != null ? traveler.country.id : '';
        this.travelers[`type${this.cartNumber}`].adults[0].dob = traveler.dob ? moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY'):'';
        this.travelers[`type${this.cartNumber}`].adults[0].is_active=true;
        if (this.travelers[`type${this.cartNumber}`].adults[0].is_passport_required) {
          this.travelers[`type${this.cartNumber}`].adults[0].passport_number = traveler.passportNumber;
          this.travelers[`type${this.cartNumber}`].adults[0].passport_expiry = traveler.passportExpiry && traveler.passportExpiry != 'Invalid date' ? moment(traveler.passportExpiry, "YYYY-MM-DD").format('MM/DD/YYYY') : '';
        }
        let travelerData = this.travelers[`type${this.cartNumber}`].adults[0];
        travelerData.cart_id = this.cartId;
        travelerData.dob = traveler.dob ?traveler.dob:'';
        this.createTraveler(travelerData,this.cartNumber,this.traveler_number);
      }
    }

    for (let i = 0; i < this.cartItem.travelers.length; i++) {
      let traveler = this.cartItem.travelers[i].traveler;
      if (typeof traveler != 'undefined') {
        this.travelers[`type${this.cartNumber}`].adults[i].type = traveler.user_type;
        this.travelers[`type${this.cartNumber}`].adults[i].userId = traveler.userId;
        this.travelers[`type${this.cartNumber}`].adults[i].first_name = traveler.firstName;
        this.travelers[`type${this.cartNumber}`].adults[i].last_name = traveler.lastName;
        this.travelers[`type${this.cartNumber}`].adults[i].gender = traveler.gender || '';
        this.travelers[`type${this.cartNumber}`].adults[i].email = traveler.email;
        this.travelers[`type${this.cartNumber}`].adults[i].country_code = traveler.countryCode || '';
        this.travelers[`type${this.cartNumber}`].adults[i].phone_no = traveler.phoneNo || '';
        this.travelers[`type${this.cartNumber}`].adults[i].country_id = traveler.country != null ? traveler.country.id : '';
        this.travelers[`type${this.cartNumber}`].adults[i].dob = traveler.dob ? moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY'):'';
        if (this.travelers[`type${this.cartNumber}`].adults[i].is_passport_required) {
          this.travelers[`type${this.cartNumber}`].adults[i].passport_number = traveler.passportNumber;
          this.travelers[`type${this.cartNumber}`].adults[i].passport_expiry = traveler.passportExpiry && traveler.passportExpiry != 'Invalid date' ? moment(traveler.passportExpiry, "YYYY-MM-DD").format('MM/DD/YYYY') : '';
        }
      }
    }
    
    
    this.patch();
    this.cartService.setCartTravelers(this.travelers);

    this.travelerForm.valueChanges.subscribe(value => {
      let data = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value;
      data.dob = moment(this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.dob).format("YYYY-MM-DD");
      if(this.cartItem.type=='flight'){
        this.checkMaximumMinimum(null, this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.dob, this.cartNumber, this.traveler_number)
      }
      if (typeof this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number] !== 'undefined') {
        if (this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].status == 'VALID' && this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].is_valid_date) {
          
          data.passport_number = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.passport_number;
          data.passport_expiry = moment(this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.passport_expiry).format("YYYY-MM-DD");
          data.cart_id=this.cartId;
          let userId = this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.userId;
          if (userId) {
            //Edit
            data.is_primary_traveler = this.traveler_number == 0 ? true : false;
            if (this.cartItem.type == 'hotel') {
              data.module_id = 3;
              /* delete data.country_id;
              delete data.dob;
              delete data.gender;
              delete data.passport_number;
              delete data.passport_expiry; */
            }
            else {
              data.module_id = 1;
            }
            this.travelerService.updateAdult(data, userId).subscribe((traveler: any) => {
              this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].is_submitted = false;
            }, error => {
              if(error.status==404){
                this.createTraveler(data,this.cartNumber,this.traveler_number)
              }
            }) 
          }
          else {
            //Add
            this.createTraveler(data,this.cartNumber,this.traveler_number);
          }
        }
      }
      this.checkOutService.emitTravelersformData(this.travelerForm);
    })

    /* this.travelerForm.valueChanges.subscribe(value => {
      this.checkOutService.emitTravelersformData(this.travelerForm);
    }) */

    this.cartService.getSelectedCart.subscribe(cartNumber => {
      this.cartNumber = cartNumber;
    })

    this.checkOutService.emitTravelersformData(this.travelerForm);

    this.translateHotelRoomDescription();
  }

  createTraveler(data,cartNumber,traveler_number){

    data.is_primary_traveler = traveler_number == 0 ? true : false;
    if (this.cartItem.type == 'hotel') {
      data.module_id = 3;
      /* delete data.country_id;
      delete data.dob;
      delete data.gender;
      delete data.passport_number;
      delete data.passport_expiry; */
    }
    else {
      data.module_id = 1;
      //data.dob =typeof this.travelers[`type${cartNumber}`].adults[traveler_number].dob!='undefined'? moment(this.travelers[`type${cartNumber}`].adults[traveler_number].dob).format("YYYY-MM-DD"):'';
    }

    this.travelerService.addAdult(data).subscribe((traveler: any) => {
      this.travelers[`type${this.cartNumber}`].adults[this.traveler_number].is_submitted = false;
      //this.cartService.setLoaderStatus(false)
      console.log("Actual data",data)
      console.log("Saved data",traveler)
      if (traveler) {
        this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].controls['userId'].setValue(traveler.traveler.userId);
        this.travelers[`type${cartNumber}`].adults[traveler_number].userId = traveler.traveler.userId;
        this.travelers[`type${cartNumber}`].adults[traveler_number].first_name = traveler.traveler.firstName;
        this.travelers[`type${cartNumber}`].adults[traveler_number].last_name = traveler.traveler.lastName;
        this.travelers[`type${cartNumber}`].adults[traveler_number].gender = traveler.traveler.gender;
        this.travelers[`type${cartNumber}`].adults[traveler_number].email = traveler.traveler.email;
        this.travelers[`type${cartNumber}`].adults[traveler_number].country_code = traveler.traveler.countryCode;
        this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no = traveler.traveler.phoneNo;
        this.travelers[`type${cartNumber}`].adults[traveler_number].country_id = traveler.traveler.countryId;
        this.travelers[`type${cartNumber}`].adults[traveler_number].dob = moment(traveler.traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY');
        if (this.travelers[`type${cartNumber}`].adults[traveler_number].is_passport_required) {
          this.travelers[`type${cartNumber}`].adults[traveler_number].passport_number = traveler.traveler.passportNumber;
          this.travelers[`type${cartNumber}`].adults[traveler_number].passport_expiry = moment(traveler.traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy');
        }
        this.travelers[`type${cartNumber}`].adults[traveler_number].module = this.cartItem.type;
        if ((this.cartItem.type == 'flight' && traveler.traveler.user_type == 'adult') || (this.cartItem.type == 'hotel' && traveler_number == 0)) {
          this.travelers[`type${cartNumber}`].adults[traveler_number].is_email_required = true;
          this.travelers[`type${cartNumber}`].adults[traveler_number].is_phone_required = true;
        }
        else {
          this.travelers[`type${cartNumber}`].adults[traveler_number].is_email_required = false;
          this.travelers[`type${cartNumber}`].adults[traveler_number].is_phone_required = false;
        }
        this.patch();
      }
    }, error => {
     
    }) 
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
      let control: any = <FormArray>this.travelerForm.get(`type${i}.adults`);
      control.controls = [];
      this.travelers[`type${i}`].adults.forEach((x, i) => {
        control.push(this.patchValues(x, i))
      })
    }
  }

  patchValues(x, i) {

    if (x.module == 'flight') {
      return this.formBuilder.group({
        first_name: [x.first_name, [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
        last_name: [x.last_name, [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
        email: (x.type === 'adult' || x.type === '') ? [x.email, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]] : [x.email],
        phone_no: (x.type === 'adult' || x.type === '') ? [x.phone_no, [Validators.required, Validators.minLength(10)]] : [x.phone_no],
        phone_no_format: (x.type === 'adult' || x.type === '') ? [x.phone_no_format, [Validators.required]] : [x.phone_no_format],
        phone_no_length: (x.type === 'adult' || x.type === '') ? [x.phone_no_length, [Validators.required]] : [x.phone_no_length],
        country_code: (x.type === 'adult' || x.type === '') ? [x.country_code, [Validators.required]] : [x.country_code],
        passport_number: (x.is_passport_required) ? [x.passport_number, [Validators.required]] : [x.passport_number],
        passport_expiry: (x.is_passport_required) ? [x.passport_expiry || null, [Validators.required]] : [x.passport_expiry],
        is_passport_required: [x.is_passport_required, [Validators.required]],
        dob: [x.dob ? x.dob : '', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/), checkValidDate()]],
        country_id: [x.country_id ? x.country_id : 233, [Validators.required]],
        gender: [x.gender, [Validators.required]],
        userId: [x.userId],
        type: [x.type],
        dobMinDate: [x.dobMinDate],
        dobMaxDate: [x.dobMaxDate],
        module: [x.module],
        module_id: [x.module_id],
        is_valid_date: [x.is_valid_date],
        is_email_required: [x.is_email_required],
        is_phone_required: [x.is_phone_required]
      }, { updateOn: 'blur' });
    }
    if (x.module == 'hotel') {
      return this.formBuilder.group({
        first_name: [x.first_name, [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
        last_name: [x.last_name, [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
        email: (i == 0) ? [x.email, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]] : [x.email],
        phone_no: (i == 0) ? [x.phone_no, [Validators.required, Validators.minLength(10)]] : [x.phone_no],
        phone_no_format: (i == 0) ? [x.phone_no_format, [Validators.required]] : [x.phone_no_format],
        phone_no_length: (i == 0) ? [x.phone_no_length, [Validators.required]] : [x.phone_no_length],
        country_code: (i == 0) ? [x.country_code, [Validators.required]] : [x.country_code],
        userId: [x.userId],
        dob: [x.dob],
        gender: [x.gender],
        passport_number: [x.passport_number],
        passport_expiry: [x.passport_expiry],
        is_passport_required: [x.is_passport_required],
        country_id: [x.country_id],
        type: [x.type],
        module: [x.module],
        module_id: [x.module_id],
        is_valid_date: [x.is_valid_date],
        is_email_required: [x.is_email_required],
        is_phone_required: [x.is_phone_required]
      }, { updateOn: 'blur' });
    }

  }

  submit(value) {

  }


  selectTravelerNumber(event, cartNumber, traveler_number) {
    
    this.traveler_number = traveler_number;
    for(let j=0; j<this.travelers[`type${cartNumber}`].adults.length; j++){

      this.travelers[`type${cartNumber}`].adults[j].is_active = false;
    }
    this.travelers[`type${cartNumber}`].adults[traveler_number].is_active = !this.travelers[`type${cartNumber}`].adults[traveler_number].is_active;
    let userId = this.travelers[`type${cartNumber}`].adults[traveler_number].userId;
    $(document).on("click", ".card-header", function () {
      if ($(this).find('.card-link').hasClass('collapsed')) {
        $(this).find('.traveler_drop_down').addClass('hide_section')
        $(this).find('.trv_name').removeClass('hide_section')
        if (userId != "") {
          $(this).find('.mob_names').addClass('hide_section')
        }
      }
      else {
        $(this).find('.trv_name').addClass('hide_section')
        $(this).find('.traveler_drop_down').removeClass('hide_section')
        if (userId != "") {
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

  saveTraveler(cartNumber, traveler_number) {
    this.travelers[`type${cartNumber}`].adults[traveler_number].is_submitted = true;
    if (this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].status == 'VALID' &&
      this.travelers[`type${cartNumber}`].adults[traveler_number].is_valid_date) {
      
      for(let j=0; j<this.travelers[`type${cartNumber}`].adults.length; j++){

        this.travelers[`type${cartNumber}`].adults[j].is_active = false;
      } 
      this.travelers[`type${cartNumber}`].adults[traveler_number+1].is_active = true;
      this.traveler_number = traveler_number+1;
    }
  }


  editTraveler(cartNumber, traveler_number) {
    this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].enable()
    this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].markAsTouched();
  }

  selectTraveler(travlerId, traveler_number, cartNumber) {
    let traveler = this.myTravelers.find(x => x.userId == travlerId)
    if (traveler && Object.keys(traveler).length > 0) {
      this.travelers[`type${cartNumber}`].adults[traveler_number].first_name = traveler.firstName;
      this.travelers[`type${cartNumber}`].adults[traveler_number].last_name = traveler.lastName;
      this.travelers[`type${cartNumber}`].adults[traveler_number].email = (this.accountHolderEmail && traveler_number == 0) ? this.accountHolderEmail : traveler.email;
      this.travelers[`type${cartNumber}`].adults[traveler_number].userId = traveler.userId;
      this.travelers[`type${cartNumber}`].adults[traveler_number].gender = traveler.gender;
      this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no = traveler.phoneNo;
      this.travelers[`type${cartNumber}`].adults[traveler_number].country_code = traveler.countryCode || '+1';
      this.travelers[`type${cartNumber}`].adults[traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
      this.travelers[`type${cartNumber}`].adults[traveler_number].dob = traveler.dob ? moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY') : '';

      this.travelers[`type${cartNumber}`].adults[traveler_number].module = this.cartItem.type;
      if ((this.cartItem.type == 'flight' && traveler.user_type == 'adult') || (this.cartItem.type == 'hotel' && traveler_number == 0)) {
        this.travelers[`type${cartNumber}`].adults[traveler_number].is_email_required = true;
        this.travelers[`type${cartNumber}`].adults[traveler_number].is_phone_required = true;
      }
      else {
        this.travelers[`type${cartNumber}`].adults[traveler_number].is_email_required = false;
        this.travelers[`type${cartNumber}`].adults[traveler_number].is_phone_required = false;
      }

      if (this.travelers[`type${cartNumber}`].adults[traveler_number].is_passport_required) {
        this.travelers[`type${cartNumber}`].adults[traveler_number].passport_number = traveler.passportNumber;
        this.travelers[`type${cartNumber}`].adults[traveler_number].passport_expiry = traveler.passportExpiry && traveler.passportExpiry != 'Invalid date' ? `${moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy')}` : '';
      }
      //return false;
      this.patch();
    }

    this.checkOutService.emitTravelersformData(this.travelerForm);
    this.cd.detectChanges();
  }

  checkMaximumMinimum(event, dobValue, cartNumber, traveler_number) {
    // CHECK MAXIMUM OR MINIMUM DATE OF BIRTH
    console.log(dobValue,"dobValue")
    let traveler = this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].value;
    console.log("Innn")
    if (
      moment(dobValue)
        .isBetween(moment(this.travelers[`type${cartNumber}`].adults[traveler_number].dobMinDate).format('YYYY-MM-DD'),
          moment(this.travelers[`type${cartNumber}`].adults[traveler_number].dobMaxDate).format('YYYY-MM-DD')) &&
      this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls['dob'].errors === null
    ) {
      console.log("true")
      this.travelers[`type${cartNumber}`].adults[traveler_number].is_valid_date = true;
      this.travelers[`type${cartNumber}`].adults[traveler_number].dob =moment(dobValue,"YYYY-MM-DD").format("MM/DD/YYYY");
      this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls['dob'].setErrors(null);
      //this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls['dob'].updateValueAndValidity();
    } else {
      console.log("false")
      this.travelers[`type${cartNumber}`].adults[traveler_number].is_valid_date = false;
      this.travelers[`type${cartNumber}`].adults[traveler_number].dob = moment(dobValue,"YYYY-MM-DD").format("MM/DD/YYYY");
      this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls['dob'].setErrors({ 'incorrect': true });
      //this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls['dob'].updateValueAndValidity();
    }
    /* this.travelers[`type${cartNumber}`].adults[traveler_number].first_name = traveler.first_name;
    this.travelers[`type${cartNumber}`].adults[traveler_number].last_name = traveler.last_name;
    this.travelers[`type${cartNumber}`].adults[traveler_number].email = traveler.email;
    this.travelers[`type${cartNumber}`].adults[traveler_number].userId = traveler.userId;
    this.travelers[`type${cartNumber}`].adults[traveler_number].gender = traveler.gender;
    this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no = traveler.phone_no;
    this.travelers[`type${cartNumber}`].adults[traveler_number].country_code = traveler.country_code || '+1';
    this.travelers[`type${cartNumber}`].adults[traveler_number].country_id = traveler.country_id != null ? traveler.country_id : '';

    if (this.travelers[`type${cartNumber}`].adults[traveler_number].is_passport_required) {
      this.travelers[`type${cartNumber}`].adults[traveler_number].passport_number = traveler.passport_number;
      this.travelers[`type${cartNumber}`].adults[traveler_number].passport_expiry = traveler.passport_expiry ? `${moment(traveler.passport_expiry, "YYYY-MM-DD").format('MMM DD, yy')}` : '';
    } */
    //this.patch();
    console.log(this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls['dob'],"=");
    //this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.dob.markAsTouched();
  }

  validateCountryWithPhoneNumber(event, cartNumber, traveler_number): void {
    this.setPhoneNumberFormat(event.phonecode, cartNumber, traveler_number);
  }

  setPhoneNumberFormat(phonecode, cartNumber, traveler_number) {
    if (this.travelers[`type${cartNumber}`].adults[traveler_number].type == 'adult') {
      let phoneFormat = getPhoneFormat(phonecode);
      this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.phone_no.setValidators([Validators.minLength(phoneFormat.length)]);
      this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.phone_no.updateValueAndValidity();
      this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no_format = phoneFormat.format;
      this.travelers[`type${cartNumber}`].adults[traveler_number].phone_no_length = phoneFormat.length;
    }
  }

  // Author: xavier | 2021/8/18
  // Description: Translates hotel's room description using Google's translation API.
  translateHotelRoomDescription() {
    const lang: string = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    if(lang == "en" || this.cartItem.type != 'hotel') return;

    let body = new HttpParams();
    body = body.set('q', this.cartItem.module_info.title)
               .set('source', 'en')
               .set('target', lang)
               .set('format', 'text')
               .set('model', 'nmt')
               .set('key', 'AIzaSyAM2IBT7FXhbv1NFqqVEdYkFDTyqPUhmR8');

    class gApiResp { 
      data: {
        translations: {
          translatedText: string[],
          detectedSourceLanguage: string,
          model: string
        }[];
      }
    }

    this.http
      .post<gApiResp>('https://translation.googleapis.com/language/translate/v2', body)
      .subscribe(
        res => this.cartItem.module_info.title = res.data.translations[0].translatedText
      );
  }
}