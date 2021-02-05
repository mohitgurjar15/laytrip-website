"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TravellerFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../../../environments/environment");
var moment = require("moment");
var custom_validators_1 = require("../../../../../_helpers/custom.validators");
var TravellerFormComponent = /** @class */ (function () {
    function TravellerFormComponent(formBuilder, genericService, router, commonFunction, flightService, userService, toastr, cookieService, travelerService) {
        this.formBuilder = formBuilder;
        this.genericService = genericService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.flightService = flightService;
        this.userService = userService;
        this.toastr = toastr;
        this.cookieService = cookieService;
        this.travelerService = travelerService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loadingValue = new core_1.EventEmitter();
        this.travelerFormChange = new core_1.EventEmitter();
        this.countries = [];
        this.countries_code = [];
        this.is_gender = true;
        this.is_type = 'M';
        this.traveller = [];
        this.isLoggedIn = false;
        this.submitted = false;
        this.loading = false;
        this.expiryMinDate = new Date(moment().format("YYYY-MM-DD"));
        this.subscriptions = [];
        this.locale = {
            format: 'DD/MM/YYYY',
            displayFormat: 'DD/MM/YYYY'
        };
        this.isChild = false;
        this.isInfant = false;
        this.isAdult = true;
    }
    TravellerFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getCountry();
        var location = this.cookieService.get('__loc');
        try {
            this.location = JSON.parse(location);
        }
        catch (e) {
        }
        var countryCode;
        if (this.location) {
            countryCode = this.countries_code.filter(function (item) { return item.id == _this.location.country.id; })[0];
        }
        this.travellerForm = this.formBuilder.group({
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            gender: ['', [forms_1.Validators.required]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            phone_no: ['', [forms_1.Validators.required, forms_1.Validators.minLength(10)]],
            country_id: [typeof this.location != 'undefined' ? this.location.country.name : '', [forms_1.Validators.required]],
            country_code: [typeof countryCode != 'undefined' ? countryCode.country_name : '', [forms_1.Validators.required]],
            dob: ['', forms_1.Validators.required],
            passport_expiry: [''],
            passport_number: ['']
        }, { validators: custom_validators_1.phoneAndPhoneCodeValidation() });
        this.setUserTypeValidation();
        if (this.travellerId) {
            this.setTravelerForm();
        }
    };
    TravellerFormComponent.prototype.setTravelerForm = function () {
        var _this = this;
        this.traveller = this.travelerInfo;
        var countryCode = '';
        if (typeof this.travelerInfo.countryCode != 'undefined' && typeof this.travelerInfo.countryCode == 'string') {
            countryCode = this.countries_code.filter(function (item) { return item.id == _this.travelerInfo.countryCode; })[0];
        }
        else {
            countryCode = this.countries_code.filter(function (item) { return item.id == _this.location.country.id; })[0];
        }
        var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
        if (moment(this.travelerInfo.dob).format('YYYY-MM-DD') < adult12YrPastDate) {
            this.isAdult = true;
            this.travellerForm.setErrors({ 'phoneAndPhoneCodeError': true });
        }
        else {
            this.isAdult = false;
            this.travellerForm.setErrors(null);
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
            passport_expiry: this.travelerInfo.passportExpiry ? new Date(this.travelerInfo.passportExpiry) : ''
        });
    };
    TravellerFormComponent.prototype.changeDateOfBirth = function (event) {
        var todayDate = moment();
        var birthYear = moment(event, 'YYYY');
        var age = parseInt(todayDate.diff(birthYear, 'y', true).toFixed(2));
        if (age && age === 2 || age > 2 && age < 12) {
            // FOR CHILD
            this.isChild = true;
            this.isInfant = false;
            this.isAdult = false;
        }
        else if (age && age < 2 || age === 0) {
            // FOR INFANT
            this.isInfant = true;
            this.isAdult = false;
            this.isChild = false;
        }
        else if (age && age > 12) {
            // FOR ADULT
            this.isChild = false;
            this.isInfant = false;
            this.isAdult = true;
        }
        else {
            // FOR ONLY ADULT
            this.isAdult = true;
            this.isChild = false;
            this.isInfant = false;
        }
        console.log(this.isAdult);
    };
    TravellerFormComponent.prototype.setUserTypeValidation = function () {
        this.dobMinDate = new Date(moment().subtract(50, 'years').format("MM/DD/YYYY"));
        this.dobMaxDate = new Date(moment().format("MM/DD/YYYY"));
        this.dobYearRange = moment(this.dobMinDate).format("YYYY") + ":" + moment(this.dobMaxDate).format("YYYY");
    };
    TravellerFormComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken) {
            this.isLoggedIn = true;
        }
    };
    TravellerFormComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.loadingValue.emit(true);
        if (this.travellerId) {
            this.selectDob(moment(this.travellerForm.controls.dob.value).format('YYYY-MM-DD'));
        }
        console.log(this.travellerForm);
        if (this.travellerForm.invalid) {
            this.submitted = true;
            this.loadingValue.emit(false);
            return;
        }
        else {
            var country_id = this.travellerForm.value.country_id.id;
            if (!Number(country_id)) {
                if (this.traveller.country) {
                    country_id = (this.traveller.country.id) ? this.traveller.country.id : '';
                }
                else {
                    country_id = this.location.country.id;
                }
            }
            var jsonData = {
                first_name: this.travellerForm.value.firstName,
                last_name: this.travellerForm.value.lastName,
                dob: typeof this.travellerForm.value.dob === 'object' ? moment(this.travellerForm.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(this.travellerForm.value.dob, '/')).format('YYYY-MM-DD'),
                gender: this.travellerForm.value.gender ? this.travellerForm.value.gender : 'M',
                country_id: country_id ? country_id : '',
                passport_expiry: typeof this.travellerForm.value.passport_expiry === 'object' ? moment(this.travellerForm.value.passport_expiry).format('YYYY-MM-DD') : null,
                passport_number: this.travellerForm.value.passport_number,
                country_code: this.travellerForm.value.country_code ? this.travellerForm.value.country_code : '',
                phone_no: this.travellerForm.value.phone_no
            };
            var emailObj = { email: this.travellerForm.value.email ? this.travellerForm.value.email : '' };
            if (this.travellerId) {
                this.loadingValue.emit(true);
                jsonData = Object.assign(jsonData, emailObj);
                this.travelerService.updateAdult(jsonData, this.travellerId).subscribe(function (data) {
                    _this.loadingValue.emit(false);
                    _this.travelerFormChange.emit(data);
                    $("#collapseTravInner" + _this.travellerId).removeClass('show');
                    _this.toastr.success('Success', 'Traveller Updated Successfully');
                }, function (error) {
                    _this.submitted = false;
                    _this.loadingValue.emit(false);
                    _this.toastr.error(error.error.message, 'Traveller Update Error');
                    if (error.status === 401) {
                        _this.router.navigate(['/']);
                    }
                });
            }
            else {
                jsonData = Object.assign(jsonData, emailObj);
                this.travelerService.addAdult(jsonData).subscribe(function (data) {
                    _this.travelerFormChange.emit(data);
                    _this.loadingValue.emit(false);
                    _this.travellerForm.reset();
                    _this.travellerForm.setErrors(null);
                    _this.toastr.success('Success', 'Traveller Add Successfully');
                }, function (error) {
                    _this.submitted = false;
                    _this.loadingValue.emit(false);
                    _this.toastr.error(error.error.message, 'Traveller Add Error');
                    if (error.status === 401) {
                        _this.router.navigate(['/']);
                    }
                });
            }
        }
    };
    TravellerFormComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (data) {
            _this.countries = data.map(function (country) {
                return {
                    id: country.id,
                    name: country.name,
                    code: country.phonecode,
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
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    TravellerFormComponent.prototype.stringToDate = function (string, saprator) {
        var dateArray = string.split(saprator);
        return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
    };
    TravellerFormComponent.prototype.selectDob = function (event) {
        var selectedDate = moment(event).format('YYYY-MM-DD');
        var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
        var emailControl = this.travellerForm.get('email');
        var phoneControl = this.travellerForm.get('phone_no');
        var countryControl = this.travellerForm.get('country_code');
        if (selectedDate < adult12YrPastDate) {
            this.isAdult = true;
            emailControl.setValidators(forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$'));
            phoneControl.setValidators([forms_1.Validators.required, forms_1.Validators.minLength(10)]);
            countryControl.setValidators([forms_1.Validators.required]);
            // this.travellerForm.setErrors({'phoneAndPhoneCodeError':true});
            console.log('here');
        }
        else {
            this.isAdult = false;
            this.travellerForm.setValidators(null);
            emailControl.setValidators(null);
            phoneControl.setValidators(null);
            countryControl.setValidators(null);
        }
        phoneControl.updateValueAndValidity();
        emailControl.updateValueAndValidity();
        countryControl.updateValueAndValidity();
        console.log(this.travellerForm);
    };
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "travellerId");
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "travelerInfo");
    __decorate([
        core_1.Output()
    ], TravellerFormComponent.prototype, "loadingValue");
    __decorate([
        core_1.Output()
    ], TravellerFormComponent.prototype, "travelerFormChange");
    TravellerFormComponent = __decorate([
        core_1.Component({
            selector: 'app-traveller-form',
            templateUrl: './traveller-form.component.html',
            styleUrls: ['./traveller-form.component.scss']
        })
    ], TravellerFormComponent);
    return TravellerFormComponent;
}());
exports.TravellerFormComponent = TravellerFormComponent;
