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
    function ProfileComponent(formBuilder, userService, genericService, router, commonFunctoin, toastr, cookieService) {
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.genericService = genericService;
        this.router = router;
        this.commonFunctoin = commonFunctoin;
        this.toastr = toastr;
        this.cookieService = cookieService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.submitted = false;
        this.loading = true;
        this.countries = [];
        this.languages = [];
        this.currencies = [];
        this.countries_code = [];
        this.stateList = [];
        this.minDate = {};
        this.maxDate = {};
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
        this.dobMinDate = new Date();
        this.dobMaxDate = moment();
        this.locale = {
            format: 'DD/MM/YYYY',
            displayFormat: 'DD/MM/YYYY'
        };
    }
    ProfileComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        this.getCountry();
        this.getLanguages();
        this.getCurrencies();
        var location = this.cookieService.get('__loc');
        try {
            this.location = JSON.parse(location);
        }
        catch (e) { }
        this.profileForm = this.formBuilder.group({
            title: ['mr'],
            first_name: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            last_name: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            country_id: [typeof this.location != 'undefined' && this.location.country.name ? this.location.country.name : ''],
            dob: ['', forms_1.Validators.required],
            country_code: [''],
            phone_no: [''],
            address: [''],
            email: [''],
            zip_code: [''],
            state_id: [''],
            city_name: [''],
            gender: ['M'],
            profile_pic: [''],
            currency_id: [''],
            address2: [''],
            language_id: [''],
            passport_expiry: [''],
            passport_number: ['']
        }, { validator: custom_validators_1.phoneAndPhoneCodeValidation('adult') });
        this.getProfileInfo();
    };
    ProfileComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (data) {
            _this.countries = data.map(function (country) {
                return {
                    id: country.id,
                    name: country.name,
                    flag: _this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
                };
            }),
                _this.countries_code = data.map(function (country) {
                    return {
                        id: country.id,
                        name: country.phonecode + ' (' + country.iso2 + ')',
                        code: country.phonecode,
                        country_name: country.name + ' ' + country.phonecode,
                        flag: _this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
                    };
                });
            if (_this.location) {
                var countryCode = _this.countries_code.filter(function (item) { return item.id == _this.location.country.id; })[0];
                _this.profileForm.controls.country_code.setValue(countryCode.country_name);
            }
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    ProfileComponent.prototype.getStates = function (countryId) {
        var _this = this;
        this.profileForm.controls.state_id.setValue([]);
        this.genericService.getStates(countryId.id).subscribe(function (data) {
            _this.stateList = data;
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    ProfileComponent.prototype.getLanguages = function () {
        var _this = this;
        this.genericService.getAllLangunage().subscribe(function (data) {
            _this.languages = data.data;
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    ProfileComponent.prototype.getCurrencies = function () {
        var _this = this;
        this.genericService.getCurrencies().subscribe(function (data) {
            _this.currencies = data.data;
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    ProfileComponent.prototype.clickGender = function (event, type) {
        this.is_gender = true;
        this.is_type = 'M';
        if (type == 'F') {
            this.is_type = 'F';
        }
    };
    ProfileComponent.prototype.onFileSelect = function (event) {
        var _this = this;
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
            this.toastr.error(this.imageErrorMsg, 'Profile Error');
            return;
        }
        //file render
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (_event) {
            _this.image = reader.result;
        };
        this.imageFileError = false;
    };
    ProfileComponent.prototype.getProfileInfo = function () {
        var _this = this;
        this.userService.getProfile().subscribe(function (res) {
            _this.loading = false;
            _this.image = res.profilePic;
            _this.selectResponse = res;
            _this.is_type = res.gender ? res.gender : 'M';
            _this.seletedDob = moment(res.dob).format("MMM d yy");
            console.log(_this.seletedDob);
            if (typeof _this.location != 'undefined' || typeof res.country.id != 'undefined') {
                var country = res.country.id ? res.country : _this.location.country;
                if (typeof country != 'undefined')
                    _this.getStates(country);
            }
            var countryCode = '';
            if (typeof res.countryCode != 'undefined' && typeof res.countryCode == 'string' && res.countryCode) {
                countryCode = _this.countries_code.filter(function (item) { return item.id == res.countryCode; })[0];
            }
            else {
                countryCode = typeof _this.location != 'undefined' ? _this.countries_code.filter(function (item) { return item.id == _this.location.country.id; })[0] : '';
            }
            var countryName = '';
            if (typeof _this.location != 'undefined') {
                countryName = _this.location.country.name;
            }
            _this.profileForm.patchValue({
                first_name: res.firstName,
                last_name: res.lastName,
                email: res.email,
                gender: res.gender ? res.gender : 'M',
                zip_code: res.zipCode,
                title: res.title ? res.title : 'mr',
                dob: res.dob ? moment(res.dob).format('MMM d yy') : '',
                country_code: countryCode,
                phone_no: res.phoneNo,
                country_id: res.country.name ? res.country.name : countryName,
                state_id: res.state.name,
                city_name: res.cityName,
                address: res.address,
                language_id: res.preferredLanguage.name,
                currency_id: res.preferredCurrency.code,
                profile_pic: res.profilePic,
                passport_expiry: res.passportExpiry ? moment(res.passportExpiry).format('MMM d yy') : '',
                passport_number: res.passportNumber
            });
        }, function (error) {
            _this.loading = false;
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
        this.submitted = this.loading = true;
        if (this.profileForm.controls.gender.errors && this.is_gender) {
            this.profileForm.controls.gender.setValue(this.is_type);
        }
        if (this.profileForm.invalid) {
            this.submitted = true;
            this.loading = false;
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
                formdata.append("profile_pic", imgfile);
            }
            formdata.append("title", this.profileForm.value.title);
            formdata.append("first_name", this.profileForm.value.first_name);
            formdata.append("last_name", this.profileForm.value.last_name);
            formdata.append("email", this.profileForm.value.email);
            formdata.append("city_name", this.profileForm.value.city_name);
            formdata.append("zip_code", this.profileForm.value.zip_code);
            formdata.append("address", this.profileForm.value.address);
            formdata.append("address1", this.profileForm.value.address);
            formdata.append("phone_no", this.profileForm.value.phone_no);
            formdata.append("gender", this.is_type);
            formdata.append("passport_number", this.profileForm.value.passport_number);
            formdata.append("dob", typeof this.profileForm.value.dob === 'object' ? moment(this.profileForm.value.dob).format('YYYY-MM-DD') : moment(this.profileForm.value.dob).format('YYYY-MM-DD'));
            console.log(moment(this.profileForm.value.dob).format('YYYY-MM-DD'));
            formdata.append("passport_expiry", typeof this.profileForm.value.passport_expiry === 'object' ? moment(this.profileForm.value.passport_expiry).format('YYYY-MM-DD') : '');
            if (typeof this.profileForm.value.country_id === 'string') {
                if (this.selectResponse.country.id) {
                    formdata.append("country_id", this.selectResponse.country.id);
                }
                else {
                    formdata.append("country_id", this.location.country.id);
                }
            }
            else {
                formdata.append("country_id", this.profileForm.value.country_id ? this.profileForm.value.country_id.id : '');
            }
            if (typeof this.profileForm.value.state_id === 'string' && isNaN(this.profileForm.value.state_id)) {
                formdata.append("state_id", this.selectResponse.state.id ? this.selectResponse.state.id : '');
            }
            else {
                formdata.append("state_id", this.profileForm.value.state_id ? this.profileForm.value.state_id : '');
            }
            if (typeof (this.profileForm.value.country_code) === 'object') {
                formdata.append("country_code", this.profileForm.value.country_code ? this.profileForm.value.country_code.id : '');
            }
            else {
                formdata.append("country_code", this.selectResponse.countryCode);
            }
            if (!Number.isInteger(Number(this.profileForm.value.language_id))) {
                formdata.append("language_id", this.selectResponse.preferredLanguage.id ? this.selectResponse.preferredLanguage.id : '');
            }
            else {
                formdata.append("language_id", this.profileForm.value.language_id ? this.profileForm.value.language_id : '');
            }
            if (!Number.isInteger(Number(this.profileForm.value.currency_id))) {
                formdata.append("currency_id", this.selectResponse.preferredCurrency.id ? this.selectResponse.preferredCurrency.id : '');
            }
            else {
                formdata.append("currency_id", this.profileForm.value.currency_id ? this.profileForm.value.currency_id : '');
            }
            this.userService.updateProfile(formdata).subscribe(function (data) {
                _this.submitted = _this.loading = false;
                localStorage.setItem("_lay_sess", data.token);
                _this.toastr.success("Profile has been updated successfully!", 'Profile Updated');
                // this.router.navigate(['/']);      
            }, function (error) {
                _this.submitted = _this.loading = false;
                _this.toastr.error(error.error.message, 'Profile Error');
            });
        }
    };
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
