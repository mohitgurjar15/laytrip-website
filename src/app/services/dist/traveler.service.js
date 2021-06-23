"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TravelerService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var TravelerService = /** @class */ (function () {
    function TravelerService(http, commonFunction, route) {
        this.http = http;
        this.commonFunction = commonFunction;
        this.route = route;
    }
    TravelerService.prototype.setHeaders = function (params) {
        if (params === void 0) { params = ''; }
        var accessToken = localStorage.getItem('_lay_sess');
        var reqData = {
            headers: {
                Authorization: "Bearer " + accessToken,
                referral_id: this.route.snapshot.queryParams['utm_source'] ? "" + this.route.snapshot.queryParams['utm_source'] : ""
            }
        };
        if (params) {
            var reqParams_1 = {};
            Object.keys(params).map(function (k) {
                reqParams_1[k] = params[k];
            });
            reqData['params'] = reqParams_1;
        }
        return reqData;
    };
    TravelerService.prototype.getTravelers = function () {
        return this.http.get(environment_1.environment.apiUrl + 'v1/traveler/list-traveler', this.setHeaders());
    };
    TravelerService.prototype.addAdult = function (data) {
        if (data.guest_id) {
            return this.http.post(environment_1.environment.apiUrl + "v1/traveler/save", data);
        }
        else {
            return this.http.post(environment_1.environment.apiUrl + "v1/traveler/save", data, this.commonFunction.setHeaders());
        }
    };
    TravelerService.prototype.updateAdult = function (data, id) {
        return this.http.put(environment_1.environment.apiUrl + "v1/traveler/" + id, data, this.commonFunction.setHeaders());
    };
    TravelerService.prototype.handleError = function (error) {
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
    TravelerService.prototype["delete"] = function (id) {
        return this.http["delete"](environment_1.environment.apiUrl + 'v1/traveler/' + id, this.setHeaders());
    };
    TravelerService.prototype.getEarnedPoint = function (pageNumber, limit) {
        return this.http.get(environment_1.environment.apiUrl + ("v1/laytrip-point/earned?limit=" + limit + "&page_no=" + pageNumber), this.setHeaders())
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    TravelerService.prototype.getRedeemedPoint = function (pageNumber, limit) {
        return this.http.get(environment_1.environment.apiUrl + ("v1/laytrip-point/redeemed?limit=" + limit + "&page_no=" + pageNumber), this.setHeaders())
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    TravelerService.prototype.getTotalAvailablePoints = function (pageNumber, limit) {
        return this.http.get(environment_1.environment.apiUrl + "v1/laytrip-point/total-available-points", this.setHeaders())
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    TravelerService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], TravelerService);
    return TravelerService;
}());
exports.TravelerService = TravelerService;
