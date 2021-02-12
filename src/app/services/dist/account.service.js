"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AccountService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var environment_1 = require("../../environments/environment");
var rxjs_1 = require("rxjs");
var AccountService = /** @class */ (function () {
    function AccountService(http, commonFunction) {
        this.http = http;
        this.commonFunction = commonFunction;
    }
    AccountService.prototype.handleError = function (error) {
        var errorMessage = {};
        if (error.status == 0) {
            console.log("API Server is not responding");
        }
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = { message: error.error.message };
        }
        else {
            // server-side error
            errorMessage = { status: error.status, message: error.error.message };
        }
        return rxjs_1.throwError(errorMessage);
    };
    AccountService.prototype.getIncomplteBooking = function (bookingId) {
        return this.http.get(environment_1.environment.apiUrl + "v1/booking/incomplete-bookings?booking_id=" + bookingId, this.commonFunction.setHeaders())
            .pipe(operators_1.catchError(this.handleError));
    };
    AccountService.prototype.getComplteBooking = function (bookingId) {
        return this.http.get(environment_1.environment.apiUrl + "v1/booking/complete-bookings?booking_id=" + bookingId, this.commonFunction.setHeaders())
            .pipe(operators_1.catchError(this.handleError));
    };
    AccountService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AccountService);
    return AccountService;
}());
exports.AccountService = AccountService;
