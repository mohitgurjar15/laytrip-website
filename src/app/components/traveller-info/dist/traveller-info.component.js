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
    function TravellerInfoComponent(route, commonFunction, eRef) {
        this.route = route;
        this.commonFunction = commonFunction;
        this.eRef = eRef;
        this.changeValue = new core_1.EventEmitter();
        this.currentChangeCounter = new core_1.EventEmitter();
        this.adultValue = 1;
        this.childValue = 0;
        this.infantValue = 0;
        this.totalPerson = 1;
        this.travelerLabel = 'Traveler';
        this["class"] = 'Economy';
        this.errorMessage = '';
        this.showTraveller = false;
        this.counterChangeVal = 0;
        this.travellerInfo = {
            adult: 0,
            child: 0,
            infant: 0,
            "class": 'Economy',
            totalPerson: 0
        };
        this.toggle = 0;
        this.adultValue = parseInt(this.route.snapshot.queryParams['adult']) ? parseInt(this.route.snapshot.queryParams['adult']) : 1;
        this.childValue = parseInt(this.route.snapshot.queryParams['child']) ? parseInt(this.route.snapshot.queryParams['child']) : 0;
        this.infantValue = parseInt(this.route.snapshot.queryParams['infant']) ? parseInt(this.route.snapshot.queryParams['infant']) : 0;
        this.totalPerson = this.adultValue + this.childValue + this.infantValue;
        this["class"] = this.route.snapshot.queryParams['class'] ? this.route.snapshot.queryParams['class'] : 'Economy';
        this.countryCode = this.commonFunction.getUserCountry();
    }
    TravellerInfoComponent.prototype.ngOnInit = function () {
        this.totalPerson = this.adultValue + this.childValue + this.infantValue;
        this.travelerLabel = this.totalPerson > 1 ? 'Travelers' : 'Traveler';
    };
    TravellerInfoComponent.prototype.clickout = function (event) {
        if (this.eRef.nativeElement.contains(event.target)) {
            $(".add_class_sec_open_").hide();
        }
        else {
            this.showTraveller = false;
        }
    };
    TravellerInfoComponent.prototype.toggleTraveller = function () {
        var _this = this;
        $(".add_class_sec_open_").hide();
        this.showTraveller = !this.showTraveller;
        if (this.commonFunction.isRefferal()) {
            this.progressInterval = setInterval(function () {
                if (_this.showTraveller) {
                    _this.currentChangeCounter.emit(_this.counterChangeVal += 1);
                }
                else {
                    clearInterval(_this.progressInterval);
                }
            }, 1000);
        }
    };
    TravellerInfoComponent.prototype.btnClickForChange = function (item) {
        // FOR ADULT
        if (item && item.type === 'minus' && item.label === 'adult') {
            if (this.adultValue === this.infantValue) {
                this.infantValue = this.infantValue - 1;
            }
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
        this.travelerLabel = this.totalPerson > 1 ? 'Travelers' : 'Traveler';
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
        core_1.Output()
    ], TravellerInfoComponent.prototype, "currentChangeCounter");
    __decorate([
        core_1.Input()
    ], TravellerInfoComponent.prototype, "label");
    __decorate([
        core_1.Input()
    ], TravellerInfoComponent.prototype, "domid");
    __decorate([
        core_1.HostListener('document:click', ['$event'])
    ], TravellerInfoComponent.prototype, "clickout");
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
