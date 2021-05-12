import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
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
import { GenericService } from '../../../../../services/generic.service';
declare var $: any;
import { getPhoneFormat, PHONE_NUMBER_MASK } from '../../../../../_helpers/phone-masking.helper';

@Component({
  selector: 'app-traveller-form',
  templateUrl: './traveller-form.component.html',
  styleUrls: ['./traveller-form.component.scss']
})
export class TravellerFormComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() travellerId: any;
  @Input() index: number = 0;
  @Input() travelerInfo: any;
  @Input() countries: [];
  @Output() loadingValue = new EventEmitter<boolean>();
  @Output() travelerFormChange = new EventEmitter();
  @Output() deleteTravelerId = new EventEmitter();
  // countries = [];
  @Input() countries_code: any = [];
  is_gender: boolean = true;
  is_type: string = '';
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
  dateYeaMask = {
    guide: false,
    showMask: false,
    mask: [
      /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };
  formEnable: boolean = false;
  submitted = false;
  phoneNumberMask = {
    format: '',
    length: 0
  };

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public commonFunction: CommonFunction,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private travelerService: TravelerService,
    private genericService: GenericService,
    private checkOutService: CheckOutService,
    public modalService: NgbModal


  ) { }

  ngOnInit() {
    // this.getCountry();
    let location: any = this.cookieService.get('__loc');
    try {
      this.location = JSON.parse(location);
    }
    catch (e) {
    }

    this.travellerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
      lastName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      phone_no: ['', [Validators.required, Validators.minLength(10)]],
      country_id: ['United States', [Validators.required]],
      country_code: ['+1', [Validators.required]],
      dob: ['', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/)]],
      passport_expiry: [''],
      passport_number: [''],
    }, { validators: phoneAndPhoneCodeValidation() });
    this.travellerForm.controls.phone_no.setValidators([Validators.minLength(PHONE_NUMBER_MASK['+1'].length)]);
    this.travellerForm.controls.phone_no.updateValueAndValidity();
    this.phoneNumberMask.format = PHONE_NUMBER_MASK['+1'].format;
    this.phoneNumberMask.length = PHONE_NUMBER_MASK['+1'].length;

    // this.travelerFormChange.emit(this.travellerForm);

    this.setUserTypeValidation();
    if (this.travellerId) {
      this.formEnable = true;
      this.setTravelerForm();
    }
  }

  loadJquery() {
    $(document).ready(function () {
      $('.error_border').each(function () {
        $(this).removeClass('error_border');
      });

      if ($('.tel_span .form-control').hasClass('.ng-touched .ng-invalid')) {
        $(".tel_span").toggleClass("error_border");
      }
    });
  }

  /*  ngOnChanges(changes: SimpleChanges) {
     this.checkOutService.getCountries.subscribe(res => {
       this.countries = res;
     });
   } */

  getCountry() {
    this.genericService.getCountry().subscribe(res => {
      this.checkOutService.setCountries(res);
    })
  }

  setTravelerForm() {
    this.traveller = this.travelerInfo;

    var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
    var child2YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
    var travellerDob = moment(this.travelerInfo.dob).format('YYYY-MM-DD');
    const phoneControl = this.travellerForm.get('phone_no');
    const emailControl = this.travellerForm.get('email');
    if (travellerDob <= adult12YrPastDate) {
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
      dob: this.travelerInfo.dob ? this.commonFunction.convertDateMMDDYYYY(this.travelerInfo.dob, 'YYYY-MM-DD') : '',
      passport_number: this.travelerInfo.passportNumber ? this.travelerInfo.passportNumber : '',
      passport_expiry: (this.travelerInfo.passportExpiry && this.travelerInfo.passportExpiry != 'Invalid date' && this.travelerInfo.passportExpiry != '') ? new Date(this.travelerInfo.passportExpiry) : '',
    });

    let phoneFormat = getPhoneFormat(this.travelerInfo.countryCode || '+1');
    this.travellerForm.controls.phone_no.setValidators([Validators.minLength(phoneFormat.length)]);
    this.travellerForm.controls.phone_no.updateValueAndValidity();
    this.phoneNumberMask.format = phoneFormat.format;
    this.phoneNumberMask.length = phoneFormat.length;

    this.travellerForm.controls['country_id'].disable();
    this.travellerForm.controls['country_code'].disable();
    this.travellerForm.controls['gender'].disable();
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
    this.submitted = true;
    console.log(this.travellerForm)
    const controls = this.travellerForm.controls;
    if (this.travellerId) {
      this.validateDob(moment(this.travellerForm.controls.dob.value).format('MM-DD-YYYY'));
    }
    if (this.travellerForm.invalid) {
      this.submitted = true;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      let selectedCountry = getPhoneFormat(this.travellerForm.controls['country_code'].value);
      this.travellerForm.controls.phone_no.setValidators([Validators.minLength(selectedCountry.length)]);
      this.travellerForm.controls.phone_no.updateValueAndValidity();
      this.phoneNumberMask.format = selectedCountry.format;
      this.phoneNumberMask.length = selectedCountry.length;
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
        dob: typeof this.travellerForm.value.dob === 'object' ? moment(this.travellerForm.value.dob, 'MM-DD-YYYY').format('YYYY-MM-DD') : moment(this.travellerForm.value.dob, 'MM-DD-YYYY').format('YYYY-MM-DD'),
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
          this.submitted = false;
          this.travelerFormChange.emit(data);
          $("#collapseTravInner" + this.travellerId).removeClass('show');
          // this.toastr.success('', 'Traveler updated successfully');
          this.formEnable = false;
          this.travellerForm.controls['country_id'].enable();
          this.travellerForm.controls['country_code'].enable();
          this.travellerForm.controls['gender'].enable();
        }, (error: HttpErrorResponse) => {
          this.loadingValue.emit(false);
          this.submitted = false;
          // this.toastr.error(error.error.message, 'Traveler Update Error');
          if (error.status === 401) {
            let queryParam: any = {};
            if (this.commonFunction.isRefferal()) {
              let parms = this.commonFunction.getRefferalParms();
              queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
              queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
              this.router.navigate(['/'], { queryParams: queryParam });
            } else {
              this.router.navigate(['/']);
            }
          }
        });
      } else {
        jsonData = Object.assign(jsonData, emailObj);

        this.travelerService.addAdult(jsonData).subscribe((data: any) => {
          this.travelerFormChange.emit(data);
          this.loadingValue.emit(false);
          this.submitted = false;
          this.travellerForm.reset();
          this.travellerForm.setErrors(null);
          // this.toastr.success('', 'Traveler added successfully');

        }, (error: HttpErrorResponse) => {
          this.loadingValue.emit(false);
          this.submitted = false;
          // this.toastr.error(error.error.message, 'Traveler Add Error');
          if (error.status === 401) {
            let queryParam: any = {};
            if (this.commonFunction.isRefferal()) {
              let parms = this.commonFunction.getRefferalParms();
              queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
              queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
              this.router.navigate(['/'], { queryParams: queryParam });
            } else {
              this.router.navigate(['/']);
            }
          }
        });

      }
    }
  }

  stringToDate(string, saprator) {
    let dateArray = string.split(saprator);
    return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
  }

  validateDob(event) {
    var eventDate = (typeof event == 'object' && event.target.value != 'undefined') ? event.target.value : event;

    if (eventDate.length == 10) {
      var inputValueReplace = eventDate.replace("/", "-");
      var inputDate = inputValueReplace.replace("/", "-");
      var selectedDate = moment(inputDate, 'MM-DD-YYYY').format('YYYY-MM-DD');
      var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
      var child2YrPastDate = moment().subtract(2, 'years').format("YYYY-MM-DD");
      const emailControl = this.travellerForm.get('email');
      const phoneControl = this.travellerForm.get('phone_no');
      const countryControl = this.travellerForm.get('country_code');

      if (selectedDate <= adult12YrPastDate) {
        this.isAdult = true;
        this.isChild = false;
        emailControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]);
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
  }

  deleteTraveller(travellerId) {
    this.deleteTravelerId.emit(travellerId);
  }

  modalReference;
  userId;
  closeResult;

  removeTraveller(content, userId = '') {
    if (userId) {
      this.modalReference = this.modalService.open(content, { windowClass: 'cmn_delete_modal', centered: true });
      this.userId = userId;
      this.modalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        // this.getTravelers();
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.travellerForm.reset();
      this.travellerForm.controls.country_code.setValue('+1');
      this.travellerForm.controls.country_id.setValue('United States');
    }
  }


  deleteTravellerData() {
    this.travelerService.delete(this.userId).subscribe((data: any) => {
      this.travelerFormChange.emit(this.userId);
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        let queryParam: any = {};
        if (this.commonFunction.isRefferal()) {
          let parms = this.commonFunction.getRefferalParms();
          queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
          queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
          this.router.navigate(['/'], { queryParams: queryParam });
        } else {
          this.router.navigate(['/']);
        }
      } else {

      }
    });
    this.modalReference.close();
  }

  disabledForm() {
    this.formEnable = false;
    this.travellerForm.controls['country_id'].enable();
    this.travellerForm.controls['country_code'].enable();
    this.travellerForm.controls['gender'].enable();
  }

  validateCountryWithPhoneNumber(event: any): void {
    let selectedCountry = getPhoneFormat(this.travellerForm.controls['country_code'].value);
    this.travellerForm.controls.phone_no.setValidators([Validators.minLength(selectedCountry.length)]);
    this.travellerForm.controls.phone_no.updateValueAndValidity();
    this.phoneNumberMask.format = selectedCountry.format;
    this.phoneNumberMask.length = selectedCountry.length;
  }
}
