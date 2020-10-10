"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TravelerFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var moment = require("moment");
var environment_1 = require("../../../environments/environment");
var TravelerFormComponent = /** @class */ (function () {
    function TravelerFormComponent(formBuilder, flightService, router, commonFunction, cookieService) {
        this.formBuilder = formBuilder;
        this.flightService = flightService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.cookieService = cookieService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.usersType = '';
        this.traveler = [];
        this.travelerFormChange = new core_1.EventEmitter();
        this.submitted = false;
        this.loading = false;
        this.isLoggedIn = false;
        this.defaultDate = moment().add(1, 'months').format("DD MMM'YY dddd");
        this.editMode = false;
        this.formStatus = false;
        this.is_passport_required = false;
        this._date = new Date();
        this.locale = {
            format: 'DD/MM/YYYY',
            displayFormat: 'DD/MM/YYYY'
        };
        this.expiryMinDate = new Date(moment().format("YYYY-MM-DD"));
    }
    TravelerFormComponent.prototype.ngOnInit = function () {
        this.adultForm = this.formBuilder.group({
            title: ['mr', forms_1.Validators.required],
            gender: ['M', forms_1.Validators.required],
            firstName: ['', forms_1.Validators.required],
            lastName: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            country_code: ['', [forms_1.Validators.required]],
            phone_no: ['', [forms_1.Validators.required]],
            country_id: ['', forms_1.Validators.required],
            dob: ['', forms_1.Validators.required],
            passport_expiry: [''],
            frequently_no: [''],
            user_type: ['']
        });
        this.setUserTypeValidation();
        if (this.traveler.userId) {
            this.adultForm.patchValue({
                title: this.traveler.title,
                firstName: this.traveler.firstName,
                lastName: this.traveler.lastName,
                email: this.traveler.email,
                gender: this.traveler.gender,
                country_code: this.traveler.countryCode,
                phone_no: this.traveler.phoneNo,
                country_id: this.traveler.country != null ? this.traveler.country.name : '',
                passport_number: this.traveler.passportNumber,
                dob: this.traveler.dob ? new Date(this.traveler.dob) : '',
                passport_expiry: this.traveler.passport_expiry ? new Date(this.traveler.passport_expiry) : '',
                frequently_no: ''
            });
            this.traveler.isComplete = this.adultForm.status === 'VALID' ? true : false;
            // this.auditFormStatus.emit(this.formStatus);
        }
    };
    TravelerFormComponent.prototype.ngDoCheck = function () {
        this.checkUser();
        this.countries = this.countries;
        this.countries_code = this.countries_code;
    };
    TravelerFormComponent.prototype.setUserTypeValidation = function () {
        this._itinerary = this.cookieService.get('_itinerary') ? JSON.parse(this.cookieService.get('_itinerary')) : [];
        var emailControl = this.adultForm.get('email');
        var phoneControl = this.adultForm.get('phone_no');
        var countryControl = this.adultForm.get('country_code');
        var passport_numberControl = this.adultForm.get('passport_number');
        var passport_expiryControl = this.adultForm.get('passport_expiry');
        if (this.type === 'adult') {
            emailControl.setValidators([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]);
            phoneControl.setValidators([forms_1.Validators.required]);
            countryControl.setValidators([forms_1.Validators.required]);
            this.dobMinDate = new Date(moment().subtract(50, 'years').format("MM/DD/YYYY"));
            this.dobMaxDate = new Date(moment().subtract(12, 'years').format("MM/DD/YYYY"));
            this.minyear = moment(this.dobMinDate).format("YYYY") + ":" + moment(this.dobMaxDate).format("YYYY");
        }
        else if (this.type === 'child') {
            emailControl.setValidators(forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$'));
            phoneControl.setValidators(null);
            countryControl.setValidators(null);
            this.dobMinDate = new Date(moment().subtract(12, 'years').format("MM/DD/YYYY"));
            this.dobMaxDate = new Date(moment().subtract(2, 'years').format("MM/DD/YYYY"));
            this.minyear = moment(this.dobMinDate).format("YYYY") + ":" + moment(this.dobMaxDate).format("YYYY");
        }
        else if (this.type === 'infant') {
            this.dobMinDate = new Date(moment().subtract(2, 'years').format("MM/DD/YYYY"));
            this.dobMaxDate = new Date();
            this.minyear = moment(this.dobMinDate).format("YYYY") + ":" + moment(this.dobMaxDate).format("YYYY");
            emailControl.setValidators(forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$'));
            phoneControl.setValidators(null);
            countryControl.setValidators(null);
        }
        if ((this.type === 'adult' || this.type === 'child') && this.is_passport_required) {
            passport_numberControl.setValidators([forms_1.Validators.required]);
            passport_expiryControl.setValidators([forms_1.Validators.required]);
            passport_numberControl.updateValueAndValidity();
        }
        emailControl.updateValueAndValidity();
        phoneControl.updateValueAndValidity();
        countryControl.updateValueAndValidity();
        passport_expiryControl.updateValueAndValidity();
    };
    TravelerFormComponent.prototype.ngOnChanges = function (changes) {
        if (changes['traveler']) {
        }
    };
    TravelerFormComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        this.isLoggedIn = false;
        if (userToken && userToken != 'undefined' && userToken != 'null') {
            this.isLoggedIn = true;
        }
    };
    TravelerFormComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = this.loading = true;
        if (this.adultForm.invalid) {
            this.submitted = true;
            this.loading = false;
            return;
        }
        else {
            var country_id = this.adultForm.value.country_id.id;
            if (!Number(country_id)) {
                country_id = this.traveler.country.id;
            }
            var jsonData = {
                title: this.adultForm.value.title,
                first_name: this.adultForm.value.firstName,
                last_name: this.adultForm.value.lastName,
                frequently_no: this.adultForm.value.frequently_no,
                passport_number: this.adultForm.value.passport_number,
                dob: typeof this.adultForm.value.dob === 'object' ? moment(this.adultForm.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(this.adultForm.value.dob, '/')).format('YYYY-MM-DD'),
                gender: this.adultForm.value.gender,
                country_id: country_id ? country_id : ''
            };
            if ((this.type === 'adult' || this.type === 'child') && this.is_passport_required) {
                var passport_expiry_json = { passport_expiry: typeof this.adultForm.value.passport_expiry === 'object' ? moment(this.adultForm.value.passport_expiry).format('YYYY-MM-DD') : '' };
                jsonData = Object.assign(jsonData, passport_expiry_json);
            }
            if (this.type === 'adult') {
                var adultObj = {
                    country_code: this.adultForm.value.country_code.code &&
                        this.adultForm.value.country_code !== 'null' ? this.adultForm.value.country_code.code : this.adultForm.value.country_code,
                    phone_no: this.adultForm.value.phone_no
                };
                jsonData = Object.assign(jsonData, adultObj);
            }
            if (this.traveler && this.traveler.userId) {
                this.flightService.updateAdult(jsonData, this.traveler.userId).subscribe(function (data) {
                    _this.submitted = _this.loading = false;
                    // this.travelerFormChange.observers.push(data);
                    _this.travelerFormChange.emit(data);
                    $('.collapse').collapse('hide');
                    $('#accordion-' + _this.type).hide();
                }, function (error) {
                    console.log('error');
                    _this.submitted = _this.loading = false;
                    if (error.status === 401) {
                        _this.router.navigate(['/']);
                    }
                });
            }
            else {
                if (this.type === 'adult') {
                    var emailObj = { email: this.adultForm.value.email ? this.adultForm.value.email : '' };
                    jsonData = Object.assign(jsonData, emailObj);
                }
                this.flightService.addAdult(jsonData).subscribe(function (data) {
                    _this.adultForm.reset();
                    _this.submitted = _this.loading = false;
                    if (!_this.isLoggedIn) {
                        localStorage.setItem("_lay_sess", data.token);
                    }
                    _this.travelerFormChange.emit(data);
                    $('.collapse').collapse('hide');
                    $('#accordion-' + _this.type).hide();
                }, function (error) {
                    console.log('error');
                    _this.submitted = _this.loading = false;
                    if (error.status === 401) {
                        _this.router.navigate(['/']);
                    }
                });
            }
        }
    };
    TravelerFormComponent.prototype.stringToDate = function (string, saprator) {
        var dateArray = string.split(saprator);
        return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
    };
    __decorate([
        core_1.Input('var')
    ], TravelerFormComponent.prototype, "usersType");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "traveler");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "type");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "countries");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "countries_code");
    __decorate([
        core_1.Output()
    ], TravelerFormComponent.prototype, "travelerFormChange");
    TravelerFormComponent = __decorate([
        core_1.Component({
            selector: 'app-traveler-form',
            templateUrl: './traveler-form.component.html',
            styleUrls: ['./traveler-form.component.scss']
        })
    ], TravelerFormComponent);
    return TravelerFormComponent;
}());
exports.TravelerFormComponent = TravelerFormComponent;
