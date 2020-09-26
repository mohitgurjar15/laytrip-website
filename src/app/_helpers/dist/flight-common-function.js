"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightCommonFunction = void 0;
var core_1 = require("@angular/core");
var FlightCommonFunction = /** @class */ (function () {
    function FlightCommonFunction(commonFunction) {
        this.commonFunction = commonFunction;
    }
    FlightCommonFunction.prototype.getPaymentStartDate = function (bookingInstalments) {
        if (bookingInstalments[1]) {
            return this.commonFunction.convertDateFormat(bookingInstalments[1].instalmentDate, 'YYYY-MM-DD', 'en');
        }
        else {
            return this.commonFunction.convertDateFormat(bookingInstalments[0].instalmentDate, 'YYYY-MM-DD', 'en');
        }
    };
    FlightCommonFunction.prototype.getPaymentEndDate = function (bookingInstalments) {
        return this.commonFunction.convertDateFormat(bookingInstalments[bookingInstalments.length - 1].instalmentDate, 'YYYY-MM-DD', 'en');
    };
    FlightCommonFunction = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], FlightCommonFunction);
    return FlightCommonFunction;
}());
exports.FlightCommonFunction = FlightCommonFunction;
