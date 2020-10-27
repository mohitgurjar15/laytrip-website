import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { phoneAndPhoneCodeValidation, WhiteSpaceValidator } from '../../_helpers/custom.validators';


declare var $: any;

@Component({
  selector: 'app-traveler-form',
  templateUrl: './traveler-form.component.html',
  styleUrls: ['./traveler-form.component.scss']
})

export class TravelerFormComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input('var') usersType: any = '';
  @Input() traveler: any = [];
  @Input() type: string;
  @Input() countries: [];
  @Input() countries_code: [];
  @Output() travelerFormChange = new EventEmitter();
  @Output() auditFormStatus = new EventEmitter();

  adultForm: FormGroup;
  submitted = false;
  loading = false;
  isLoggedIn = false;
  defaultDate = moment().add(1, 'months').format("DD MMM'YY dddd");
  editMode = false;
  formStatus: boolean = false;
  is_passport_required: boolean = false;
  _itinerary:any;
  _date = new Date();
  locale = {
    format: 'DD/MM/YYYY',
    displayFormat: 'DD/MM/YYYY'
  };

  dobMinDate;
  dobMaxDate; 
  minyear;
  maxyear;
  expiryMinDate = new Date(moment().format("YYYY-MM-DD"));
  location;
  
  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,
    public router: Router,
    public commonFunction: CommonFunction,
    private cookieService: CookieService,
    private toastr: ToastrService,

  ) { }

  ngOnInit() {
    let location:any = this.cookieService.get('__loc');
    try{
      this.location = JSON.parse(location);
    }
    catch(e){

    }
    
    this.adultForm = this.formBuilder.group({
      title: ['mr',Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['M', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      country_code: [typeof this.location!='undefined' ? this.location.country.phonecode : '', [Validators.required]],
      country_id: [typeof this.location!='undefined' ? this.location.country.name : ''],
      phone_no: ['', [Validators.required]],
      dob : ['', Validators.required],
      passport_expiry : [''],
      frequently_no: [''],
      user_type: ['']
    }, { validator: phoneAndPhoneCodeValidation(this.type) });

    this.setUserTypeValidation();

    if (this.traveler.userId) {

      this.adultForm.patchValue({
        title: this.traveler.title ? this.traveler.title : 'mr',
        firstName: this.traveler.firstName? this.traveler.firstName :'',
        lastName: this.traveler.lastName ? this.traveler.lastName : '',
        email: this.traveler.email,
        gender: this.traveler.gender ? this.traveler.gender : 'M',
        country_code: this.traveler.countryCode ? this.traveler.countryCode : this.location.country.phonecode,
        phone_no: this.traveler.phoneNo,
        country_id: this.traveler.country != null ? this.traveler.country.name : this.location.country.name,
        passport_number: this.traveler.passportNumber,
        dob: this.traveler.dob ? new Date(this.traveler.dob) : '',
        passport_expiry: this.traveler.passport_expiry ? new Date(this.traveler.passport_expiry) : '',
        frequently_no: ''
      });
    }
  }

  ngDoCheck() {
    this.checkUser();
    this.countries = this.countries;
    this.countries_code = this.countries_code;
  }

  setUserTypeValidation() {
    this._itinerary =  this.cookieService.get('_itinerary') ? JSON.parse(this.cookieService.get('_itinerary')) : [];
    
    const emailControl = this.adultForm.get('email');
    const phoneControl = this.adultForm.get('phone_no');
    const countryControl = this.adultForm.get('country_code');
    const passport_numberControl = this.adultForm.get('passport_number');
    const passport_expiryControl = this.adultForm.get('passport_expiry');
    if (this.type === 'adult') {
      emailControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]);
      phoneControl.setValidators([Validators.required]);
      countryControl.setValidators([Validators.required]);

      this.dobMinDate = new Date(moment().subtract(50,'years').format("MM/DD/YYYY") );
      this.dobMaxDate = new Date(moment().subtract(12, 'years').format("MM/DD/YYYY"));
      this.minyear = moment(this.dobMinDate).format("YYYY") + ":"+ moment(this.dobMaxDate).format("YYYY");
    } else if (this.type === 'child') {
      this.dobMinDate =  new Date(moment().subtract(12,'years').format("MM/DD/YYYY") );
      this.dobMaxDate =  new Date(moment().subtract(2,'years').format("MM/DD/YYYY") );
      this.minyear = moment(this.dobMinDate).format("YYYY") + ":"+ moment(this.dobMaxDate).format("YYYY");
      emailControl.setValidators(Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$'))
      phoneControl.setValidators(null)
      countryControl.setValidators(null);
    } else if (this.type === 'infant') {
      this.dobMinDate =  new Date(moment().subtract(2,'years').format("MM/DD/YYYY") );
      this.dobMaxDate = new Date();
      this.minyear = moment(this.dobMinDate).format("YYYY") + ":"+ moment(this.dobMaxDate).format("YYYY");
      emailControl.setValidators(Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$'))
      phoneControl.setValidators(null)
      countryControl.setValidators(null)
    } 
    if((this.type === 'adult' || this.type === 'child') && this.is_passport_required){
      passport_numberControl.setValidators([Validators.required]);
      passport_expiryControl.setValidators([Validators.required]);
      passport_numberControl.updateValueAndValidity();
    }
    emailControl.updateValueAndValidity();
    phoneControl.updateValueAndValidity();
    countryControl.updateValueAndValidity();
    passport_expiryControl.updateValueAndValidity();
  }

  ngOnChanges(changes) {
    if (changes['traveler']) {
    }
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');
    this.isLoggedIn = false;
    if (userToken && userToken != 'undefined' && userToken != 'null') {
      this.isLoggedIn = true;
    }
  }

  onSubmit() {
    this.submitted = this.loading = true;
    if (this.adultForm.invalid) {
      console.log(this.adultForm)
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      let country_id = this.adultForm.value.country_id.id;
      if (!Number(country_id)) {
        if(this.traveler.country){
          country_id = ( this.traveler.country.id ) ? this.traveler.country.id : '';
        } else {
          country_id = this.location.country.id;
        }
      }
    
      let jsonData = {
        title: this.adultForm.value.title,
        first_name: this.adultForm.value.firstName,
        last_name: this.adultForm.value.lastName,
        frequently_no: this.adultForm.value.frequently_no,
        passport_number: this.adultForm.value.passport_number,
        dob: typeof this.adultForm.value.dob === 'object' ? moment(this.adultForm.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(this.adultForm.value.dob, '/')).format('YYYY-MM-DD'),
        gender: this.adultForm.value.gender,
        country_id: country_id ? country_id : '',
      };
      if((this.type === 'adult' || this.type === 'child') && this.is_passport_required){
        let passport_expiry_json = { passport_expiry: typeof this.adultForm.value.passport_expiry === 'object' ? moment(this.adultForm.value.passport_expiry).format('YYYY-MM-DD') : ''};
        jsonData = Object.assign(jsonData, passport_expiry_json);
      }

      if (this.type === 'adult') {
        let adultObj = {
          country_code: this.adultForm.value.country_code.country_name &&
            this.adultForm.value.country_code !== 'null' ? this.adultForm.value.country_code : this.adultForm.value.country_code,
          phone_no: this.adultForm.value.phone_no,
        };
        jsonData = Object.assign(jsonData, adultObj);
      }
      if (this.traveler && this.traveler.userId) {
        this.flightService.updateAdult(jsonData, this.traveler.userId).subscribe((data: any) => {
          this.submitted = this.loading = false;
          this.travelerFormChange.emit(data);
          $('.collapse').collapse('hide');
          $('#accordion-' + this.type).hide();
        }, (error: HttpErrorResponse) => {
          this.submitted = this.loading = false;
          if (error.status === 401) {
            this.toastr.error(error.error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
            this.router.navigate(['/']);
          } else {
            this.toastr.error(error.error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
          }
        });
      } else {
        if (this.type === 'adult') {
          let emailObj = { email: this.adultForm.value.email ? this.adultForm.value.email : '' };
          jsonData = Object.assign(jsonData, emailObj);
        }
        
        this.flightService.addAdult(jsonData).subscribe((data: any) => {
          this.adultForm.reset();
          this.submitted = this.loading = false;
          if (!this.isLoggedIn) {
            localStorage.setItem("_lay_sess", data.token);
          }          
          this.travelerFormChange.emit(data);

          $('.collapse').collapse('hide');
          $('#accordion-' + this.type).hide();
        }, (error: HttpErrorResponse) => {
          this.submitted = this.loading = false;
          if (error.status === 401) {
            this.toastr.error(error.error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
            this.router.navigate(['/']);
          } else {
            this.toastr.error(error.error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
          }
        })        
      }
    }
  }

  stringToDate(string, saprator) {
    let dateArray = string.split(saprator);
    return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
  }
}
