import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
import { validateImageFile, fileSizeValidator, phoneAndPhoneCodeValidation } from '../../../../_helpers/custom.validators';
import { GenericService } from '../../../../services/generic.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { redirectToLogin } from '../../../../_helpers/jwt.helper';
import { FlightService } from '../../../../services/flight.service';
import { CheckOutService } from '../../../../services/checkout.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  profileForm: FormGroup;
  // submitted = false;
  loading = true;
  @Output() loadingValue = new EventEmitter<boolean>();
  minDate: any = {};
  maxDate: any = {};
  data = [];
  public startDate: Date;
  is_gender: boolean = true;
  gender_type: string = 'M';
  public imageFile: any = '';
  public imageFileError = false;
  public imageErrorMsg: string = 'Image is required';
  image: any = '';
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
  public file: any = '';
  public isFile = true;
  public profile_pic = false;
  public fileError = false;
  public fileErrorMsg: string = 'File is required';
  selectResponse: any = {};
  seletedDob: any;
  dobMinDate = new Date(moment().subtract(16, 'years').format("MM/DD/YYYY"))
  location;
  dobMaxDate: moment.Moment = moment();
  locale = {
    format: 'DD/MM/YYYY',
    displayFormat: 'DD/MM/YYYY'
  };
  isFormControlEnable: boolean = false;
  loadingDeparture = false;
  departureAirport: any = {};
  arrivalAirport: any = {}
  home_airport;
  countries = [];
  countries_code = [];
  stateList = [];
  dateYeaMask = {
    guide: false,
    showMask: false,
    mask: [
      /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };
  submitted : boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private genericService: GenericService,
    public router: Router,
    public commonFunction: CommonFunction,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private flightService: FlightService,
    private checkOutService: CheckOutService,
  ) { }

  ngOnInit() {
    this.loadingValue.emit(true);
    window.scroll(0, 0);

    let location: any = this.cookieService.get('__loc');
    try {
      this.location = JSON.parse(location);
    } catch (e) { }

    this.profileForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
      last_name: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
      dob: ['', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/)]],
      country_code: ['', [Validators.required]],
      phone_no: ['', [Validators.required, Validators.minLength(10)]],
      address: [''],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
      gender: ['M'],
      profile_pic: [''],
      passport_expiry: [''],
      passport_number: [''],
      home_airport: [''],
      city: [''],
      state_id: [''],
      country_id: [''],
      zip_code: [''],

    }, { validators: phoneAndPhoneCodeValidation() });

    this.getProfileInfo();
    this.getCountry();
  }

  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country => {
        return {
          id: country.id,
          name: country.name,
          countryCode: country.phonecode,
          flag: this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
        }
      });
      var countries_code = data.map(country => {
        return {
          id: country.id,
          name: country.phonecode + ' (' + country.iso2 + ')',
          countryCode: country.phonecode,
          country_name: country.name + ' ' + country.phonecode,
          flag: this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
        }
      });
      const filteredArr = countries_code.reduce((acc, current) => {
        const x = acc.find(item => item.countryCode == current.countryCode);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      this.countries_code = filteredArr;
      this.setUSCountryInFirstElement(this.countries);

    });
  }

  getStates(countryId) {
    this.profileForm.controls.state_id.setValue('');
    this.genericService.getStates(countryId.id).subscribe((data: any) => {
      this.stateList = data;
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.setItem('userToken', "");
        this.router.navigate(['/login']);
      }
    });
  }

  setUSCountryInFirstElement(countries) {
    var usCountryObj = countries.find(x => x.id === 233);
    var removedUsObj = countries.filter(obj => obj.id !== 233);
    this.countries = [];
    removedUsObj.sort(function (a, b) {
      return (a['name'].toLowerCase() > b['name'].toLowerCase()) ? 1 : ((a['name'].toLowerCase() < b['name'].toLowerCase()) ? -1 : 0);
    });
    removedUsObj.unshift(usCountryObj);
    this.countries = removedUsObj;
  }
  selectGender(event, type) {

    if (this.isFormControlEnable) {
      this.is_gender = true;
      if (type == 'M') {
        this.gender_type = 'M';
      } else if (type == 'F') {
        this.gender_type = 'F';
      } else if (type == 'O') {
        this.gender_type = 'O';
      }
    }
  }


  uploadImageFile(event) {
    this.imageFileError = false;
    this.imageFile = event.target.files[0];
    //file type validation check
    if (!validateImageFile(this.imageFile.name)) {
      this.imageFileError = true;
      this.imageErrorMsg = 'Only image are allowed';
      return;
    }

    //file size validation max=10
    if (!fileSizeValidator(event.target.files[0])) {
      this.imageFileError = true;
      this.imageErrorMsg = 'Please select file up to 5mb size';
      // this.toastr.error(this.imageErrorMsg, 'Profile Error');
      return;
    }
    //file render
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.image = reader.result;
    }
    if (!this.imageFileError) {
      this.imageFileError = false;
      this.loadingValue.emit(true);
      let formdata = new FormData();
      let imgfile = '';
      if (this.imageFile) {
        imgfile = this.imageFile;
        formdata.append("profile_pic", imgfile);
        this.userService.updateProfileImage(formdata).subscribe((data: any) => {
          // this.submitted = false;
          this.loadingValue.emit(false);
          localStorage.setItem("_lay_sess", data.token);
          // this.toastr.success("Profile picture updated successfully!", 'Profile Updated');
        }, (error: HttpErrorResponse) => {
          this.loadingValue.emit(false);
          // this.submitted = false;
          // this.toastr.error(error.error.message, 'Profile Error');
        });
      }
    }
  }

  getProfileInfo() {
    this.userService.getProfile().subscribe((res: any) => {

      this.loadingValue.emit(false);
      this.image = res.profilePic;
      this.selectResponse = res;
      this.gender_type = res.gender ? res.gender : 'M';
      var countryId = { id: res.country.id ? res.country.id : 233 };
      this.getStates(countryId);
      this.data = Object.keys(res.airportInfo).length > 0 ? [res.airportInfo] : [];
      this.profileForm.patchValue({
        first_name: res.firstName,
        last_name: res.lastName,
        email: res.email,
        gender: res.gender ? res.gender : 'M',
        zip_code: res.zipCode,
        title: res.title ? res.title : 'mr',
        dob: (res.dob != 'undefined' && res.dob != '' && res.dob) ? this.commonFunction.convertDateMMDDYYYY(res.dob, 'YYYY-MM-DD') : '',
        country_code: (res.countryCode != 'undefined' && res.countryCode != '') ? res.countryCode : '+1',
        phone_no: res.phoneNo,
        city: res.cityName,
        address: res.address,
        home_airport: res.airportInfo.code ? res.airportInfo.code : null,
        country_id: res.country.name ? res.country.name : 'United States',
        state_id: res.state.name ? res.state.name : null,
        // passport_expiry: res.passportExpiry ? moment(res.passportExpiry).format('MMM d, yy') : '',
        // passport_number: res.passportNumber
      });
      this.profileForm.controls['home_airport'].disable();
      this.profileForm.controls['country_code'].disable();
      this.profileForm.controls['country_id'].disable();
      this.profileForm.controls['state_id'].disable();

    }, (error: HttpErrorResponse) => {
      this.loadingValue.emit(false);
      if (error.status === 401) {
        redirectToLogin();
      } else {
        this.toastr.show(error.message, 'Profile Error', {
          toastClass: 'custom_toastr',
          titleClass: 'custom_toastr_title',
          messageClass: 'custom_toastr_message',
        });
      }
    });
  }


  onSubmit() {
    this.submitted = true;
    const controls = this.profileForm.controls;
    this.loadingValue.emit(true);
    if (this.profileForm.invalid) {
      this.submitted = true;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.loadingValue.emit(false);
      //scroll top if any error 
      let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 16);
      return;
    } else {
      let formdata = new FormData();

      let imgfile = '';
      if (this.imageFile) {
        imgfile = this.imageFile;
        // formdata.append("profile_pic",imgfile);
      }
      // formdata.append("title",'mr');
      formdata.append("first_name", this.profileForm.value.first_name);
      formdata.append("last_name", this.profileForm.value.last_name);
      formdata.append("email", this.profileForm.value.email);
      formdata.append("home_airport", this.profileForm.value.home_airport ? this.profileForm.value.home_airport : '');
      formdata.append("phone_no", this.profileForm.value.phone_no);
      formdata.append("gender", this.gender_type ? this.gender_type : 'M');
      formdata.append("city_name", this.profileForm.value.city);
      formdata.append("address", this.profileForm.value.address);

      if (!Number.isInteger(this.profileForm.value.country_id)) {
        formdata.append("country_id", this.selectResponse.country.id ? this.selectResponse.country.id : 233);
      } else {
        formdata.append("country_id", this.profileForm.value.country_id.id ? this.profileForm.value.country_id.id : 233);
      }
      if (!Number.isInteger(this.profileForm.value.state_id)) {
        formdata.append("state_id", this.selectResponse.state.id ? this.selectResponse.state.id : '');
      } else {
        formdata.append("state_id", this.profileForm.value.state_id ? this.profileForm.value.state_id : '');
      }
      if (typeof (this.profileForm.value.country_code) != 'object') {
        formdata.append("country_code", this.profileForm.value.country_code ? this.profileForm.value.country_code : '');
      } else {
        formdata.append("country_code", this.selectResponse.countryCode ? this.selectResponse.countryCode : '');
      }

      formdata.append("zip_code", this.profileForm.value.zip_code ? this.profileForm.value.zip_code : this.selectResponse.zipCode);
      formdata.append("dob", typeof this.profileForm.value.dob === 'object' ? this.commonFunction.convertDateYYYYMMDD(this.profileForm.value.dob, 'MM/DD/YYYY') : moment(this.profileForm.value.dob).format('YYYY-MM-DD'));

      this.isFormControlEnable = false;
      this.profileForm.controls['home_airport'].disable();
      this.profileForm.controls['country_code'].disable();
      this.profileForm.controls['country_id'].disable();
      this.profileForm.controls['state_id'].disable();

      this.userService.updateProfile(formdata).subscribe((data: any) => {
        this.submitted = false;
        this.loadingValue.emit(false);
        localStorage.setItem("_lay_sess", data.token);
        // this.toastr.success("Profile has been updated successfully!", 'Profile Updated');
      }, (error: HttpErrorResponse) => {
        this.loadingValue.emit(false);
        this.submitted = false;
        // this.toastr.error(error.error.message, 'Profile Error');
      });
    }
  }

  enableFormControlInputs(event) {
    this.isFormControlEnable = true;
    this.profileForm.controls['home_airport'].enable();
    this.profileForm.controls['country_code'].enable();
    this.profileForm.controls['country_id'].enable();
    this.profileForm.controls['state_id'].enable();
  }

  onRemove(event, item) {
    if (item.key === 'fromSearch') {
      this.departureAirport = Object.create(null);
    } else if (item.key === 'toSearch') {
      this.arrivalAirport = Object.create(null);
    }
  }

  changeSearchDeparture(event) {
    if (event.term.length > 2) {
      this.searchAirportDeparture(event.term);
    }
  }

  searchAirportDeparture(searchItem) {
    this.loadingDeparture = true;
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      this.data = response.map(res => {
        this.loadingDeparture = false;
        return {
          id: res.id,
          name: res.name,
          code: res.code,
          city: res.city,
          country: res.country,
          display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
          parentId: res.parentId
        };
      });
    },
      error => {
        this.loadingDeparture = false;
      }
    );
  }


  selectEvent(event, item) {

    if (event && event.code && item.key === 'fromSearch') {
      // this.home_airport = event.code;
      // this.departureAirport=event;
      // this.searchedValue.push({ key: 'fromSearch', value: event });
    }
  }


}
