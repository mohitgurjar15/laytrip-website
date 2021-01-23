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
var environment_1 = require("../../../environments/environment");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngbDateCustomParserFormatter_1 = require("../../_helpers/ngbDateCustomParserFormatter");
var traveller_helper_1 = require("../../_helpers/traveller.helper");
var TravelerFormComponent = /** @class */ (function () {
    function TravelerFormComponent(formBuilder, router, commonFunction, config, checkOutService, cartService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.commonFunction = commonFunction;
        this.checkOutService = checkOutService;
        this.cartService = cartService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        /* travelers = {
          type: {
            adults : []
          }
        }; */
        this.travelers = {
            type0: {
                adults: []
            },
            type1: {
                adults: []
            }
        };
    }
    TravelerFormComponent.prototype.ngOnInit = function () {
        //this.travelers[`type${this.cartNumber}`].adults=[];
        var _this = this;
        this.cartService.getCartTravelers.subscribe(function (travelers) {
            _this.travelers = travelers;
        });
        //this.travelers = travelers;
        for (var i = 0; i < this.totalTraveler.adult_count; i++) {
            //Object.assign({},this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({},travelersFileds.flight.adult)))
            this.travelers["type" + this.cartNumber].adults.push(Object.assign({}, traveller_helper_1.travelersFileds.flight.adult));
            this.cartService.setCartTravelers(this.travelers);
        }
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
            _this.checkOutService.emitTravelersformData(_this.travelerForm);
        });
        this.cartService.getSelectedCart.subscribe(function (cartNumber) {
            _this.cartNumber = cartNumber;
        });
        this.checkOutService.getTraveler.subscribe(function (traveler) {
            if (Object.keys(traveler).length > 0) {
                console.log("Current Cart", _this.cartNumber, traveler);
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].first_name = traveler.firstName;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].last_name = traveler.lastName;
                _this.travelers["type" + _this.cartNumber].adults[traveler.traveler_number].email = traveler.email;
                _this.patch();
            }
        });
    };
    /* ngOnChanges(changes: SimpleChanges) {
      
    } */
    TravelerFormComponent.prototype.patch = function () {
        var _this = this;
        var control = this.travelerForm.get("type" + this.cartNumber + ".adults");
        control.controls = [];
        this.travelers["type" + this.cartNumber].adults.forEach(function (x, i) {
            control.push(_this.patchValues(x));
        });
    };
    TravelerFormComponent.prototype.patchValues = function (x) {
        return this.formBuilder.group({
            first_name: [x.first_name, [forms_1.Validators.required]],
            last_name: [x.last_name],
            email: [x.email],
            phone_number: [x.phone_number],
            dob: [x.dob],
            country: [x.country],
            gender: [x.gender]
        });
    };
    TravelerFormComponent.prototype.submit = function (value) {
        //console.log(this.travelerForm.get('type.adults')['controls']);
        console.log("value", value);
    };
    TravelerFormComponent.prototype.typeOf = function (value) {
        return typeof value;
    };
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "totalTraveler");
    __decorate([
        core_1.Input()
    ], TravelerFormComponent.prototype, "cartNumber");
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
