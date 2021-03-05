"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CheckOutService = exports.Events = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var Events;
(function (Events) {
    Events[Events["select_traveler"] = 0] = "select_traveler";
})(Events = exports.Events || (exports.Events = {}));
var CheckOutService = /** @class */ (function () {
    function CheckOutService() {
        this.traveler = new rxjs_1.BehaviorSubject({});
        this.getTraveler = this.traveler.asObservable();
        this.traveler_number = new rxjs_1.BehaviorSubject(0);
        this.getTravelerNumber = this.traveler_number.asObservable();
        this.travelers = new rxjs_1.BehaviorSubject([]);
        this.getTravelers = this.travelers.asObservable();
        this.travelerFormData = new rxjs_1.BehaviorSubject([]);
        this.getTravelerFormData = this.travelerFormData.asObservable();
        this.countires = new rxjs_1.BehaviorSubject([]);
        this.getCountries = this.countires.asObservable();
        this.priceSummary = new rxjs_1.BehaviorSubject({});
        this.getPriceSummary = this.priceSummary.asObservable();
    }
    CheckOutService.prototype.selectTraveler = function (traveler) {
        this.traveler.next(traveler);
    };
    CheckOutService.prototype.selectTravelerNumber = function (traveler_number) {
        this.traveler_number.next(traveler_number);
    };
    CheckOutService.prototype.setTravelers = function (travelers) {
        this.travelers.next(travelers);
    };
    CheckOutService.prototype.emitTravelersformData = function (travelers) {
        this.travelerFormData.next(travelers);
    };
    CheckOutService.prototype.setCountries = function (countires) {
        this.countires.next(countires);
    };
    CheckOutService.prototype.setPriceSummary = function (priceSummary) {
        this.priceSummary.next(priceSummary);
    };
    CheckOutService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CheckOutService);
    return CheckOutService;
}());
exports.CheckOutService = CheckOutService;
