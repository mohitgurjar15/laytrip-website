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
var TravellerFormComponent = /** @class */ (function () {
    function TravellerFormComponent(formBuilder, genericService, router, commonFunction, flightService, userService, activeModal, toastr) {
        this.formBuilder = formBuilder;
        this.genericService = genericService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.flightService = flightService;
        this.userService = userService;
        this.activeModal = activeModal;
        this.toastr = toastr;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelersChanges = new core_1.EventEmitter();
        this.countries = [];
        this.traveller = [];
        this.countries_code = [];
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
        this.checkUser();
        this.getCountry();
        this.coAccountForm = this.formBuilder.group({
            title: ['mr'],
            gender: ['M'],
            firstName: ['', forms_1.Validators.required],
            lastName: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            country_code: ['', [forms_1.Validators.required]],
            phone_no: ['', [forms_1.Validators.required]],
            country_id: ['', forms_1.Validators.required],
            dob: ['', forms_1.Validators.required],
            passport_expiry: [''],
            passport_number: [''],
            user_type: ['']
        });
        this.setUserTypeValidation();
        if (this.travellerId) {
            this.setTravelerForm();
        }
    };
    TravellerFormComponent.prototype.setTravelerForm = function () {
        this.traveller = this.travelerInfo;
        this.coAccountForm.patchValue({
            title: this.travelerInfo.title ? this.travelerInfo.title : 'mr',
            firstName: this.travelerInfo.firstName ? this.travelerInfo.firstName : '',
            lastName: this.travelerInfo.lastName ? this.travelerInfo.lastName : '',
            email: this.travelerInfo.email ? this.travelerInfo.email : '',
            gender: this.travelerInfo.gender ? this.travelerInfo.gender : 'M',
            phone_no: this.travelerInfo.phoneNo ? this.travelerInfo.phoneNo : '',
            country_code: this.travelerInfo.countryCode ? this.travelerInfo.countryCode : '',
            country_id: this.travelerInfo.country.name ? this.travelerInfo.country.name : '',
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
    TravellerFormComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (data) {
            _this.countries = data.map(function (country) {
                return {
                    id: country.id,
                    name: country.name,
                    code: country.phonecode
                };
            }),
                _this.countries_code = data.map(function (country) {
                    return {
                        id: country.id,
                        name: country.phonecode + ' (' + country.iso2 + ')',
                        code: country.phonecode,
                        country_name: country.name + ' ' + country.phonecode,
                        flag: _this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.svg'
                    };
                });
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
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
                country_id = this.traveller.country.id;
            }
            var jsonData = {
                title: this.coAccountForm.value.title,
                first_name: this.coAccountForm.value.firstName,
                last_name: this.coAccountForm.value.lastName,
                dob: typeof this.coAccountForm.value.dob === 'object' ? moment(this.coAccountForm.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(this.coAccountForm.value.dob, '/')).format('YYYY-MM-DD'),
                gender: this.coAccountForm.value.gender,
                country_id: country_id ? country_id : '',
                // passport_expiry: typeof this.coAccountForm.value.passport_expiry === 'object' ? moment(this.coAccountForm.value.passport_expiry).format('YYYY-MM-DD') : moment(this.stringToDate(this.coAccountForm.value.passport_expiry, '/')).format('YYYY-MM-DD'),
                passport_expiry: typeof this.coAccountForm.value.passport_expiry === 'object' ? moment(this.coAccountForm.value.passport_expiry).format('YYYY-MM-DD') : moment(this.stringToDate(this.coAccountForm.value.passport_expiry, '/')).format('YYYY-MM-DD'),
                passport_number: this.coAccountForm.value.passport_number,
                country_code: this.coAccountForm.value.country_code.country_name &&
                    this.coAccountForm.value.country_code !== 'null' ? this.coAccountForm.value.country_code.country_name : this.coAccountForm.value.country_code,
                phone_no: this.coAccountForm.value.phone_no
            };
            if (this.travellerId) {
                this.flightService.updateAdult(jsonData, this.travellerId).subscribe(function (data) {
                    _this.travelersChanges.emit(data);
                    _this.activeModal.close();
                }, function (error) {
                    _this.submitted = _this.loading = false;
                    if (error.status === 401) {
                        _this.router.navigate(['/']);
                    }
                });
            }
            else {
                var emailObj = { email: this.coAccountForm.value.email ? this.coAccountForm.value.email : '' };
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
