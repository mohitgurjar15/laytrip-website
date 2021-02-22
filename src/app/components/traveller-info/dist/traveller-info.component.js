"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TravellerInfoComponent = void 0;
var core_1 = require("@angular/core");
var TravellerInfoComponent = /** @class */ (function () {
    function TravellerInfoComponent(route, commonFunction) {
        this.route = route;
        this.commonFunction = commonFunction;
        this.changeValue = new core_1.EventEmitter();
        this.adultValue = 1;
        this.childValue = 0;
        this.infantValue = 0;
        this.totalPerson = 1;
        this["class"] = 'Economy';
        this.errorMessage = '';
        this.showTraveller = false;
        this.travellerInfo = {
            adult: 0,
            child: 0,
            infant: 0,
            "class": 'Economy',
            totalPerson: 0
        };
        this.adultValue = parseInt(this.route.snapshot.queryParams['adult']) ? parseInt(this.route.snapshot.queryParams['adult']) : 1;
        this.childValue = parseInt(this.route.snapshot.queryParams['child']) ? parseInt(this.route.snapshot.queryParams['child']) : 0;
        this.infantValue = parseInt(this.route.snapshot.queryParams['infant']) ? parseInt(this.route.snapshot.queryParams['infant']) : 0;
        this.totalPerson = this.adultValue + this.childValue + this.infantValue;
        this["class"] = this.route.snapshot.queryParams['class'] ? this.route.snapshot.queryParams['class'] : 'Economy';
        this.countryCode = this.commonFunction.getUserCountry();
    }
    TravellerInfoComponent.prototype.ngOnInit = function () {
        this.loadJquery();
    };
    TravellerInfoComponent.prototype.loadJquery = function () {
        $("body").click(function () {
            $(".add_traveler__open").hide();
        });
        $(".add_traveler_").click(function (e) {
            e.stopPropagation();
            // $(".add_traveler__open").slideToggle("slow");
            $(".add_traveler__open").show();
            $(".add_class_sec_open_").hide();
        });
        $('.add_traveler__open').click(function (e) {
            e.stopPropagation();
        });
    };
    TravellerInfoComponent.prototype.toggleTraveller = function () {
        this.showTraveller = !this.showTraveller;
    };
    TravellerInfoComponent.prototype.btnClickForChange = function (item) {
        // FOR ADULT
        if (item && item.type === 'minus' && item.label === 'adult') {
            if (this.adultValue - 1 < this.infantValue) {
                this.errorMessage = "Infant count should be less than Adults.";
                return false;
            }
            else {
                this.errorMessage = '';
            }
            this.adultValue = this.adultValue - 1;
        }
        else if (item && item.type === 'plus' && item.label === 'adult') {
            if (this.adultValue + 1 + this.childValue > 9) {
                this.errorMessage = "Maximum number of passengers all together should not exceed 9 except infants.";
                return;
            }
            else {
                this.errorMessage = '';
            }
            this.adultValue = this.adultValue + 1;
        }
        // FOR CHILD
        if (item && item.type === 'minus' && item.label === 'child') {
            if (this.adultValue + this.childValue - 1 < 9) {
                this.errorMessage = '';
            }
            else {
                this.errorMessage = "Maximum number of passengers all together should not exceed 9 except infants.";
                return;
            }
            this.childValue = this.childValue - 1;
        }
        else if (item && item.type === 'plus' && item.label === 'child') {
            if (this.adultValue + this.childValue + 1 > 9) {
                this.errorMessage = "Maximum number of passengers all together should not exceed 9 except infants.";
                return;
            }
            else {
                this.errorMessage = '';
            }
            this.childValue = this.childValue + 1;
        }
        // FOR INFANT
        if (item && item.type === 'minus' && item.label === 'infant') {
            this.infantValue = this.infantValue - 1;
            if (this.infantValue < this.adultValue) {
                this.errorMessage = '';
            }
        }
        else if (item && item.type === 'plus' && item.label === 'infant') {
            if (this.infantValue + 1 > this.adultValue) {
                this.errorMessage = "Infant count should be less than Adults.";
                return false;
            }
            else {
                this.errorMessage = '';
            }
            this.infantValue = this.infantValue + 1;
        }
        this.totalPerson = this.adultValue + this.childValue + this.infantValue;
        if (item && item.type === 'class' && item.value) {
            this.travellerInfo["class"] = item.value;
            this["class"] = item.value;
        }
        this.travellerInfo = {
            adult: this.adultValue,
            child: this.childValue,
            infant: this.infantValue,
            "class": this.travellerInfo["class"],
            totalPerson: this.totalPerson
        };
        this.changeValue.emit(this.travellerInfo);
    };
    __decorate([
        core_1.Output()
    ], TravellerInfoComponent.prototype, "changeValue");
    __decorate([
        core_1.Input()
    ], TravellerInfoComponent.prototype, "label");
    __decorate([
        core_1.Input()
    ], TravellerInfoComponent.prototype, "domid");
    TravellerInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-traveller-info',
            templateUrl: './traveller-info.component.html',
            styleUrls: ['./traveller-info.component.scss']
        })
    ], TravellerInfoComponent);
    return TravellerInfoComponent;
}());
exports.TravellerInfoComponent = TravellerInfoComponent;
