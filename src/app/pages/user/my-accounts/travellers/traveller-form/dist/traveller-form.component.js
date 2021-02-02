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
    function TravellerFormComponent(formBuilder, genericService, router, commonFunction, flightService, userService, activeModal, toastr, cookieService, travelerService) {
        this.formBuilder = formBuilder;
        this.genericService = genericService;
        this.router = router;
        this.commonFunction = commonFunction;
        this.flightService = flightService;
        this.userService = userService;
        this.activeModal = activeModal;
        this.toastr = toastr;
        this.cookieService = cookieService;
        this.travelerService = travelerService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelersChanges = new core_1.EventEmitter();
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
            passport_number: ['']
        });
        // this.setUserTypeValidation();
        if (this.travellerId) {
            // this.setTravelerForm();
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
    };
    TravellerFormComponent.prototype.close = function () {
        this.activeModal.close();
    };
    TravellerFormComponent.prototype.setUserTypeValidation = function () {
        var emailControl = this.travellerForm.get('email');
        var phoneControl = this.travellerForm.get('phone_no');
        var countryControl = this.travellerForm.get('country_code');
        var passport_expiryControl = this.travellerForm.get('passport_expiry');
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
        if (this.travellerForm.invalid) {
            this.submitted = true;
            this.loading = false;
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
            var country_code = this.travellerForm.value.country_code;
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
                // title: this.travellerForm.value.title,
                first_name: this.travellerForm.value.firstName,
                last_name: this.travellerForm.value.lastName,
                dob: typeof this.travellerForm.value.dob === 'object' ? moment(this.travellerForm.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(this.travellerForm.value.dob, '/')).format('YYYY-MM-DD'),
                gender: this.travellerForm.value.gender,
                country_id: country_id ? country_id : '',
                passport_expiry: typeof this.travellerForm.value.passport_expiry === 'object' ? moment(this.travellerForm.value.passport_expiry).format('YYYY-MM-DD') : null,
                passport_number: this.travellerForm.value.passport_number,
                country_code: country_code ? country_code : this.location.country.id,
                phone_no: this.travellerForm.value.phone_no
            };
            var emailObj = { email: this.travellerForm.value.email ? this.travellerForm.value.email : '' };
            console.log(jsonData);
            if (this.travellerId) {
                jsonData = Object.assign(jsonData, emailObj);
                this.travelerService.updateAdult(jsonData, this.travellerId).subscribe(function (data) {
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
                this.travelerService.addAdult(jsonData).subscribe(function (data) {
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
                        _this.toastr.error(error.error.message, 'Traveller Add Error');
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
    TravellerFormComponent.prototype.ngOnChanges = function (changes) {
    };
    TravellerFormComponent.prototype.stringToDate = function (string, saprator) {
        var dateArray = string.split(saprator);
        return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
    };
    TravellerFormComponent.prototype.selectGender = function (event, type) {
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
