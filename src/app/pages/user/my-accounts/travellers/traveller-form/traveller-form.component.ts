import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GenericService } from '../../../../../services/generic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightService } from '../../../../../services/flight.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../../services/user.service';
import { CookieService } from 'ngx-cookie';
import { TravelerService } from '../../../../../services/traveler.service';
import { phoneAndPhoneCodeValidation } from '../../../../../_helpers/custom.validators';

@Component({
  selector: 'app-traveller-form',
  templateUrl: './traveller-form.component.html',
  styleUrls: ['./traveller-form.component.scss']
})
export class TravellerFormComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() travellerId: any;
  @Input() travelerInfo: any;
  @Output() loadingValue = new EventEmitter<boolean>();
  @Output() travelerFormChange = new EventEmitter();
  countries = [];
  countries_code = [];
  is_gender: boolean = true;
  is_type: string = 'M';
  travellerForm: FormGroup;
  traveller: any = [];
  isLoggedIn: boolean = false;
  submitted = false;
  loading = false;
  dobMinDate;
  dobMaxDate;
  dobYearRange;
  maxyear;
  expiryMinDate = new Date(moment().format("YYYY-MM-DD"));
  subscriptions: Subscription[] = [];
  locale = {
    format: 'DD/MM/YYYY',
    displayFormat: 'DD/MM/YYYY'
  };
  location;
  isChild = false;
  isInfant = false;
  isAdult = true;

  constructor(
    private formBuilder: FormBuilder,
    private genericService: GenericService,
    public router: Router,
    public commonFunction: CommonFunction,
    private flightService: FlightService,
    private userService: UserService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private travelerService:TravelerService

  ) { }

  ngOnInit() {
    this.getCountry();
    let location: any = this.cookieService.get('__loc');
    try {
      this.location = JSON.parse(location);
    }
    catch (e) {
    }
    let countryCode: any;
    if (this.location) {
      countryCode = this.countries_code.filter(item => item.id == this.location.country.id)[0];
    }

    this.travellerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      gender: ['',[Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      phone_no: ['', [Validators.required, Validators.minLength(10)]],
      country_id: [typeof this.location != 'undefined' ? this.location.country.name : '', [Validators.required]],
      country_code: [typeof countryCode != 'undefined' ? countryCode.country_name : '', [Validators.required]],
      dob: ['', Validators.required],
      passport_expiry: [''],
      passport_number: [''],
    },{validators:phoneAndPhoneCodeValidation()});

    this.setUserTypeValidation();
    if (this.travellerId) {
      this.setTravelerForm();
    }
  }    
    
  setTravelerForm() {
    this.traveller = this.travelerInfo;
    let countryCode = '';
    if (typeof this.travelerInfo.countryCode != 'undefined' && typeof this.travelerInfo.countryCode == 'string') {
      countryCode = this.countries_code.filter(item => item.id == this.travelerInfo.countryCode)[0];
    } else {
      countryCode = this.countries_code.filter(item => item.id == this.location.country.id)[0];
    }
    var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
    this.isAdult = false;
    console.log(moment(this.travelerInfo.dob).format('YYYY-MM-DD') ,   adult12YrPastDate)
    if(moment(this.travelerInfo.dob).format('YYYY-MM-DD') <   adult12YrPastDate){
      this.isAdult = true;
    }
    console.log(this.isAdult,'isAdult')

    this.travellerForm.patchValue({
      // title: this.travelerInfo.title?this.travelerInfo.title:'mr',
      firstName: this.travelerInfo.firstName ? this.travelerInfo.firstName : '',
      lastName: this.travelerInfo.lastName ? this.travelerInfo.lastName : '',
      email: this.travelerInfo.email ? this.travelerInfo.email : '',
      gender: this.travelerInfo.gender ? this.travelerInfo.gender : 'M',
      phone_no: this.travelerInfo.phoneNo ? this.travelerInfo.phoneNo : '',
      country_code: countryCode,
      country_id: typeof this.travelerInfo.country != 'undefined' && this.travelerInfo.country ? this.travelerInfo.country.name : '',
      dob: this.travelerInfo.dob ? new Date(this.travelerInfo.dob) : '',
      passport_number: this.travelerInfo.passportNumber ? this.travelerInfo.passportNumber : '',
      passport_expiry: this.travelerInfo.passportExpiry ? new Date(this.travelerInfo.passportExpiry) : '',
    });
  }

  changeDateOfBirth(event) {
    let todayDate = moment();
    let birthYear = moment(event, 'YYYY');
    let age = parseInt(todayDate.diff(birthYear, 'y', true).toFixed(2));
    if (age && age === 2 || age > 2 && age < 12) {
      // FOR CHILD
      this.isChild = true;
      this.isInfant = false;
      this.isAdult = false;
    } else if (age && age < 2 || age === 0) {
      // FOR INFANT
      this.isInfant = true;
      this.isAdult = false;
      this.isChild = false;
    } else if (age && age > 12) {
      // FOR ADULT
      this.isChild = false;
      this.isInfant = false;
      this.isAdult = true;
    } else {
      // FOR ONLY ADULT
      this.isAdult = true;
      this.isChild = false;
      this.isInfant = false;
    }
    console.log(this.isAdult)
  }

  setUserTypeValidation() {    
    this.dobMinDate = new Date(moment().subtract(50, 'years').format("MM/DD/YYYY"));
    this.dobMaxDate = new Date(moment().format("MM/DD/YYYY"));
    this.dobYearRange = moment(this.dobMinDate).format("YYYY") + ":" + moment(this.dobMaxDate).format("YYYY");
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');
    if (userToken) {
      this.isLoggedIn = true;
    }
  }

  onSubmit() {
    this.submitted = true;
    this.loadingValue.emit(true);
    if (this.travellerForm.invalid) {
      this.submitted = true;
      this.loadingValue.emit(false);
      return;
    } else {

      let country_id = this.travellerForm.value.country_id.id;
      if (!Number(country_id)) {
        if (this.traveller.country) {
          country_id = (this.traveller.country.id) ? this.traveller.country.id : '';
        } else {
          country_id = this.location.country.id;
        }
      }
      
      let jsonData = {
        first_name: this.travellerForm.value.firstName,
        last_name: this.travellerForm.value.lastName,
        dob: typeof this.travellerForm.value.dob === 'object' ? moment(this.travellerForm.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(this.travellerForm.value.dob, '/')).format('YYYY-MM-DD'),
        gender: this.travellerForm.value.gender ? this.travellerForm.value.gender : 'M',
        country_id: country_id ? country_id : '',
        passport_expiry: typeof this.travellerForm.value.passport_expiry === 'object' ? moment(this.travellerForm.value.passport_expiry).format('YYYY-MM-DD') : null,
        passport_number: this.travellerForm.value.passport_number,
        country_code: this.travellerForm.value.country_code ? this.travellerForm.value.country_code  : '',
        phone_no: this.travellerForm.value.phone_no,
      };
      let emailObj = { email: this.travellerForm.value.email ? this.travellerForm.value.email : '' };
      
      
      if (this.travellerId) {
        jsonData = Object.assign(jsonData, emailObj);
        console.log(jsonData,this.travellerId);
        this.travelerService.updateAdult(jsonData, this.travellerId).subscribe((data: any) => {
          this.travelerFormChange.emit(data);
          this.loadingValue.emit(false);
          this.toastr.success('Success', 'Traveller Updated Successfully');
        }, (error: HttpErrorResponse) => {
          this.submitted = false; this.loadingValue.emit(false);
          this.toastr.error(error.error.message, 'Traveller Update Error');
          if (error.status === 401) {
            this.router.navigate(['/']);
          }
        });
      } else {
        jsonData = Object.assign(jsonData, emailObj);

        this.travelerService.addAdult(jsonData).subscribe((data: any) => {
          this.travelerFormChange.emit(data);
          this.loadingValue.emit(false);
          this.travellerForm.reset();
          this.travellerForm.setErrors(null);
          this.toastr.success('Success', 'Traveller Add Successfully');

        }, (error: HttpErrorResponse) => {
          this.submitted = false;
          this.loadingValue.emit(false);
          this.toastr.error(error.error.message, 'Traveller Add Error');
          if (error.status === 401) {
            this.router.navigate(['/']);
          }
        });

      }
    }
  }

  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country => {
        return {
          id: country.id,
          name: country.name,
          code: country.phonecode,
          flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.jpg'
        }
      }),
        this.countries_code = data.map(country => {
          return {
            id: country.id,
            name: country.phonecode+' ('+country.iso2+')',
            code:country.phonecode,
            country_name:country.name+ ' ' +country.phonecode,
            flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.jpg'
          }
        });
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  stringToDate(string, saprator) {
    let dateArray = string.split(saprator);
    return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
  }

  selectDob(event){
    var selectedDate = moment(event).format('YYYY-MM-DD');
    var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
    const emailControl = this.travellerForm.get('email');
    const phoneControl = this.travellerForm.get('phone_no');
    const countryControl = this.travellerForm.get('country_code');
    if(selectedDate < adult12YrPastDate) {
     this.isAdult = true;
      emailControl.setValidators(Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$'))     
      phoneControl.setValidators([Validators.required,Validators.minLength(10)]);
      countryControl.setValidators([Validators.required]);

    } else {
      this.isAdult = false;
      emailControl.setValidators(null)
      phoneControl.setValidators(null)
      countryControl.setValidators(null)
      phoneControl.updateValueAndValidity();
      emailControl.updateValueAndValidity();
      countryControl.updateValueAndValidity();
    }
  }

}
