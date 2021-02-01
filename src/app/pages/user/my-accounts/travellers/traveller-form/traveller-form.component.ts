import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GenericService } from '../../../../../services/generic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightService } from '../../../../../services/flight.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../../services/user.service';
import { CookieService } from 'ngx-cookie';
import { TravelerService } from '../../../../../services/traveler.service';

@Component({
  selector: 'app-traveller-form',
  templateUrl: './traveller-form.component.html',
  styleUrls: ['./traveller-form.component.scss']
})
export class TravellerFormComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Output() travelersChanges = new EventEmitter();
  @Input() travellerId: any;
  @Input() travelerInfo: any;
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
  minyear;
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
    public activeModal: NgbActiveModal,
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
      // title: ['mr'],
      gender: ['M'],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      phone_no: ['', [Validators.required]],
      country_id: [typeof this.location != 'undefined' ? this.location.country.name : '', [Validators.required]],
      country_code: [typeof countryCode != 'undefined' ? countryCode.country_name : '', [Validators.required]],
      dob: ['', Validators.required],
      // passport_expiry: [''],
      passport_number: [''],
      // user_type: ['']
    });

    // this.setUserTypeValidation();

    if (this.travellerId) {
      // this.setTravelerForm();
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
  }

  close() {
    this.activeModal.close();
  }

  setUserTypeValidation() {

    const emailControl = this.travellerForm.get('email');
    const phoneControl = this.travellerForm.get('phone_no');
    const countryControl = this.travellerForm.get('country_code');
    const passport_expiryControl = this.travellerForm.get('passport_expiry');

    this.dobMinDate = new Date(moment().subtract(50, 'years').format("MM/DD/YYYY"));
    this.dobMaxDate = new Date(moment().format("MM/DD/YYYY"));
    this.minyear = moment(this.dobMinDate).format("YYYY") + ":" + moment(this.dobMaxDate).format("YYYY");

    emailControl.updateValueAndValidity();
    phoneControl.updateValueAndValidity();
    countryControl.updateValueAndValidity();
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');
    if (userToken) {
      this.isLoggedIn = true;
    }
  }

  onSubmit() {
    this.submitted = this.loading = true;
    if (this.travellerForm.invalid) {
      this.submitted = true;
      this.loading = false;
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
      let country_code = this.travellerForm.value.country_code;
      if (typeof country_code == 'object') {
        country_code = country_code.id ? country_code.id : this.location.country.id;
      } else if (typeof country_code == 'string') {
        country_code = this.travelerInfo.countryCode ? this.travelerInfo.countryCode : this.location.country.id;
      } else {
        country_code = this.location.country.id;
      }

      let jsonData = {
        // title: this.travellerForm.value.title,
        first_name: this.travellerForm.value.firstName,
        last_name: this.travellerForm.value.lastName,
        dob: typeof this.travellerForm.value.dob === 'object' ? moment(this.travellerForm.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(this.travellerForm.value.dob, '/')).format('YYYY-MM-DD'),
        gender: this.travellerForm.value.gender,
        country_id: country_id ? country_id : '',
        passport_expiry: typeof this.travellerForm.value.passport_expiry === 'object' ? moment(this.travellerForm.value.passport_expiry).format('YYYY-MM-DD') : null,
        passport_number: this.travellerForm.value.passport_number,
        country_code: country_code ? country_code : this.location.country.id,
        phone_no: this.travellerForm.value.phone_no,
      };
      let emailObj = { email: this.travellerForm.value.email ? this.travellerForm.value.email : '' };

      if (this.travellerId) {
        jsonData = Object.assign(jsonData, emailObj);
        this.travelerService.updateAdult(jsonData, this.travellerId).subscribe((data: any) => {
          this.travelersChanges.emit(data);
          this.activeModal.close();
        }, (error: HttpErrorResponse) => {
          this.submitted = this.loading = false;
          if (error.status === 401) {
            this.router.navigate(['/']);
          }
          this.toastr.error(error.error.message, 'Traveller Update Error');
        });
      } else {
        jsonData = Object.assign(jsonData, emailObj);

        this.travelerService.addAdult(jsonData).subscribe((data: any) => {
          this.travelersChanges.emit(data);
          this.activeModal.close();
        }, (error: HttpErrorResponse) => {
          console.log('error')
          this.submitted = this.loading = false;
          if (error.status === 401) {
            this.router.navigate(['/']);
          } else {
            this.submitted = this.loading = false;
            this.toastr.error(error.error.message, 'Traveller Add Error');
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
        console.log(this.countries)

    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  stringToDate(string, saprator) {
    let dateArray = string.split(saprator);
    return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
  }

  selectGender(event,type){
    this.is_gender = true; 
    if(type =='M'){
      this.is_type = 'M';        
    }else if(type =='F'){
      this.is_type = 'F';        
    } else if(type =='O'){
      this.is_type = 'O';        
    } 
  } 
}
