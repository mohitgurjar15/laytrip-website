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
    function TravellerFormComponent(formBuilder, router, commonFunction, toastr, cookieService, travelerService, genericService, checkOutService, modalService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.commonFunction = commonFunction;
        this.toastr = toastr;
        this.cookieService = cookieService;
        this.travelerService = travelerService;
        this.genericService = genericService;
        this.checkOutService = checkOutService;
        this.modalService = modalService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.index = 0;
        this.loadingValue = new core_1.EventEmitter();
        this.travelerFormChange = new core_1.EventEmitter();
        this.deleteTravelerId = new core_1.EventEmitter();
        // countries = [];
        this.countries_code = [];
        this.is_gender = true;
        this.is_type = 'M';
        this.traveller = [];
        this.isLoggedIn = false;
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
        this.dateYeaMask = {
            guide: false,
            showMask: false,
            mask: [
                /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/
            ]
        };
    }
    TravellerFormComponent.prototype.ngOnInit = function () {
        // this.getCountry();
        var location = this.cookieService.get('__loc');
        try {
            this.location = JSON.parse(location);
        }
        catch (e) {
        }
        this.travellerForm = this.formBuilder.group({
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]{2,}$')]],
            gender: ['M', [forms_1.Validators.required]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]],
            phone_no: ['', [forms_1.Validators.required, forms_1.Validators.minLength(10)]],
            country_id: ['United States', [forms_1.Validators.required]],
            country_code: ['+1', [forms_1.Validators.required]],
            dob: [null, [forms_1.Validators.required, forms_1.Validators.pattern(/^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/)]],
            passport_expiry: [''],
            passport_number: ['']
        }, { validators: custom_validators_1.phoneAndPhoneCodeValidation() });
        // this.travelerFormChange.emit(this.travellerForm);
        this.setUserTypeValidation();
        if (this.travellerId) {
            this.setTravelerForm();
        }
    };
    TravellerFormComponent.prototype.loadJquery = function () {
        $(document).ready(function () {
            $('.error_border').each(function () {
                $(this).removeClass('error_border');
            });
            if ($('.tel_span .form-control').hasClass('.ng-touched .ng-invalid')) {
                $(".tel_span").toggleClass("error_border");
            }
        });
    };
    /*  ngOnChanges(changes: SimpleChanges) {
       this.checkOutService.getCountries.subscribe(res => {
         this.countries = res;
       });
     } */
    TravellerFormComponent.prototype.getCountry = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (res) {
            _this.checkOutService.setCountries(res);
        });
    };
    TravellerFormComponent.prototype.setTravelerForm = function () {
        this.traveller = this.travelerInfo;
        console.log(typeof this.travelerInfo.dob);
        var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
        var child2YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
        var travellerDob = moment(this.travelerInfo.dob).format('YYYY-MM-DD');
        var phoneControl = this.travellerForm.get('phone_no');
        var emailControl = this.travellerForm.get('email');
        if (travellerDob <= adult12YrPastDate) {
            this.isAdult = true;
            this.isChild = false;
            phoneControl.setValidators([forms_1.Validators.required]);
            emailControl.setValidators([forms_1.Validators.required]);
            phoneControl.updateValueAndValidity();
            emailControl.updateValueAndValidity();
        }
        else if (travellerDob < child2YrPastDate) {
            this.isAdult = false;
            this.isChild = true;
            this.travellerForm.setErrors(null);
        }
        else {
            this.isAdult = this.isChild = false;
            this.travellerForm.setErrors(null);
        }
        this.travellerForm.patchValue({
            // title: this.travelerInfo.title?this.travelerInfo.title:'mr',
            firstName: this.travelerInfo.firstName ? this.travelerInfo.firstName : '',
            lastName: this.travelerInfo.lastName ? this.travelerInfo.lastName : '',
            email: this.travelerInfo.email ? this.travelerInfo.email : '',
            gender: this.travelerInfo.gender ? this.travelerInfo.gender : 'M',
            phone_no: this.travelerInfo.phoneNo ? this.travelerInfo.phoneNo : '',
            country_code: this.travelerInfo.countryCode ? this.travelerInfo.countryCode : '',
            country_id: typeof this.travelerInfo.country != 'undefined' && this.travelerInfo.country ? this.travelerInfo.country.name : '',
            dob: this.travelerInfo.dob ? this.commonFunction.convertDateMMDDYYYY(this.travelerInfo.dob, 'YYYY-MM-DD') : '',
            passport_number: this.travelerInfo.passportNumber ? this.travelerInfo.passportNumber : '',
            passport_expiry: (this.travelerInfo.passportExpiry && this.travelerInfo.passportExpiry != 'Invalid date' && this.travelerInfo.passportExpiry != '') ? new Date(this.travelerInfo.passportExpiry) : ''
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
        this.loadingValue.emit(true);
        var controls = this.travellerForm.controls;
        if (this.travellerId) {
            this.validateDob(moment(this.travellerForm.controls.dob.value).format('MM-DD-YYYY'));
        }
        if (this.travellerForm.invalid) {
            Object.keys(controls).forEach(function (controlName) {
                return controls[controlName].markAsTouched();
            });
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
                    country_id = 233; //this.location.country.id;
                }
            }
            var jsonData = {
                first_name: this.travellerForm.value.firstName,
                last_name: this.travellerForm.value.lastName,
                dob: typeof this.travellerForm.value.dob === 'object' ? moment(this.travellerForm.value.dob, 'MM-DD-YYYY').format('YYYY-MM-DD') : moment(this.travellerForm.value.dob, 'MM-DD-YYYY').format('YYYY-MM-DD'),
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
                    // this.toastr.success('', 'Traveler updated successfully');
                }, function (error) {
                    _this.loadingValue.emit(false);
                    // this.toastr.error(error.error.message, 'Traveler Update Error');
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
                    // this.toastr.success('', 'Traveler added successfully');
                }, function (error) {
                    _this.loadingValue.emit(false);
                    // this.toastr.error(error.error.message, 'Traveler Add Error');
                    if (error.status === 401) {
                        _this.router.navigate(['/']);
                    }
                });
            }
        }
    };
    TravellerFormComponent.prototype.stringToDate = function (string, saprator) {
        var dateArray = string.split(saprator);
        return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
    };
    TravellerFormComponent.prototype.validateDob = function (event) {
        console.log(typeof event);
        var eventDate = (typeof event == 'object' && event.target.value != 'undefined') ? event.target.value : event;
        console.log(eventDate);
        if (eventDate.length == 10) {
            var inputValueReplace = eventDate.replace("/", "-");
            var inputDate = inputValueReplace.replace("/", "-");
            var selectedDate = moment(inputDate, 'MM-DD-YYYY').format('YYYY-MM-DD');
            var adult12YrPastDate = moment().subtract(12, 'years').format("YYYY-MM-DD");
            var child2YrPastDate = moment().subtract(2, 'years').format("YYYY-MM-DD");
            var emailControl = this.travellerForm.get('email');
            var phoneControl = this.travellerForm.get('phone_no');
            var countryControl = this.travellerForm.get('country_code');
            if (selectedDate <= adult12YrPastDate) {
                this.isAdult = true;
                this.isChild = false;
                emailControl.setValidators([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]);
                phoneControl.setValidators([forms_1.Validators.required, forms_1.Validators.minLength(10)]);
                countryControl.setValidators([forms_1.Validators.required]);
            }
            else if (selectedDate < child2YrPastDate) {
                this.isAdult = false;
                this.isChild = true;
                this.travellerForm.setValidators(null);
                emailControl.setValidators(null);
                phoneControl.setValidators(null);
                countryControl.setValidators(null);
            }
            else {
                this.isAdult = this.isChild = false;
                this.travellerForm.setValidators(null);
                emailControl.setValidators(null);
                phoneControl.setValidators(null);
                countryControl.setValidators(null);
            }
            phoneControl.updateValueAndValidity();
            emailControl.updateValueAndValidity();
            countryControl.updateValueAndValidity();
        }
    };
    TravellerFormComponent.prototype.deleteTraveller = function (travellerId) {
        this.deleteTravelerId.emit(travellerId);
    };
    TravellerFormComponent.prototype.openDeleteModal = function (content, userId) {
        var _this = this;
        if (userId === void 0) { userId = ''; }
        this.modalReference = this.modalService.open(content, { windowClass: 'cmn_delete_modal', centered: true });
        this.userId = userId;
        this.modalReference.result.then(function (result) {
            _this.closeResult = "Closed with: " + result;
        }, function (reason) {
            // this.getTravelers();
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    };
    TravellerFormComponent.prototype.deleteTravellerData = function () {
        var _this = this;
        this.travelerService["delete"](this.userId).subscribe(function (data) {
            _this.travelerFormChange.emit(_this.userId);
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
            else {
            }
        });
        this.modalReference.close();
    };
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "travellerId");
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "index");
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "travelerInfo");
    __decorate([
        core_1.Input()
    ], TravellerFormComponent.prototype, "countries");
    __decorate([
        core_1.Output()
    ], TravellerFormComponent.prototype, "loadingValue");
    __decorate([
        core_1.Output()
    ], TravellerFormComponent.prototype, "travelerFormChange");
    __decorate([
        core_1.Output()
    ], TravellerFormComponent.prototype, "deleteTravelerId");
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
