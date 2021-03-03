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
            }
        };
        this.dobMinDate = new Date();
        this.baggageDescription = '';
        this.passPortMinDate = new Date();
    }
    TravelerFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.bsConfig = Object.assign({}, { dateInputFormat: 'MM/DD/YYYY', containerClass: 'theme-default', showWeekNumbers: false, adaptivePosition: true });
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
            })
        });
        this.checkOutService.getTravelers.subscribe(function (travelers) {
            _this.myTravelers = travelers;
        });
        this.cartService.getCartTravelers.subscribe(function (travelers) {
            _this.travelers = travelers;
        });
        for (var i = 0; i < this.cartItem.module_info.adult_count; i++) {
            this.travelers["type" + this.cartNumber].cartId = this.cartId;
            this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.flight.adult));
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
            this.cd.detectChanges();
        }
        for (var i = 0; i < this.cartItem.module_info.infant_count; i++) {
            this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.flight.infant));
            this.travelers["type" + this.cartNumber].infant = this.cartItem.module_info.infant_count;
            this.cd.detectChanges();
        }
        if (this.travelers && this.travelers["type" + this.cartNumber] && this.travelers["type" + this.cartNumber].adults) {
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
                    this_1.travelers["type" + this_1.cartNumber].adults[i].passport_expiry = traveler.passportExpiry ? moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy') : '';
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.cartItem.travelers.length; i++) {
                _loop_1(i);
            }
            this.patch();
            this.cartService.setCartTravelers(this.travelers);
            this.cd.detectChanges();
        }
        this.travelerForm.valueChanges.subscribe(function (value) {
            if (typeof _this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number] !== 'undefined') {
                if (_this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].status == 'VALID') {
                    var data = _this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].value;
                    data.dob = moment(_this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].value.dob).format("YYYY-MM-DD");
                    data.passport_number = _this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].value.passport_number;
                    data.passport_expiry = moment(_this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].value.passport_expiry).format("YYYY-MM-DD");
                    var userId = _this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].value.userId;
                    if (userId) {
                        //Edit
                        _this.travelerService.updateAdult(data, userId).subscribe(function (traveler) {
                            var index = _this.myTravelers.findIndex(function (x) { return x.userId == traveler.userId; });
                            _this.myTravelers[index] = traveler;
                            /* for (let i = 0; i < 5; i++) {
                              for (let j = 0; j < this.travelers[`type${i}`].adults.length; j++) {
              
                                if(typeof this.travelers[`type${i}`].adults[j]!=='undefined' && this.travelers[`type${i}`].adults[j].length>0){
                                  console.log(this.travelers[`type${i}`].adults[j],j,"this.travelers[`type${i}`].")
                                  index = this.travelers[`type${i}`].adults[j].findIndex(x => x.userId == traveler.userId);
                                  if (index > -1) {
                                    this.travelers[`type${i}`].adults[j] = traveler;
                                  }
                                }
                              }
                            } */
                            //this.patch()
                        });
                    }
                    else {
                        //Add
                        _this.travelerService.addAdult(data).subscribe(function (traveler) {
                            if (traveler) {
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].type = traveler.user_type;
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].userId = traveler.userId;
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].first_name = traveler.firstName;
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].last_name = traveler.lastName;
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].gender = traveler.gender;
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].email = traveler.email;
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].country_code = traveler.countryCode;
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].phone_no = traveler.phoneNo;
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
                                _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].dob = moment(traveler.dob, "YYYY-MM-DD").format('MM/DD/YYYY');
                                if (_this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].is_passport_required) {
                                    _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].passport_number = traveler.passportNumber;
                                    _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].passport_expiry = moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy');
                                }
                                _this.checkOutService.setTravelers(__spreadArrays(_this.myTravelers, [traveler]));
                                _this.patch();
                            }
                        }, function (error) {
                        });
                    }
                }
            }
            _this.checkOutService.emitTravelersformData(_this.travelerForm);
        });
        this.cartService.getSelectedCart.subscribe(function (cartNumber) {
            _this.cartNumber = cartNumber;
        });
        this.checkOutService.getTraveler.subscribe(function (traveler) {
            if (traveler && Object.keys(traveler).length > 0) {
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].first_name = traveler.firstName;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].last_name = traveler.lastName;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].email = traveler.email;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].userId = traveler.userId;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].gender = traveler.gender;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].phone_no = traveler.phoneNo;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].country_code = traveler.countryCode;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].dob = traveler.dob ? moment(traveler.dob, "YYYY-MM-DD").format('MMM DD, yy') : '';
                if (_this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].is_passport_required) {
                    _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].passport_number = traveler.passportNumber;
                    _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].passport_expiry = traveler.passportExpiry ? moment(traveler.passportExpiry, "YYYY-MM-DD").format('MMM DD, yy') : '';
                }
                _this.patch();
            }
        });
        this.checkOutService.emitTravelersformData(this.travelerForm);
        this.baggageDescription = this.formatBaggageDescription(this.cartItem.module_info.routes[0].stops[0].cabin_baggage, this.cartItem.module_info.routes[0].stops[0].checkin_baggage);
    };
    TravelerFormComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        this.checkOutService.getCountries.subscribe(function (res) {
            _this.countries = res;
        });
    };
    TravelerFormComponent.prototype.patch = function () {
        var _this = this;
        var _loop_2 = function (i) {
            //this.travelerForm.controls[`type${i}`]['controls'].cartId.setValue(this.travelers[`type${i}`].cartId);
            var control = this_2.travelerForm.get("type" + i + ".adults");
            control.controls = [];
            this_2.travelers["type" + i].adults.forEach(function (x, i) {
                control.push(_this.patchValues(x));
            });
        };
        var this_2 = this;
        for (var i = 0; i < Object.keys(this.travelers).length; i++) {
            _loop_2(i);
        }
    };
    TravelerFormComponent.prototype.patchValues = function (x) {
        return this.formBuilder.group({
            first_name: [x.first_name, [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]$')]],
            last_name: [x.last_name, [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z]+[a-zA-Z]$')]],
            email: (x.type === 'adult' || x.type === '') ? [x.email, [forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]] : [x.email],
            phone_no: (x.type === 'adult' || x.type === '') ? [x.phone_no, [forms_1.Validators.required, forms_1.Validators.minLength(10)]] : [x.phone_no],
            country_code: (x.type === 'adult' || x.type === '') ? [x.country_code, [forms_1.Validators.required]] : [x.country_code],
            passport_number: (x.is_passport_required) ? [x.passport_number, [forms_1.Validators.required]] : [x.passport_number],
            passport_expiry: (x.is_passport_required) ? [x.passport_expiry, [forms_1.Validators.required]] : [x.passport_expiry],
            is_passport_required: [x.is_passport_required, [forms_1.Validators.required]],
            dob: [x.dob, [forms_1.Validators.required]],
            country_id: [x.country_id, [forms_1.Validators.required]],
            gender: [x.gender, [forms_1.Validators.required]],
            userId: [x.userId],
            type: [x.type],
            dobMinDate: [x.dobMinDate],
            dobMaxDate: [x.dobMaxDate]
        }, { updateOn: 'blur' });
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
        // this.travelers[`type${this.cartNumber}`].adults[traveler_number].is_passport_required = travelersFileds.flight[type].is_passport_required;
        this.patch();
    };
    TravelerFormComponent.prototype.selectTravelerNumber = function (event, traveler_number) {
        this.traveler_number = traveler_number;
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
