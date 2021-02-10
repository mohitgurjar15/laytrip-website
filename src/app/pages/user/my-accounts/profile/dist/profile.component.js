"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfileComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var forms_1 = require("@angular/forms");
var custom_validators_1 = require("../../../../_helpers/custom.validators");
var moment = require("moment");
var jwt_helper_1 = require("../../../../_helpers/jwt.helper");
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(formBuilder, userService, genericService, router, commonFunctoin, toastr, cookieService, flightService) {
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.genericService = genericService;
        this.router = router;
        this.commonFunctoin = commonFunctoin;
        this.toastr = toastr;
        this.cookieService = cookieService;
        this.flightService = flightService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.submitted = false;
        this.loading = true;
        this.loadingValue = new core_1.EventEmitter();
        this.minDate = {};
        this.maxDate = {};
        this.data = [];
        this.is_gender = true;
        this.is_type = 'M';
        this.imageFile = '';
        this.imageFileError = false;
        this.imageErrorMsg = 'Image is required';
        this.image = '';
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
        this.file = '';
        this.isFile = true;
        this.profile_pic = false;
        this.fileError = false;
        this.fileErrorMsg = 'File is required';
        this.selectResponse = {};
        this.dobMinDate = new Date(moment().subtract(16, 'years').format("MM/DD/YYYY"));
        this.dobMaxDate = moment();
        this.locale = {
            format: 'DD/MM/YYYY',
            displayFormat: 'DD/MM/YYYY'
        };
        this.isFormControlEnable = false;
        this.loadingDeparture = false;
        this.departureAirport = {};
        this.arrivalAirport = {};
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.loadingValue.emit(true);
        window.scroll(0, 0);
        var location = this.cookieService.get('__loc');
        try {
            this.location = JSON.parse(location);
        }
        catch (e) { }
        this.profileForm = this.formBuilder.group({
            first_name: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            last_name: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            dob: ['', forms_1.Validators.required],
            country_code: ['', [forms_1.Validators.required]],
            phone_no: ['', [forms_1.Validators.required, forms_1.Validators.minLength(10)]],
            address: [''],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            gender: ['M'],
            profile_pic: [''],
            passport_expiry: [''],
            passport_number: [''],
            home_airport: ['']
        }, { validators: custom_validators_1.phoneAndPhoneCodeValidation() });
        this.getProfileInfo();
    };
    ProfileComponent.prototype.selectGender = function (event, type) {
        if (this.isFormControlEnable) {
            this.is_gender = true;
            if (type == 'M') {
                this.is_type = 'M';
            }
            else if (type == 'F') {
                this.is_type = 'F';
            }
            else if (type == 'O') {
                this.is_type = 'O';
            }
        }
    };
    ProfileComponent.prototype.uploadImageFile = function (event) {
        var _this = this;
        this.imageFileError = false;
        this.imageFile = event.target.files[0];
        //file type validation check
        if (!custom_validators_1.validateImageFile(this.imageFile.name)) {
            this.imageFileError = true;
            this.imageErrorMsg = 'Only image are allowed';
            return;
        }
        //file size validation max=10
        if (!custom_validators_1.fileSizeValidator(event.target.files[0])) {
            this.imageFileError = true;
            this.imageErrorMsg = 'Please select file up to 2mb size';
            // this.toastr.error(this.imageErrorMsg, 'Profile Error');
            return;
        }
        //file render
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (_event) {
            _this.image = reader.result;
        };
        if (!this.imageFileError) {
            this.imageFileError = false;
            this.loadingValue.emit(true);
            var formdata = new FormData();
            var imgfile = '';
            if (this.imageFile) {
                imgfile = this.imageFile;
                formdata.append("profile_pic", imgfile);
                this.userService.updateProfileImage(formdata).subscribe(function (data) {
                    _this.submitted = false;
                    _this.loadingValue.emit(false);
                    localStorage.setItem("_lay_sess", data.token);
                    // this.toastr.success("Profile picture updated successfully!", 'Profile Updated');
                }, function (error) {
                    _this.loadingValue.emit(false);
                    _this.submitted = false;
                    // this.toastr.error(error.error.message, 'Profile Error');
                });
            }
        }
    };
    ProfileComponent.prototype.getProfileInfo = function () {
        var _this = this;
        this.userService.getProfile().subscribe(function (res) {
            _this.loadingValue.emit(false);
            _this.image = res.profilePic;
            _this.selectResponse = res;
            _this.is_type = res.gender ? res.gender : 'M';
            _this.data = Object.keys(res.airportInfo).length > 0 ? [res.airportInfo] : [];
            _this.profileForm.patchValue({
                first_name: res.firstName,
                last_name: res.lastName,
                email: res.email,
                gender: res.gender ? res.gender : 'M',
                zip_code: res.zipCode,
                title: res.title ? res.title : 'mr',
                dob: (res.dob != 'undefined' && res.dob != '' && res.dob) ? new Date(res.dob) : '',
                country_code: (res.countryCode != 'undefined' && res.countryCode != '') ? res.countryCode : '',
                phone_no: res.phoneNo,
                state_id: res.state.name,
                city_name: res.cityName,
                address: res.profile_picaddress,
                home_airport: res.airportInfo.code ? res.airportInfo.code : null,
                language_id: res.preferredLanguage.name,
                currency_id: res.preferredCurrency.code,
                passport_expiry: res.passportExpiry ? moment(res.passportExpiry).format('MMM d, yy') : '',
                passport_number: res.passportNumber
            });
            _this.profileForm.controls['home_airport'].disable();
        }, function (error) {
            _this.loadingValue.emit(false);
            if (error.status === 401) {
                jwt_helper_1.redirectToLogin();
            }
            else {
                _this.toastr.error(error.message, 'Profile Error');
            }
        });
    };
    ProfileComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.loadingValue.emit(true);
        console.log(this.profileForm);
        if (this.profileForm.invalid) {
            this.submitted = true;
            this.loadingValue.emit(false);
            //scroll top if any error 
            var scrollToTop_1 = window.setInterval(function () {
                var pos = window.pageYOffset;
                if (pos > 0) {
                    window.scrollTo(0, pos - 20); // how far to scroll on each step
                }
                else {
                    window.clearInterval(scrollToTop_1);
                }
            }, 16);
            return;
        }
        else {
            var formdata = new FormData();
            var imgfile = '';
            if (this.imageFile) {
                imgfile = this.imageFile;
                // formdata.append("profile_pic",imgfile);
            }
            // formdata.append("title",'mr');
            formdata.append("first_name", this.profileForm.value.first_name);
            formdata.append("last_name", this.profileForm.value.last_name);
            formdata.append("email", this.profileForm.value.email);
            formdata.append("home_airport", this.profileForm.value.home_airport ? this.profileForm.value.home_airport : '');
            formdata.append("address", this.profileForm.value.address);
            formdata.append("phone_no", this.profileForm.value.phone_no);
            formdata.append("gender", this.profileForm.value.gender);
            formdata.append("country_code", this.profileForm.value.country_code);
            formdata.append("dob", typeof this.profileForm.value.dob === 'object' ? moment(this.profileForm.value.dob).format('YYYY-MM-DD') : moment(this.profileForm.value.dob).format('YYYY-MM-DD'));
            this.isFormControlEnable = false;
            this.profileForm.controls['home_airport'].disable();
            this.userService.updateProfile(formdata).subscribe(function (data) {
                _this.submitted = false;
                _this.loadingValue.emit(false);
                localStorage.setItem("_lay_sess", data.token);
                // this.toastr.success("Profile has been updated successfully!", 'Profile Updated');
            }, function (error) {
                _this.loadingValue.emit(false);
                _this.submitted = false;
                // this.toastr.error(error.error.message, 'Profile Error');
            });
        }
    };
    ProfileComponent.prototype.enableFormControlInputs = function (event) {
        this.isFormControlEnable = true;
        this.profileForm.controls['home_airport'].enable();
    };
    ProfileComponent.prototype.onRemove = function (event, item) {
        if (item.key === 'fromSearch') {
            this.departureAirport = Object.create(null);
        }
        else if (item.key === 'toSearch') {
            this.arrivalAirport = Object.create(null);
        }
    };
    ProfileComponent.prototype.changeSearchDeparture = function (event) {
        if (event.term.length > 2) {
            this.searchAirportDeparture(event.term);
        }
    };
    ProfileComponent.prototype.searchAirportDeparture = function (searchItem) {
        var _this = this;
        this.loadingDeparture = true;
        this.flightService.searchAirport(searchItem).subscribe(function (response) {
            _this.data = response.map(function (res) {
                _this.loadingDeparture = false;
                return {
                    id: res.id,
                    name: res.name,
                    code: res.code,
                    city: res.city,
                    country: res.country,
                    display_name: res.city + "," + res.country + ",(" + res.code + ")," + res.name,
                    parentId: res.parentId
                };
            });
        }, function (error) {
            _this.loadingDeparture = false;
        });
    };
    ProfileComponent.prototype.selectEvent = function (event, item) {
        if (event && event.code && item.key === 'fromSearch') {
            // this.home_airport = event.code;
            // this.departureAirport=event;
            // this.searchedValue.push({ key: 'fromSearch', value: event });
        }
    };
    __decorate([
        core_1.Output()
    ], ProfileComponent.prototype, "loadingValue");
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.scss']
        })
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
