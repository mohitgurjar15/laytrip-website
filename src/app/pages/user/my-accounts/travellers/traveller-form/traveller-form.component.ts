import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { TravelerService } from '../../../../../services/traveler.service';
import { phoneAndPhoneCodeValidation } from '../../../../../_helpers/custom.validators';
import { CheckOutService } from '../../../../../services/checkout.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-traveller-form',
  templateUrl: './traveller-form.component.html',
  styleUrls: ['./traveller-form.component.scss']
})
export class TravellerFormComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() travellerId: any;
  @Input() travelerInfo: any;
  @Input() countries: [];
  @Output() loadingValue = new EventEmitter<boolean>();
  @Output() travelerFormChange = new EventEmitter();
  @Output() deleteTravelerId = new EventEmitter();
  // countries = [];
  countries_code = [];
  is_gender: boolean = true;
  is_type: string = 'M';
  travellerForm: FormGroup;
  traveller: any = [];
  isLoggedIn: boolean = false;
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
    public router: Router,
    public commonFunction: CommonFunction,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private travelerService: TravelerService,
    private checkOutService: CheckOutService,
    public modalService: NgbModal


  ) { }

  ngOnInit() {
    let location: any = this.cookieService.get('__loc');
    try {
      this.location = JSON.parse(location);
    }
    catch (e) {
    }

    this.travellerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      phone_no: ['', [Validators.required, Validators.minLength(10)]],
      country_id: ['United States' , [Validators.required]],
      country_code: ['+1', [Validators.required]],
      dob: ['', Validators.required],
      passport_expiry: [''],
      passport_number: [''],
    }, { validators: phoneAndPhoneCodeValidation() });
    
    // this.travelerFormChange.emit(this.travellerForm);

    this.setUserTypeValidation();
    if (this.travellerId) {
      this.setTravelerForm();
    }
  }

  setTravelerForm() {
    this.traveller = this.travelerInfo;

    var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
    var child2YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
    var travellerDob = moment(this.travelerInfo.dob).format('YYYY-MM-DD');
    const phoneControl = this.travellerForm.get('phone_no');
    const emailControl = this.travellerForm.get('email');
    if (travellerDob < adult12YrPastDate) {
      this.isAdult = true;
      this.isChild = false;
      phoneControl.setValidators([Validators.required]);
      emailControl.setValidators([Validators.required]);
      phoneControl.updateValueAndValidity();
      emailControl.updateValueAndValidity();

    } else if (travellerDob < child2YrPastDate) {
      this.isAdult = false;
      this.isChild = true;
      this.travellerForm.setErrors(null);
    } else {
      this.isAdult = this.isChild = false;
      this.travellerForm.setErrors(null);
    }
    this.travellerForm.patchValue({
      // title: this.travelerInfo.title?this.travelerInfo.title:'mr',
      firstName: this.travelerInfo.firstName ? this.travelerInfo.firstName : '',
      lastName: this.travelerInfo.lastName ? this.travelerInfo.lastName : '',
      email: this.travelerInfo.email ? this.travelerInfo.email : '',
      gender: this.travelerInfo.gender ? this.travelerInfo.gender : 'M',
      phone_no: this.travelerInfo.phoneNo ? this.travelerInfo.phoneNo : '',
      country_code: this.travelerInfo.countryCode ? this.travelerInfo.countryCode : '',
      country_id: typeof this.travelerInfo.country != 'undefined' && this.travelerInfo.country ? this.travelerInfo.country.name : '',
      dob: this.travelerInfo.dob ? new Date(this.travelerInfo.dob) : '',
      passport_number: this.travelerInfo.passportNumber ? this.travelerInfo.passportNumber : '',
      passport_expiry: (this.travelerInfo.passportExpiry && this.travelerInfo.passportExpiry != 'Invalid date' && this.travelerInfo.passportExpiry != '') ? new Date(this.travelerInfo.passportExpiry) : '',
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
    this.loadingValue.emit(true);
    const controls = this.travellerForm.controls;
    if (this.travellerId) {
      this.selectDob(moment(this.travellerForm.controls.dob.value).format('YYYY-MM-DD'));
    }
    if (this.travellerForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.loadingValue.emit(false);
      return;
    } else {

      let country_id = this.travellerForm.value.country_id.id;
      if (!Number(country_id)) {
        if (this.traveller.country) {
          country_id = (this.traveller.country.id) ? this.traveller.country.id : '';
        } else {
          country_id = 233;//this.location.country.id;
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
        country_code: this.travellerForm.value.country_code ? this.travellerForm.value.country_code : '',
        phone_no: this.travellerForm.value.phone_no,
      };
      let emailObj = { email: this.travellerForm.value.email ? this.travellerForm.value.email : '' };

      if (this.travellerId) {
        this.loadingValue.emit(true);
        jsonData = Object.assign(jsonData, emailObj);
        this.travelerService.updateAdult(jsonData, this.travellerId).subscribe((data: any) => {
          this.loadingValue.emit(false);
          this.travelerFormChange.emit(data);
          $("#collapseTravInner" + this.travellerId).removeClass('show');
          // this.toastr.success('', 'Traveler updated successfully');

        }, (error: HttpErrorResponse) => {
          this.loadingValue.emit(false);
          // this.toastr.error(error.error.message, 'Traveler Update Error');
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
          // this.toastr.success('', 'Traveler added successfully');

        }, (error: HttpErrorResponse) => {
          this.loadingValue.emit(false);
          // this.toastr.error(error.error.message, 'Traveler Add Error');
          if (error.status === 401) {
            this.router.navigate(['/']);
          }
        });

      }
    }
  }

  stringToDate(string, saprator) {
    let dateArray = string.split(saprator);
    return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
  }

  selectDob(event) {
    var selectedDate = moment(event).format('YYYY-MM-DD');
    var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
    var child2YrPastDate = moment().subtract(2, 'years').format("YYYY-MM-DD");
    const emailControl = this.travellerForm.get('email');
    const phoneControl = this.travellerForm.get('phone_no');
    const countryControl = this.travellerForm.get('country_code');
    if (selectedDate < adult12YrPastDate) {
      this.isAdult = true;
      this.isChild = false;
      emailControl.setValidators([Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]);
      phoneControl.setValidators([Validators.required, Validators.minLength(10)]);
      countryControl.setValidators([Validators.required]);
    } else if (selectedDate < child2YrPastDate) {
      this.isAdult = false;
      this.isChild = true;
      this.travellerForm.setValidators(null)
      emailControl.setValidators(null)
      phoneControl.setValidators(null)
      countryControl.setValidators(null)
    } else {
      this.isAdult = this.isChild = false;
      this.travellerForm.setValidators(null)
      emailControl.setValidators(null)
      phoneControl.setValidators(null)
      countryControl.setValidators(null)
    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
    countryControl.updateValueAndValidity();
  }

  deleteTraveller(travellerId){
    this.deleteTravelerId.emit(travellerId);
  }

  modalReference;
  userId;
  closeResult;

  openDeleteModal(content, userId = '') {
    this.modalReference = this.modalService.open(content, { windowClass: 'cmn_delete_modal',centered: true });
    this.userId = userId;
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.getTravelers();
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  deleteTravellerData() {
    this.travelerService.delete(this.userId).subscribe((data: any) => {
      this.travelerFormChange.emit(this.userId);
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      } else {

      }
    });
    this.modalReference.close();
  }
}
