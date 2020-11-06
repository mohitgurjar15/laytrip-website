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
    function TravellerFormComponent(formBuilder, genericService, router, commonFunction, flightService, userService, activeModal, toastr, cookieService) {
        this.formBuilder = formBuilder;
        this.genericService = genericService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.flightService = flightService;
        this.userService = userService;
        this.activeModal = activeModal;
        this.toastr = toastr;
        this.cookieService = cookieService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelersChanges = new core_1.EventEmitter();
        this.countries = [];
        this.countries_code = [];
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
    }
    TravellerFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.checkUser();
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
        this.coAccountForm = this.formBuilder.group({
            // title: ['mr'],
            gender: ['M'],
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            phone_no: ['', [forms_1.Validators.required]],
            country_id: [typeof this.location != 'undefined' ? this.location.country.name : '', [forms_1.Validators.required]],
            country_code: [typeof countryCode != 'undefined' ? countryCode.country_name : '', [forms_1.Validators.required]],
            dob: ['', forms_1.Validators.required],
            passport_expiry: [''],
            passport_number: [''],
            user_type: ['']
        }, { validator: custom_validators_1.phoneAndPhoneCodeValidation('adult') });
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
        this.coAccountForm.patchValue({
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
    TravellerFormComponent.prototype.close = function () {
        this.activeModal.close();
    };
    TravellerFormComponent.prototype.setUserTypeValidation = function () {
        var emailControl = this.coAccountForm.get('email');
        var phoneControl = this.coAccountForm.get('phone_no');
        var countryControl = this.coAccountForm.get('country_code');
        var passport_expiryControl = this.coAccountForm.get('passport_expiry');
        this.dobMinDate = new Date(moment().subtract(50, 'years').format("MM/DD/YYYY"));
        this.dobMaxDate = new Date(moment().format("MM/DD/YYYY"));
        this.minyear = moment(this.dobMinDate).format("YYYY") + ":" + moment(this.dobMaxDate).format("YYYY");
        emailControl.updateValueAndValidity();
        phoneControl.updateValueAndValidity();
        countryControl.updateValueAndValidity();
    };
    TravellerFormComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken) {
            this.isLoggedIn = true;
        }
    };
    TravellerFormComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = this.loading = true;
        if (this.coAccountForm.invalid) {
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            var country_id = this.coAccountForm.value.country_id.id;
            if (!Number(country_id)) {
                if (this.traveller.country) {
                    country_id = (this.traveller.country.id) ? this.traveller.country.id : '';
                }
                else {
                    country_id = this.location.country.id;
                }
            }
            var country_code = this.coAccountForm.value.country_code;
            if (typeof country_code == 'object') {
                country_code = country_code.id ? country_code.id : this.location.country.id;
            }
            else if (typeof country_code == 'string') {
                country_code = this.travelerInfo.countryCode ? this.travelerInfo.countryCode : this.location.country.id;
            }
            else {
                country_code = this.location.country.id;
            }
            var jsonData = {
                // title: this.coAccountForm.value.title,
                first_name: this.coAccountForm.value.firstName,
                last_name: this.coAccountForm.value.lastName,
                dob: typeof this.coAccountForm.value.dob === 'object' ? moment(this.coAccountForm.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(this.coAccountForm.value.dob, '/')).format('YYYY-MM-DD'),
                gender: this.coAccountForm.value.gender,
                country_id: country_id ? country_id : '',
                passport_expiry: typeof this.coAccountForm.value.passport_expiry === 'object' ? moment(this.coAccountForm.value.passport_expiry).format('YYYY-MM-DD') : null,
                passport_number: this.coAccountForm.value.passport_number,
                country_code: country_code ? country_code : this.location.country.id,
                phone_no: this.coAccountForm.value.phone_no
            };
            var emailObj = { email: this.coAccountForm.value.email ? this.coAccountForm.value.email : '' };
            if (this.travellerId) {
                jsonData = Object.assign(jsonData, emailObj);
                this.flightService.updateAdult(jsonData, this.travellerId).subscribe(function (data) {
                    _this.travelersChanges.emit(data);
                    _this.activeModal.close();
                }, function (error) {
                    _this.submitted = _this.loading = false;
                    if (error.status === 401) {
                        _this.router.navigate(['/']);
                    }
                    _this.toastr.error(error.error.message, 'Traveller Update Error');
                });
            }
            else {
                jsonData = Object.assign(jsonData, emailObj);
                this.flightService.addAdult(jsonData).subscribe(function (data) {
                    _this.travelersChanges.emit(data);
                    _this.activeModal.close();
                }, function (error) {
                    console.log('error');
                    _this.submitted = _this.loading = false;
                    if (error.status === 401) {
                        _this.router.navigate(['/']);
                    }
                    else {
                        _this.submitted = _this.loading = false;
                        _this.toastr.error(error.error.message, 'Traveller Update Error');
                    }
                });
            }
        }
    };
    TravellerFormComponent.prototype.ngOnChanges = function (changes) {
    };
    TravellerFormComponent.prototype.stringToDate = function (string, saprator) {
        var dateArray = string.split(saprator);
        return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
    };
    __decorate([
        core_1.Output()
    ], TravellerFormComponent.prototype, "travelersChanges");
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "travellerId");
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "travelerInfo");
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "countries");
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "countries_code");
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
