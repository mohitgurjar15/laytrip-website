import { Component, Input, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
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

  coAccountForm: FormGroup;
  countries: any = [];
  traveller: any = [];
  countries_code: any = [];
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

  ) { }

  ngOnInit() {
    this.checkUser();
    this.getCountry();
    let location:any = this.cookieService.get('__loc');
    location = JSON.parse(location);

    this.coAccountForm = this.formBuilder.group({
      title: ['mr'],
      gender: ['M'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      country_code: [location.country.phonecode ? location.country.phonecode : '', [Validators.required]],
      phone_no: ['', [Validators.required]],
      country_id: [location.country.name ? location.country.name : '', Validators.required],
      dob: ['', Validators.required],
      passport_expiry: [''],
      passport_number: [''],
      user_type: ['']
    });
    this.setUserTypeValidation();

    if (this.travellerId) {
      
      this.setTravelerForm();
    }
  }

  setTravelerForm() {
    
      this.traveller = this.travelerInfo;
      this.coAccountForm.patchValue({
        title: this.travelerInfo.title?this.travelerInfo.title:'mr',
        firstName: this.travelerInfo.firstName ? this.travelerInfo.firstName : '',
        lastName: this.travelerInfo.lastName ? this.travelerInfo.lastName : '',
        email: this.travelerInfo.email ? this.travelerInfo.email : '',
        gender: this.travelerInfo.gender ? this.travelerInfo.gender : 'M',
        phone_no: this.travelerInfo.phoneNo ? this.travelerInfo.phoneNo : '',
        country_code: this.travelerInfo.countryCode ? this.travelerInfo.countryCode : '',
        country_id: this.travelerInfo.country.name ? this.travelerInfo.country.name : '',
        dob: this.travelerInfo.dob ? new Date(this.travelerInfo.dob) : '',
        passport_number: this.travelerInfo.passportNumber ? this.travelerInfo.passportNumber : '',
        passport_expiry: this.travelerInfo.passportExpiry ? new Date(this.travelerInfo.passportExpiry) : '',   
    });
  }

  close() {
    this.activeModal.close();
  }

  setUserTypeValidation() {

    const emailControl = this.coAccountForm.get('email');
    const phoneControl = this.coAccountForm.get('phone_no');
    const countryControl = this.coAccountForm.get('country_code');
    const passport_expiryControl = this.coAccountForm.get('passport_expiry');

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
        })
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    this.submitted = this.loading = true;
    if (this.coAccountForm.invalid) {
      this.submitted = true;
      this.loading = false;
      return;
    } else {
     
      let country_id = this.coAccountForm.value.country_id.id;
      if (!Number(country_id)) {
        country_id = this.traveller.country.id;
      }
      let jsonData = {
        title: this.coAccountForm.value.title,
        first_name: this.coAccountForm.value.firstName,
        last_name: this.coAccountForm.value.lastName,
        dob: typeof this.coAccountForm.value.dob === 'object' ? moment(this.coAccountForm.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(this.coAccountForm.value.dob, '/')).format('YYYY-MM-DD'),
        gender: this.coAccountForm.value.gender,
        country_id: country_id ? country_id : '',
        passport_expiry: typeof this.coAccountForm.value.passport_expiry === 'object' ? moment(this.coAccountForm.value.passport_expiry).format('YYYY-MM-DD') : moment(this.stringToDate(this.coAccountForm.value.passport_expiry, '/')).format('YYYY-MM-DD'),
        passport_number: this.coAccountForm.value.passport_number,
        country_code: this.coAccountForm.value.country_code &&
          this.coAccountForm.value.country_code !== 'null' ? this.coAccountForm.value.country_code : this.coAccountForm.value.country_code,
        phone_no: this.coAccountForm.value.phone_no,
      };
      let emailObj = { email: this.coAccountForm.value.email ? this.coAccountForm.value.email : '' };

      if (this.travellerId) {
        // jsonData = Object.assign(jsonData, emailObj);

        this.flightService.updateAdult(jsonData,this.travellerId).subscribe((data: any) => {
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
        
        this.flightService.addAdult(jsonData).subscribe((data: any) => {
          this.travelersChanges.emit(data);
          this.activeModal.close();
        }, (error: HttpErrorResponse) => {
          console.log('error')
          this.submitted = this.loading = false;
          if (error.status === 401) {
            this.router.navigate(['/']);
          } else {
            this.submitted = this.loading = false;
            this.toastr.error(error.error.message, 'Traveller Update Error');
          }
        });

      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  stringToDate(string, saprator) {
    let dateArray = string.split(saprator);
    return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
  }

}
