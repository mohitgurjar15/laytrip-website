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
    function TravelerFormComponent(formBuilder, router, commonFunction, checkOutService, cartService, travelerService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.commonFunction = commonFunction;
        this.checkOutService = checkOutService;
        this.cartService = cartService;
        this.travelerService = travelerService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.traveler_number = 0;
        this.countries = [];
        this.travelers = {
            type0: {
                adults: []
            },
            type1: {
                adults: []
            },
            type2: {
                adults: []
            },
            type3: {
                adults: []
            },
            type4: {
                adults: []
            }
        };
        this.dobMinDate = new Date();
    }
    TravelerFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("this.cart", this.cartItem);
        this.checkOutService.getTravelers.subscribe(function (travelers) {
            _this.myTravelers = travelers;
        });
        /* this.cartService.getCartTravelers.subscribe((travelers:any)=>{
          this.travelers =travelers;
        }) */
        //this.travelers = travelers;
        for (var i = 0; i < this.cartItem.module_info.adult_count; i++) {
            this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.flight.adult));
            //this.cartService.setCartTravelers(this.travelers)
        }
        for (var i = 0; i < this.cartItem.module_info.child_count; i++) {
            this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.flight.child));
            //this.cartService.setCartTravelers(this.travelers)
        }
        for (var i = 0; i < this.cartItem.module_info.infant_count; i++) {
            this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.flight.infant));
        }
        console.log(this.travelers["type" + this.cartNumber].adults.length, this.cartItem);
        for (var i = 0; i < this.cartItem.travelers.length; i++) {
            //this.travelers[`type${this.cartNumber}`].adults[i].userId=this.cartItem.travelers[i].userId;
        }
        this.cartService.setCartTravelers(this.travelers);
        this.travelerForm = this.formBuilder.group({
            type0: this.formBuilder.group({
                adults: this.formBuilder.array([])
            }),
            type1: this.formBuilder.group({
                adults: this.formBuilder.array([])
            })
        });
        this.patch();
        this.travelerForm.valueChanges.subscribe(function (value) {
            if (typeof _this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number] !== 'undefined') {
                //console.log("dob",this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].value.first_name,this.travelerForm.controls[`type${this.cartNumber}`]['controls'].adults.controls[this.traveler_number].status)
                console.log("this.cartNumber", _this.cartNumber, _this.cartId);
                if (_this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].status == 'VALID') {
                    var data = _this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].value;
                    data.dob = moment(_this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].value.dob).format("YYYY-MM-DD");
                    var userId = _this.travelerForm.controls["type" + _this.cartNumber]['controls'].adults.controls[_this.traveler_number].value.userId;
                    if (userId) {
                        //Edit
                        _this.travelerService.updateAdult(data, userId).subscribe(function (traveler) {
                            /* let selectedTravelers=this.travelers[`type${this.cartNumber}`].adults.map(traveler=>{
                              if(traveler.userId){
                                return { traveler_id :  traveler.userId}
                              }
                            })
              
                            if(selectedTravelers.length){
                              let data = {
                                cart_id : this.cartItem.id,
                                travelers : selectedTravelers
                              }
                              this.updateCart(data)
                            } */
                        });
                    }
                    else {
                        //Add
                        _this.travelerService.addAdult(data).subscribe(function (traveler) {
                            _this.travelers["type" + _this.cartNumber].adults[_this.traveler_number].userId = traveler.userId;
                            console.log("New Traveler=>>>", _this.travelers);
                            _this.checkOutService.setTravelers(__spreadArrays(_this.myTravelers, [traveler]));
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
            if (Object.keys(traveler).length > 0) {
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].first_name = traveler.firstName;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].last_name = traveler.lastName;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].email = traveler.email;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].userId = traveler.userId;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].gender = traveler.gender;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].phone_no = traveler.phoneNo;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].country_code = traveler.countryCode;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].country_id = traveler.country != null ? traveler.country.id : '';
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].dob = moment(traveler.dob, "YYYY-MM-DD").format('MMM DD, yy');
                _this.patch();
            }
        });
    };
    TravelerFormComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        this.checkOutService.getCountries.subscribe(function (res) {
            _this.countries = res;
        });
    };
    TravelerFormComponent.prototype.patch = function () {
        var _this = this;
        var control = this.travelerForm.get("type" + this.cartNumber + ".adults");
        control.controls = [];
        this.travelers["type" + this.cartNumber].adults.forEach(function (x, i) {
            control.push(_this.patchValues(x));
        });
    };
    TravelerFormComponent.prototype.patchValues = function (x) {
        if (x.type == 'adult') {
            return this.formBuilder.group({
                first_name: [x.first_name, [forms_1.Validators.required]],
                last_name: [x.last_name, [forms_1.Validators.required]],
                email: [x.email, [forms_1.Validators.required]],
                phone_no: [x.phone_no, [forms_1.Validators.required]],
                country_code: [x.country_code, [forms_1.Validators.required]],
                dob: [x.dob, [forms_1.Validators.required]],
                country_id: [x.country_id, [forms_1.Validators.required]],
                gender: [x.gender, [forms_1.Validators.required]],
                userId: [x.userId],
                type: [x.type],
                dobMinDate: [x.dobMinDate],
                dobMaxDate: [x.dobMaxDate]
            }, { updateOn: 'blur' });
        }
        else {
            return this.formBuilder.group({
                first_name: [x.first_name, [forms_1.Validators.required]],
                last_name: [x.last_name, [forms_1.Validators.required]],
                dob: [x.dob, [forms_1.Validators.required]],
                country_id: [x.country_id, [forms_1.Validators.required]],
                gender: [x.gender, [forms_1.Validators.required]],
                userId: [x.userId],
                type: [x.type],
                dobMinDate: [x.dobMinDate],
                dobMaxDate: [x.dobMaxDate]
            }, { updateOn: 'blur' });
        }
    };
    TravelerFormComponent.prototype.submit = function (value) {
        //console.log(this.travelerForm.get('type.adults')['controls']);
        console.log("value", value);
    };
    TravelerFormComponent.prototype.typeOf = function (value) {
        return typeof value;
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
        this.patch();
    };
    TravelerFormComponent.prototype.selectTravelerNumber = function (event, traveler_number) {
        console.log("traveler_number", traveler_number);
        this.traveler_number = traveler_number;
    };
    TravelerFormComponent.prototype.updateCart = function (data) {
        this.cartService.updateCart(data).subscribe(function (res) {
        });
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
