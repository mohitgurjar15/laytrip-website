"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.TravelerFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../environments/environment");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngbDateCustomParserFormatter_1 = require("../../_helpers/ngbDateCustomParserFormatter");
var traveller_helper_1 = require("../../_helpers/traveller.helper");
var moment = require("moment");
var jwt_helper_1 = require("src/app/_helpers/jwt.helper");
var phone_masking_helper_1 = require("src/app/_helpers/phone-masking.helper");
var TravelerFormComponent = /** @class */ (function () {
    function TravelerFormComponent(formBuilder, router, commonFunction, checkOutService, cartService, travelerService, cd) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.commonFunction = commonFunction;
        this.checkOutService = checkOutService;
        this.cartService = cartService;
        this.travelerService = travelerService;
        this.cd = cd;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.traveler_number = 0;
        this.countries = [];
        this.phoneCodelist = [];
        this.myTravelers = [];
        this.travelers = {
            type0: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            },
            type1: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            },
            type2: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            },
            type3: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            },
            type4: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            },
            type5: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            },
            type6: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            },
            type7: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            },
            type8: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            },
            type9: {
                adults: [],
                adult: 0,
                child: 0,
                infant: 0
            }
        };
        this.dobMinDate = new Date();
        this.baggageDescription = '';
        this.passPortMinDate = new Date();
        this.dateYeaMask = {
            guide: false,
            showMask: false,
            mask: [
                /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/
            ]
        };
        this.isAdultTravller = true;
        this.isChildTravller = true;
        this.isInfantTravller = true;
        this.accountHolderEmail = '';
        this.travlerLabels = traveller_helper_1.travlerLabels;
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (this.userInfo.roleId != 7) {
            this.accountHolderEmail = this.userInfo.email;
        }
        //console.log("this.accountHolderEmail",this.userInfo,this.accountHolderEmail)
    }
    TravelerFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadJquery();
        this.bsConfig = Object.assign({}, { dateInputFormat: 'MMM DD, YYYY', containerClass: 'theme-default', showWeekNumbers: false, adaptivePosition: true });
        this.travelerForm = this.formBuilder.group({
            type0: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type1: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type2: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type3: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type4: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type5: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type6: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type7: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type8: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type9: this.formBuilder.group({
                adults: this.formBuilder.array([])
            })
        });
        this.checkOutService.getTravelers.subscribe(function (travelers) {
            _this.myTravelers = travelers;
            if (_this.myTravelers.length == 0) {
                _this.isAdultTravller = false;
                _this.isChildTravller = false;
                _this.isInfantTravller = false;
            }
            else {
                var adult = _this.myTravelers.findIndex(function (x) { return x.user_type == 'adult'; });
                if (adult != -1) {
                    _this.isAdultTravller = true;
                }
                else {
                    _this.isAdultTravller = false;
                }
                var child = _this.myTravelers.findIndex(function (x) { return x.user_type == 'child'; });
                if (child != -1) {
                    _this.isChildTravller = true;
                }
                else {
                    _this.isChildTravller = false;
                }
                var infant = _this.myTravelers.findIndex(function (x) { return x.user_type == 'infant'; });
                if (infant != -1) {
                    _this.isInfantTravller = true;
                }
                else {
                    _this.isInfantTravller = false;
                }
            }
        });
        this.cartService.getCartTravelers.subscribe(function (travelers) {
            _this.travelers = travelers;
        });
        if (this.cartItem.type == 'flight') {
            for (var i = 0; i < this.cartItem.module_info.adult_count; i++) {
                this.travelers["type" + this.cartNumber].cartId = this.cartId;
                this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.flight.adult));
                // this.travelers[`type${this.cartNumber}`].adults[i].email=(this.accountHolderEmail && i==0)?this.accountHolderEmail:'';
                if (!this.cartItem.module_info.is_passport_required) {
                    delete this.travelers["type" + this.cartNumber].adults[i].passport_expiry;
                    delete this.travelers["type" + this.cartNumber].adults[i].passport_number;
                }
                else {
                    this.travelers["type" + this.cartNumber].adults[i].is_passport_required = true;
                }
                this.travelers["type" + this.cartNumber].adult = this.cartItem.module_info.adult_count;
                this.cd.detectChanges();
            }
            for (var i = 0; i < this.cartItem.module_info.child_count; i++) {
                this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.flight.child));
                this.travelers["type" + this.cartNumber].child = this.cartItem.module_info.child_count;
                if (!this.cartItem.module_info.is_passport_required) {
                    delete this.travelers["type" + this.cartNumber].adults[i].passport_expiry;
                    delete this.travelers["type" + this.cartNumber].adults[i].passport_number;
                }
                else {
                    this.travelers["type" + this.cartNumber].adults[i].is_passport_required = true;
                }
                this.cd.detectChanges();
            }
            for (var i = 0; i < this.cartItem.module_info.infant_count; i++) {
                this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.flight.infant));
                this.travelers["type" + this.cartNumber].infant = this.cartItem.module_info.infant_count;
                this.cd.detectChanges();
            }
        }
        if (this.cartItem.type == 'hotel') {
            for (var i = 0; i < this.cartItem.module_info.input_data.num_rooms; i++) {
                this.travelers["type" + this.cartNumber].cartId = this.cartId;
                this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.hotel.adult));
                // this.travelers[`type${this.cartNumber}`].adults[i].email=(this.accountHolderEmail && i==0)?this.accountHolderEmail:'';
                if (i != 0) {
                    this.travelers["type" + this.cartNumber].adults[i].is_email_required = false;
                    this.travelers["type" + this.cartNumber].adults[i].is_phone_required = false;
                }
                this.travelers["type" + this.cartNumber].adult = this.cartItem.module_info.adult_count;
                this.cd.detectChanges();
            }
        }
        var _loop_1 = function (i) {
            var traveler = this_1.myTravelers.find(function (traveler) { return traveler.userId == _this.cartItem.travelers[i].userId; });
            this_1.travelers["type" + this_1.cartNumber].adults[i].type = traveler.user_type;
            this_1.travelers["type" + this_1.cartNumber].adults[i].userId = traveler.userId;
            this_1.travelers["type" + this_1.cartNumber].adults[i].first_name = traveler.firstName;
            this_1.travelers["type" + this_1.cartNumber].adults[i].last_name = traveler.lastName;
            this_1.travelers["type" + this_1.cartNumber].adults[i].gender = traveler.gender;
            this_1.travelers["type" + this_1.cartNumber].adults[i].email = traveler.email;
            this_1.travelers["type" + this_1.cartNumber].adults[i].country_code = traveler.countryCode;
            this_1.travelers["type" + this_1.cartNumber].adults[i].phone_no = traveler.phoneNo;
            this_1.travelers["type" + this_1.cartNumber].adults[i].country_id = traveler.country != null ? traveler.country.id : '';
            this_1.travelers["type" + this_1.cartNumber].adults[i].dob = moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY');
            if (this_1.travelers["type" + this_1.cartNumber].adults[i].is_passport_required) {
                this_1.travelers["type" + this_1.cartNumber].adults[i].passport_number = traveler.passportNumber;
                this_1.travelers["type" + this_1.cartNumber].adults[i].passport_expiry = traveler.passportExpiry && traveler.passportExpiry != 'Invalid date' ? moment(traveler.passportExpiry, "YYYY-MM-DD").format('MM/DD/YYYY') : '';
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.cartItem.travelers.length; i++) {
            _loop_1(i);
        }
        this.patch();
        this.cartService.setCartTravelers(this.travelers);
        this.cd.detectChanges();
        this.travelerForm.valueChanges.subscribe(function (value) {
            _this.checkOutService.emitTravelersformData(_this.travelerForm);
        });
        this.cartService.getSelectedCart.subscribe(function (cartNumber) {
            _this.cartNumber = cartNumber;
        });
        this.checkOutService.emitTravelersformData(this.travelerForm);
        //this.baggageDescription = this.formatBaggageDescription(this.cartItem.module_info.routes[0].stops[0].cabin_baggage, this.cartItem.module_info.routes[0].stops[0].checkin_baggage)
    };
    TravelerFormComponent.prototype.loadJquery = function () {
        $(document).on("click", ".card-header", function () {
            if ($(this).find('.card-link').hasClass('collapsed')) {
                $(this).find('.traveler_drop_down').addClass('hide_section');
                $(this).find('.mob_names').addClass('hide_section');
            }
            else {
                $(this).find('.trv_name').addClass('hide_section');
                $(this).find('.traveler_drop_down').removeClass('hide_section');
                $(this).find('.mob_names').removeClass('hide_section');
            }
        });
    };
    TravelerFormComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        this.checkOutService.getCountries.subscribe(function (res) {
            _this.countries = res;
            _this.setUSCountryInFirstElement(_this.countries);
        });
    };
    TravelerFormComponent.prototype.setUSCountryInFirstElement = function (countries) {
        var usCountryObj = countries.find(function (x) { return x.id === 233; });
        var removedUsObj = countries.filter(function (obj) { return obj.id !== 233; });
        this.phoneCodelist = [];
        removedUsObj.sort(function (a, b) {
            return (a['name'].toLowerCase() > b['name'].toLowerCase()) ? 1 : ((a['name'].toLowerCase() < b['name'].toLowerCase()) ? -1 : 0);
        });
        removedUsObj.unshift(usCountryObj);
        var filteredArr = removedUsObj.reduce(function (acc, current) {
            var x = acc.find(function (item) { return item.phonecode == current.phonecode; });
            if (!x) {
                return acc.concat([current]);
            }
            else {
                return acc;
            }
        }, []);
        this.phoneCodelist = filteredArr;
    };
    TravelerFormComponent.prototype.patch = function () {
        var _this = this;
        var _loop_2 = function (i) {
            //this.travelerForm.controls[`type${i}`]['controls'].cartId.setValue(this.travelers[`type${i}`].cartId);
            var control = this_2.travelerForm.get("type" + i + ".adults");
            control.controls = [];
            this_2.travelers["type" + i].adults.forEach(function (x, i) {
                control.push(_this.patchValues(x, i));
            });
        };
        var this_2 = this;
        for (var i = 0; i < Object.keys(this.travelers).length; i++) {
            _loop_2(i);
        }
    };
    TravelerFormComponent.prototype.patchValues = function (x, i) {
        if (x.module == 'flight') {
            return this.formBuilder.group({
                first_name: [x.first_name, [forms_1.Validators.required, forms_1.Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
                last_name: [x.last_name, [forms_1.Validators.required, forms_1.Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
                email: (x.type === 'adult' || x.type === '') ? [x.email, [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]] : [x.email],
                phone_no: (x.type === 'adult' || x.type === '') ? [x.phone_no, [forms_1.Validators.required, forms_1.Validators.minLength(10)]] : [x.phone_no],
                phone_no_format: (x.type === 'adult' || x.type === '') ? [x.phone_no_format, [forms_1.Validators.required]] : [x.phone_no_format],
                phone_no_length: (x.type === 'adult' || x.type === '') ? [x.phone_no_length, [forms_1.Validators.required]] : [x.phone_no_length],
                country_code: (x.type === 'adult' || x.type === '') ? [x.country_code, [forms_1.Validators.required]] : [x.country_code],
                passport_number: (x.is_passport_required) ? [x.passport_number, [forms_1.Validators.required]] : [x.passport_number],
                passport_expiry: (x.is_passport_required) ? [x.passport_expiry || null, [forms_1.Validators.required]] : [x.passport_expiry],
                is_passport_required: [x.is_passport_required, [forms_1.Validators.required]],
                dob: [x.dob ? x.dob : '', [forms_1.Validators.required, forms_1.Validators.pattern(/^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/)]],
                country_id: [x.country_id ? x.country_id : 233, [forms_1.Validators.required]],
                gender: [x.gender, [forms_1.Validators.required]],
                userId: [x.userId],
                type: [x.type],
                dobMinDate: [x.dobMinDate],
                dobMaxDate: [x.dobMaxDate],
                module: [x.module],
                module_id: [x.module_id],
                is_valid_date: [x.is_valid_date],
                is_email_required: [x.is_email_required],
                is_phone_required: [x.is_phone_required]
            }, { updateOn: 'blur' });
        }
        if (x.module == 'hotel') {
            return this.formBuilder.group({
                first_name: [x.first_name, [forms_1.Validators.required, forms_1.Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
                last_name: [x.last_name, [forms_1.Validators.required, forms_1.Validators.pattern('^(?! )(?!.* $)[a-zA-Z -]{2,}$')]],
                email: (i == 0) ? [x.email, [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]] : [x.email],
                phone_no: (i == 0) ? [x.phone_no, [forms_1.Validators.required, forms_1.Validators.minLength(10)]] : [x.phone_no],
                phone_no_format: (i == 0) ? [x.phone_no_format, [forms_1.Validators.required]] : [x.phone_no_format],
                phone_no_length: (i == 0) ? [x.phone_no_length, [forms_1.Validators.required]] : [x.phone_no_length],
                country_code: (i == 0) ? [x.country_code, [forms_1.Validators.required]] : [x.country_code],
                userId: [x.userId],
                dob: [x.dob],
                gender: [x.gender],
                passport_number: [x.passport_number],
                passport_expiry: [x.passport_expiry],
                is_passport_required: [x.is_passport_required],
                country_id: [x.country_id],
                type: [x.type],
                module: [x.module],
                module_id: [x.module_id],
                is_valid_date: [x.is_valid_date],
                is_email_required: [x.is_email_required],
                is_phone_required: [x.is_phone_required]
            }, { updateOn: 'blur' });
        }
    };
    TravelerFormComponent.prototype.submit = function (value) {
    };
    /**
     *
     * @param type ['adult','child','infant']
     */
    TravelerFormComponent.prototype.selectTravelerType = function (type, traveler_number) {
        this.travelers["type" + this.cartNumber].adults[traveler_number] = {};
        this.travelers["type" + this.cartNumber].adults[traveler_number].type = type;
        this.travelers["type" + this.cartNumber].adults[traveler_number].dobMinDate = traveller_helper_1.travelersFileds.flight[type].dobMinDate;
        this.travelers["type" + this.cartNumber].adults[traveler_number].dobMaxDate = traveller_helper_1.travelersFileds.flight[type].dobMaxDate;
        this.travelers["type" + this.cartNumber].adults[traveler_number].country_code = traveller_helper_1.travelersFileds.flight[type].country_code;
        this.travelers["type" + this.cartNumber].adults[traveler_number].passport_number = traveller_helper_1.travelersFileds.flight[type].passport_number;
        this.travelers["type" + this.cartNumber].adults[traveler_number].passport_expiry = traveller_helper_1.travelersFileds.flight[type].passport_expiry;
        this.patch();
    };
    TravelerFormComponent.prototype.selectTravelerNumber = function (event, cartNumber, traveler_number) {
        this.traveler_number = traveler_number;
        var userId = this.travelers["type" + cartNumber].adults[traveler_number].userId;
        $(document).on("click", ".card-header", function () {
            if ($(this).find('.card-link').hasClass('collapsed')) {
                $(this).find('.traveler_drop_down').addClass('hide_section');
                $(this).find('.trv_name').removeClass('hide_section');
                if (userId != "") {
                    $(this).find('.mob_names').addClass('hide_section');
                }
            }
            else {
                $(this).find('.trv_name').addClass('hide_section');
                $(this).find('.traveler_drop_down').removeClass('hide_section');
                if (userId != "") {
                    $(this).find('.mob_names').removeClass('hide_section');
                }
            }
        });
    };
    TravelerFormComponent.prototype.formatBaggageDescription = function (cabbinBaggage, checkInBaggage) {
        var cabbinBaggageWight;
        var checkInBaggageWight;
        var description = '';
        if (cabbinBaggage != "" && cabbinBaggage.includes("KG") == true) {
            cabbinBaggageWight = this.convertKgToLB(cabbinBaggage.replace("KG", ""));
            description = "Cabin bag upto " + cabbinBaggageWight + " lbs (" + cabbinBaggage + ")";
        }
        else if (cabbinBaggage != '') {
            description = "Cabin bag upto " + cabbinBaggage;
        }
        if (checkInBaggage != "" && checkInBaggage.includes("KG") == true) {
            checkInBaggageWight = this.convertKgToLB(checkInBaggage.replace("KG", ""));
            if (description != '') {
                description += " and checkin bag upto " + checkInBaggageWight + " lbs (" + checkInBaggage + ")";
            }
            else {
                description += "checkin bag upto " + checkInBaggageWight + " lbs (" + checkInBaggage + ")";
            }
        }
        else if (checkInBaggage != '') {
            if (description != '') {
                description += " and checkin bag upto " + checkInBaggage;
            }
            else {
                description += "checkin bag upto " + checkInBaggage;
            }
        }
        return description;
    };
    TravelerFormComponent.prototype.convertKgToLB = function (weight) {
        return (2.20462 * Number(weight)).toFixed(2);
    };
    TravelerFormComponent.prototype.saveTraveler = function (cartNumber, traveler_number) {
        var _this = this;
        this.travelers["type" + cartNumber].adults[traveler_number].is_submitted = true;
        //console.log(this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.email.validator({} as AbstractControl),"save")
        //return false;
        this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].markAllAsTouched();
        if (this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].status == 'VALID') {
            var data = this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value;
            if (this.cartItem.type == 'hotel') {
                data.is_primary_traveler = traveler_number == 0 ? true : false;
                data.module_id = 3;
                delete data.country_id;
                delete data.dob;
            }
            else {
                data.dob = moment(this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value.dob, "MM/DD/YYYY").format("YYYY-MM-DD");
            }
            if (this.travelers["type" + cartNumber].adults[traveler_number].is_passport_required) {
                data.passport_number = this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value.passport_number;
                data.passport_expiry = moment(this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value.passport_expiry).format("YYYY-MM-DD");
            }
            this.cartService.setLoaderStatus(true);
            var userId = this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value.userId;
            if (userId) {
                if (traveler_number == 0 && this.accountHolderEmail) {
                    data.email = this.accountHolderEmail;
                }
                //Edit
                this.travelerService.updateAdult(data, userId).subscribe(function (traveler) {
                    _this.travelers["type" + cartNumber].adults[traveler_number].is_submitted = false;
                    _this.cartService.setLoaderStatus(false);
                    var index = _this.myTravelers.findIndex(function (x) { return x.userId == traveler.userId; });
                    _this.myTravelers[index] = traveler;
                    //this.checkOutService.setTravelers([this.myTravelers]);
                    _this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].markAsUntouched();
                    _this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].disable();
                });
            }
            else {
                this.travelerService.addAdult(data).subscribe(function (traveler) {
                    _this.travelers["type" + cartNumber].adults[traveler_number].is_submitted = false;
                    _this.cartService.setLoaderStatus(false);
                    if (traveler) {
                        _this.travelers["type" + cartNumber].adults[traveler_number].type = traveler.user_type;
                        _this.travelers["type" + cartNumber].adults[traveler_number].userId = traveler.userId;
                        _this.travelers["type" + cartNumber].adults[traveler_number].first_name = traveler.firstName;
                        _this.travelers["type" + cartNumber].adults[traveler_number].last_name = traveler.lastName;
                        _this.travelers["type" + cartNumber].adults[traveler_number].gender = traveler.gender;
                        _this.travelers["type" + cartNumber].adults[traveler_number].email = traveler.email;
                        _this.travelers["type" + cartNumber].adults[traveler_number].country_code = traveler.countryCode;
                        _this.travelers["type" + cartNumber].adults[traveler_number].phone_no = traveler.phoneNo;
                        _this.travelers["type" + cartNumber].adults[traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
                        _this.travelers["type" + cartNumber].adults[traveler_number].dob = moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY');
                        if (_this.travelers["type" + cartNumber].adults[traveler_number].is_passport_required) {
                            _this.travelers["type" + cartNumber].adults[traveler_number].passport_number = traveler.passportNumber;
                            _this.travelers["type" + cartNumber].adults[traveler_number].passport_expiry = moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy');
                        }
                        _this.travelers["type" + cartNumber].adults[traveler_number].module = _this.cartItem.type;
                        if ((_this.cartItem.type == 'flight' && traveler.user_type == 'adult') || (_this.cartItem.type == 'hotel' && traveler_number == 0)) {
                            _this.travelers["type" + cartNumber].adults[traveler_number].is_email_required = true;
                            _this.travelers["type" + cartNumber].adults[traveler_number].is_phone_required = true;
                        }
                        else {
                            _this.travelers["type" + cartNumber].adults[traveler_number].is_email_required = false;
                            _this.travelers["type" + cartNumber].adults[traveler_number].is_phone_required = false;
                        }
                        if (traveler.user_type == 'adult') {
                            _this.isAdultTravller = true;
                        }
                        if (traveler.user_type == 'child') {
                            _this.isChildTravller = true;
                        }
                        if (traveler.user_type == 'infant') {
                            _this.isInfantTravller = true;
                        }
                        _this.checkOutService.setTravelers(__spreadArrays(_this.myTravelers, [traveler]));
                        console.log("llll", _this.travelers);
                        _this.patch();
                        _this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].markAsUntouched();
                        _this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].disable();
                    }
                }, function (error) {
                    _this.cartService.setLoaderStatus(false);
                    if (error.status == 409) {
                    }
                });
            }
        }
    };
    TravelerFormComponent.prototype.deleteTraveler = function (cartNumber, traveler_number) {
        //let traveler = { traveler_number: traveler_number };
        this.travelers["type" + cartNumber].adults[traveler_number].first_name = "";
        this.travelers["type" + cartNumber].adults[traveler_number].last_name = "";
        if (this.accountHolderEmail == '' || traveler_number != 0) {
            this.travelers["type" + cartNumber].adults[traveler_number].email = "";
        }
        this.travelers["type" + cartNumber].adults[traveler_number].userId = "";
        this.travelers["type" + cartNumber].adults[traveler_number].gender = "";
        this.travelers["type" + cartNumber].adults[traveler_number].phone_no = "";
        this.travelers["type" + cartNumber].adults[traveler_number].country_code = '+1';
        this.travelers["type" + cartNumber].adults[traveler_number].country_id = '';
        this.travelers["type" + cartNumber].adults[traveler_number].dob = '';
        this.setPhoneNumberFormat('+1', cartNumber, traveler_number);
        if (this.travelers["type" + cartNumber].adults[traveler_number].is_passport_required) {
            this.travelers["type" + cartNumber].adults[traveler_number].passport_number = "";
            this.travelers["type" + cartNumber].adults[traveler_number].passport_expiry = '';
        }
        this.patch();
        this.checkOutService.emitTravelersformData(this.travelerForm);
    };
    TravelerFormComponent.prototype.editTravelerNotinUse = function (cartNumber, traveler_number) {
        var _this = this;
        this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].markAllAsTouched();
        if (this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].status == 'VALID') {
            this.cartService.setLoaderStatus(true);
            var data = this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value;
            data.dob = moment(this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value.dob, "MM/DD/YYYY").format("YYYY-MM-DD");
            data.passport_number = this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value.passport_number;
            data.passport_expiry = moment(this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value.passport_expiry).format("YYYY-MM-DD");
            var userId = this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value.userId;
            if (userId) {
                //Edit
                this.travelerService.updateAdult(data, userId).subscribe(function (traveler) {
                    _this.cartService.setLoaderStatus(false);
                    var index = _this.myTravelers.findIndex(function (x) { return x.userId == traveler.userId; });
                    _this.myTravelers[index] = traveler;
                });
            }
            this.checkOutService.emitTravelersformData(this.travelerForm);
        }
    };
    TravelerFormComponent.prototype.editTraveler = function (cartNumber, traveler_number) {
        this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].enable();
        this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].markAsTouched();
    };
    TravelerFormComponent.prototype.selectTraveler = function (travlerId, traveler_number, cartNumber) {
        var traveler = this.myTravelers.find(function (x) { return x.userId == travlerId; });
        if (traveler && Object.keys(traveler).length > 0) {
            console.log(cartNumber, traveler_number);
            //this.travelers[`type${cartNumber}`].adults[traveler_number].module = traveler.module;
            this.travelers["type" + cartNumber].adults[traveler_number].first_name = traveler.firstName;
            this.travelers["type" + cartNumber].adults[traveler_number].last_name = traveler.lastName;
            this.travelers["type" + cartNumber].adults[traveler_number].email = (this.accountHolderEmail && traveler_number == 0) ? this.accountHolderEmail : traveler.email;
            this.travelers["type" + cartNumber].adults[traveler_number].userId = traveler.userId;
            this.travelers["type" + cartNumber].adults[traveler_number].gender = traveler.gender;
            this.travelers["type" + cartNumber].adults[traveler_number].phone_no = traveler.phoneNo;
            this.travelers["type" + cartNumber].adults[traveler_number].country_code = traveler.countryCode || '+1';
            this.travelers["type" + cartNumber].adults[traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
            this.travelers["type" + cartNumber].adults[traveler_number].dob = traveler.dob ? moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY') : '';
            this.travelers["type" + cartNumber].adults[traveler_number].module = this.cartItem.type;
            if ((this.cartItem.type == 'flight' && traveler.user_type == 'adult') || (this.cartItem.type == 'hotel' && traveler_number == 0)) {
                this.travelers["type" + cartNumber].adults[traveler_number].is_email_required = true;
                this.travelers["type" + cartNumber].adults[traveler_number].is_phone_required = true;
            }
            else {
                this.travelers["type" + cartNumber].adults[traveler_number].is_email_required = false;
                this.travelers["type" + cartNumber].adults[traveler_number].is_phone_required = false;
            }
            if (this.travelers["type" + cartNumber].adults[traveler_number].is_passport_required) {
                this.travelers["type" + cartNumber].adults[traveler_number].passport_number = traveler.passportNumber;
                this.travelers["type" + cartNumber].adults[traveler_number].passport_expiry = traveler.passportExpiry && traveler.passportExpiry != 'Invalid date' ? "" + moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy') : '';
            }
            //return false;
            this.patch();
            //this.setPhoneNumberFormat(this.travelers[`type${this.cartNumber}`].adults[traveler_number].country_code,cartNumber,traveler_number)
        }
        this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].disable();
        this.checkOutService.emitTravelersformData(this.travelerForm);
        this.cd.detectChanges();
    };
    TravelerFormComponent.prototype.checkMaximumMinimum = function (event, dobValue, cartNumber, traveler_number) {
        // CHECK MAXIMUM OR MINIMUM DATE OF BIRTH
        var traveler = this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].value;
        if (moment(dobValue)
            .isAfter(moment(this.travelers["type" + cartNumber].adults[traveler_number].dobMinDate).format('MM/DD/YYYY')) &&
            moment(moment(this.travelers["type" + cartNumber].adults[traveler_number].dobMaxDate).format('MM/DD/YYYY'))
                .isBefore(dobValue)) {
            this.travelers["type" + cartNumber].adults[traveler_number].is_valid_date = false;
        }
        else {
            this.travelers["type" + cartNumber].adults[traveler_number].is_valid_date = true;
        }
        this.travelers["type" + cartNumber].adults[traveler_number].first_name = traveler.first_name;
        this.travelers["type" + cartNumber].adults[traveler_number].last_name = traveler.last_name;
        this.travelers["type" + cartNumber].adults[traveler_number].email = traveler.email;
        this.travelers["type" + cartNumber].adults[traveler_number].userId = traveler.userId;
        this.travelers["type" + cartNumber].adults[traveler_number].gender = traveler.gender;
        this.travelers["type" + cartNumber].adults[traveler_number].phone_no = traveler.phone_no;
        this.travelers["type" + cartNumber].adults[traveler_number].country_code = traveler.country_code || '+1';
        this.travelers["type" + cartNumber].adults[traveler_number].country_id = traveler.country_id != null ? traveler.country_id : '';
        this.travelers["type" + cartNumber].adults[traveler_number].dob = dobValue;
        if (this.travelers["type" + cartNumber].adults[traveler_number].is_passport_required) {
            this.travelers["type" + cartNumber].adults[traveler_number].passport_number = traveler.passport_number;
            this.travelers["type" + cartNumber].adults[traveler_number].passport_expiry = traveler.passport_expiry ? "" + moment(traveler.passport_expiry, "YYYY-MM-DD").format('MMM DD, yy') : '';
        }
        this.patch();
        this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].controls.dob.markAsTouched();
    };
    TravelerFormComponent.prototype.validateCountryWithPhoneNumber = function (event, cartNumber, traveler_number) {
        //console.log(this.travelerForm.controls[`type${cartNumber}`]['controls'].adults.controls[traveler_number].controls.phone_no,"======")
        this.setPhoneNumberFormat(event.phonecode, cartNumber, traveler_number);
    };
    TravelerFormComponent.prototype.setPhoneNumberFormat = function (phonecode, cartNumber, traveler_number) {
        if (this.travelers["type" + cartNumber].adults[traveler_number].type == 'adult') {
            var phoneFormat = phone_masking_helper_1.getPhoneFormat(phonecode);
            this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].controls.phone_no.setValidators([forms_1.Validators.minLength(phoneFormat.length)]);
            this.travelerForm.controls["type" + cartNumber]['controls'].adults.controls[traveler_number].controls.phone_no.updateValueAndValidity();
            this.travelers["type" + cartNumber].adults[traveler_number].phone_no_format = phoneFormat.format;
            this.travelers["type" + cartNumber].adults[traveler_number].phone_no_length = phoneFormat.length;
        }
    };
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "totalTraveler");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "cartNumber");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "cartId");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "cartItem");
    TravelerFormComponent = __decorate([
        core_1.Component({
            selector: 'app-traveler-form',
            templateUrl: './traveler-form.component.html',
            styleUrls: ['./traveler-form.component.scss'],
            providers: [
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: ngbDateCustomParserFormatter_1.NgbDateCustomParserFormatter }
            ]
        })
    ], TravelerFormComponent);
    return TravelerFormComponent;
}());
exports.TravelerFormComponent = TravelerFormComponent;
