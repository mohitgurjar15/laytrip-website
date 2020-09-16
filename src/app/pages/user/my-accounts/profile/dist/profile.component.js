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
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(formBuilder, userService, genericService, router, commonFunctoin, toastr) {
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.genericService = genericService;
        this.router = router;
        this.commonFunctoin = commonFunctoin;
        this.toastr = toastr;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.submitted = false;
        this.loading = false;
        this.countries = [];
        this.languages = [];
        this.currencies = [];
        this.countries_code = [];
        this.stateList = [];
        this.minDate = {};
        this.maxDate = {};
        this.is_gender = true;
        this.is_type = '';
        this.imageFile = '';
        this.imageFileError = false;
        this.imageErrorMsg = 'Image is required';
        this.image = '';
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
        this.file = '';
        this.isFile = true;
        this.profile_pic = false;
        this.fileError = false;
        this.fileErrorMsg = 'File is required';
        this.selectResponse = {};
        this.dobMaxDate = moment();
        this.locale = {
            format: 'DD/MM/YYYY',
            displayFormat: 'DD/MM/YYYY'
        };
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.getCountry();
        this.getLanguages();
        this.getCurrencies();
        this.getProfileInfo();
        console.log(this);
        this.profileForm = this.formBuilder.group({
            title: [''],
            first_name: ['', [forms_1.Validators.required]],
            last_name: ['', [forms_1.Validators.required]],
            country_code: ['', [forms_1.Validators.required]],
            email: [''],
            phone_no: ['', [forms_1.Validators.required]],
            address: ['', [forms_1.Validators.required]],
            zip_code: ['', [forms_1.Validators.required]],
            country_id: ['', [forms_1.Validators.required]],
            state_id: ['', [forms_1.Validators.required]],
            city_name: ['', [forms_1.Validators.required]],
            gender: [''],
            dob: [{
                    startDate: this.dobMaxDate
                }, forms_1.Validators.required],
            profile_pic: [''],
            address2: [''],
            language_id: [''],
            currency_id: ['']
        });
    };
    ProfileComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (data) {
            _this.countries = data.map(function (country) {
                return {
                    id: country.id,
                    name: country.name
                };
            }),
                _this.countries_code = data.map(function (country) {
                    return {
                        id: country.id,
                        name: country.phonecode + ' (' + country.iso2 + ')'
                    };
                });
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    ProfileComponent.prototype.getStates = function (countryId) {
        var _this = this;
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
    ProfileComponent.prototype.dobDateUpdate = function (date) {
        this.dobMinDate = moment(this.profileForm.value.dob.startDate);
    };
    ProfileComponent.prototype.clickGender = function (event, type) {
        this.is_type = '';
        this.is_gender = false;
        if (type == 'M') {
            this.is_type = 'M';
        }
        else if (type == 'F') {
            this.is_type = 'F';
        }
        else if (type == 'N') {
            this.is_type = 'N';
        }
        else {
            this.is_gender = false;
            this.is_type = '';
        }
        this.is_gender = true;
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
            _this.image = res.profilePic;
            _this.selectResponse = res;
            _this.is_type = res.gender;
            _this.seletedDob = moment(res.dobm).format("DD/MM/YYYY");
            console.log('date', moment(res.dob).format("DD/MM/YYYY"));
            _this.profileForm.patchValue({
                first_name: res.firstName,
                last_name: res.lastName,
                email: res.email,
                gender: res.gender,
                zip_code: res.zipCode,
                title: res.title,
                country_code: res.countryCode,
                phone_no: res.phoneNo,
                country_id: res.country.name,
                state_id: res.state.name,
                city_name: res.cityName,
                address: res.address,
                dob: [{
                        startDate: _this.seletedDob
                    }],
                language_id: res.preferredLanguage.name,
                currency_id: res.preferredCurrency.code,
                profile_pic: res.profilePic
            });
        }, function (error) {
            if (error.status === 404) {
                _this.router.navigate(['/']);
            }
            else {
                console.log('error');
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
            return;
        }
        else {
            var formdata = new FormData();
            var imgfile = '';
            if (this.imageFile) {
                imgfile = this.imageFile;
                formdata.append("profile_pic", imgfile);
            }
            console.log(this.profileForm.value);
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
            formdata.append("dob", typeof this.profileForm.value.dob.startDate === 'object' ? moment(this.profileForm.value.dob.startDate).format('YYYY-MM-DD') : moment(this.commonFunctoin.stringToDate(this.profileForm.value.dob.startDate, '/')).format('YYYY-MM-DD'));
            if (!Number.isInteger(this.profileForm.value.country_id)) {
                formdata.append("country_id", this.selectResponse.country.id);
            }
            else {
                formdata.append("country_id", this.profileForm.value.country_id.id);
            }
            if (!Number.isInteger(this.profileForm.value.state_id)) {
                formdata.append("state_id", this.selectResponse.state.id);
            }
            else {
                formdata.append("state_id", this.profileForm.value.state_id);
            }
            if (typeof (this.profileForm.value.country_code) != 'object') {
                formdata.append("country_code", this.selectResponse.countryCode);
            }
            else {
                formdata.append("country_code", this.profileForm.value.country_code.name);
            }
            if (!Number.isInteger(Number(this.profileForm.value.language_id))) {
                formdata.append("language_id", this.selectResponse.preferredLanguage.id);
            }
            else {
                formdata.append("language_id", this.profileForm.value.language_id);
            }
            if (!Number.isInteger(Number(this.profileForm.value.currency_id))) {
                formdata.append("currency_id", this.selectResponse.preferredCurrency.id);
            }
            else {
                formdata.append("currency_id", this.profileForm.value.currency_id);
            }
            formdata.append("passport_expiry", '2020-08-06');
            this.userService.updateProfile(formdata).subscribe(function (data) {
                _this.submitted = _this.loading = false;
                localStorage.setItem("_lay_sess", data.token);
                _this.toastr.success("Profile has been updated successfully!", 'Profile Updated');
                // this.router.navigate(['/']);      
            }, function (error) {
                console.log(error);
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
