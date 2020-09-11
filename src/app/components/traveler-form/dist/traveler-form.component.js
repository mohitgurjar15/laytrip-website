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
    function TravelerFormComponent(formBuilder, flightService, router, commonFunction) {
        this.formBuilder = formBuilder;
        this.flightService = flightService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.usersType = '';
        this.traveler = [];
        this.valueChange = new core_1.EventEmitter();
        this.auditFormStatus = new core_1.EventEmitter();
        this.submitted = false;
        this.loading = false;
        this.isLoggedIn = false;
        this.defaultDate = moment().add(1, 'months').format("DD MMM'YY dddd");
        this.editMode = false;
        this.formStatus = false;
        this.dobMaxDate = moment();
        this.expiryMinDate = moment().add(2, 'days');
    }
    TravelerFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.adultForm = this.formBuilder.group({
            title: [''],
            gender: ['', forms_1.Validators.required],
            firstName: ['', forms_1.Validators.required],
            lastName: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            dob: ['', forms_1.Validators.required],
            country_code: ['', forms_1.Validators.required],
            phone_no: ['', forms_1.Validators.required],
            country_id: ['', forms_1.Validators.required],
            frequently_no: [''],
            passport_expiry: [''],
            passport_number: [''],
            user_type: ['']
        });
        this.setUserTypeValidation();
        var dob_selected = new Date(this.traveler.dob);
        var pass_exp__selected = new Date(this.traveler.passportExpiry);
        if (this.traveler.userId) {
            this.adultForm.patchValue({
                title: this.traveler.title,
                firstName: this.traveler.firstName,
                lastName: this.traveler.lastName,
                email: this.traveler.email,
                gender: this.traveler.gender,
                dob: { year: dob_selected.getFullYear(), month: dob_selected.getMonth(), day: dob_selected.getDate() },
                passport_expiry: { year: pass_exp__selected.getFullYear(), month: pass_exp__selected.getMonth(), day: pass_exp__selected.getDate() },
                country_code: this.traveler.countryCode,
                phone_no: this.traveler.phoneNo,
                country_id: this.traveler.country != null ? this.traveler.country.name : '',
                passport_number: this.traveler.passportNumber,
                frequently_no: ''
            });
        }
        this.formStatus = this.adultForm.status === 'VALID' ? true : false;
        // console.log(this.formStatus)
        setTimeout(function () {
            _this.auditFormStatus.emit(_this.formStatus);
        }, 1000);
    };
    TravelerFormComponent.prototype.ngDoCheck = function () {
        this.countries = this.countries;
        this.countries_code = this.countries_code;
    };
    TravelerFormComponent.prototype.setUserTypeValidation = function () {
        var emailControl = this.adultForm.get('email');
        var phoneControl = this.adultForm.get('phone_no');
        var countryControl = this.adultForm.get('country_code');
        if (this.type == 'adult') {
            emailControl.setValidators([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]);
            phoneControl.setValidators([forms_1.Validators.required]);
            countryControl.setValidators([forms_1.Validators.required]);
            this.dobMaxDate = moment().add(-12, 'year');
        }
        else if (this.type === 'child') {
            emailControl.setValidators(forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$'));
            phoneControl.setValidators(null);
            countryControl.setValidators(null);
            this.dobMinDate = moment().add(-12, 'year');
            this.dobMaxDate = moment().add(-2, 'year');
        }
        else if (this.type === 'infant') {
            this.dobMinDate = moment().add(-2, 'year');
            this.dobMaxDate = moment();
            emailControl.setValidators(forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$'));
            phoneControl.setValidators(null);
            countryControl.setValidators(null);
        }
        emailControl.updateValueAndValidity();
        phoneControl.updateValueAndValidity();
        countryControl.updateValueAndValidity();
    };
    TravelerFormComponent.prototype.ngOnChanges = function (changes) {
        if (changes['traveler']) {
        }
    };
    TravelerFormComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken) {
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
                dob: moment(this.adultForm.value.dob.startDate).format('YYYY-MM-DD'),
                gender: this.adultForm.value.gender,
                country_code: this.adultForm.value.country_code.code,
                country_id: country_id,
                phone_no: this.adultForm.value.phone_no,
                passport_expiry: moment(this.adultForm.value.passport_expiry.startDate).format('YYYY-MM-DD')
            };
            if (this.traveler && this.traveler.userId) {
                this.flightService.updateAdult(jsonData, this.traveler.userId).subscribe(function (data) {
                    _this.submitted = _this.loading = false;
                    _this.valueChange.emit(data);
                    $('.collapse').collapse('hide');
                }, function (error) {
                    console.log('error');
                    _this.submitted = _this.loading = false;
                    if (error.status === 401) {
                        // this.router.navigate(['/']);
                    }
                });
            }
            else {
                var emailObj = { email: this.adultForm.value.email };
                var addJsons = Object.assign(jsonData, emailObj);
                this.flightService.addAdult(addJsons).subscribe(function (data) {
                    _this.adultForm.reset();
                    _this.submitted = _this.loading = false;
                    if (!_this.isLoggedIn) {
                        localStorage.setItem("_lay_sess", data.token);
                    }
                    _this.valueChange.emit(data);
                    $('.collapse').collapse('hide');
                }, function (error) {
                    console.log('error');
                    _this.submitted = _this.loading = false;
                    if (error.status === 401) {
                        // this.router.navigate(['/']);
                    }
                });
            }
        }
    };
    TravelerFormComponent.prototype.dobDateUpdate = function (date) {
        this.expiryMinDate = moment(this.adultForm.value.passport_expiry.startDate);
        console.log(this.expiryMinDate);
    };
    TravelerFormComponent.prototype.expiryDateUpdate = function (date) {
        this.expiryMinDate = moment(this.adultForm.value.passport_expiry.startDate);
    };
    __decorate([
        core_1.Input('var')
    ], TravelerFormComponent.prototype, "usersType");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "traveler");
    __decorate([
        core_1.Output()
    ], TravelerFormComponent.prototype, "valueChange");
    __decorate([
        core_1.Output()
    ], TravelerFormComponent.prototype, "auditFormStatus");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "type");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "countries");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "countries_code");
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
