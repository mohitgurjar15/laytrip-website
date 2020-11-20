"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GenericService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var GenericService = /** @class */ (function () {
    function GenericService(http, commonFunction) {
        this.http = http;
        this.commonFunction = commonFunction;
    }
    GenericService.prototype.getAllLangunage = function () {
        return this.http.get(environment_1.environment.apiUrl + "v1/language")
            .pipe(operators_1.catchError(this.handleError));
    };
    GenericService.prototype.getCurrencies = function () {
        return this.http.get(environment_1.environment.apiUrl + "v1/currency")
            .pipe(operators_1.catchError(this.handleError));
    };
    GenericService.prototype.getModules = function () {
        return this.http.get(environment_1.environment.apiUrl + "v1/modules")
            .pipe(operators_1.catchError(this.handleError));
    };
    GenericService.prototype.saveCard = function (cardData) {
        return this.http.post(environment_1.environment.apiUrl + "v1/payment/add-card", cardData, this.commonFunction.setHeaders())
            .pipe(operators_1.catchError(this.handleError));
    };
    GenericService.prototype.getCardlist = function () {
        return this.http.get(environment_1.environment.apiUrl + "v1/payment", this.commonFunction.setHeaders())
            .pipe(operators_1.catchError(this.handleError));
    };
    GenericService.prototype.getInstalemnts = function (data) {
        return this.http.post(environment_1.environment.apiUrl + "v1/instalment/calculate-instalment", data)
            .pipe(operators_1.catchError(this.handleError));
    };
    GenericService.prototype.getInstalemntsAvailability = function (data) {
        return this.http.post(environment_1.environment.apiUrl + "v1/instalment/instalment-availability", data)
            .pipe(operators_1.catchError(this.handleError));
    };
    GenericService.prototype.handleError = function (error) {
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
    GenericService.prototype.getCountry = function () {
        return this.http.get(environment_1.environment.apiUrl + 'v1/generic/country', this.commonFunction.setHeaders());
    };
    GenericService.prototype.getState = function (stateId) {
        return this.http.get(environment_1.environment.apiUrl + 'v1/generic/state/' + stateId, this.commonFunction.setHeaders());
    };
    GenericService.prototype.getStates = function (countryId) {
        return this.http.get(environment_1.environment.apiUrl + 'v1/generic/country/' + countryId + '/state', this.commonFunction.setHeaders());
    };
    GenericService.prototype.getAvailableLaycredit = function () {
        return this.http.get(environment_1.environment.apiUrl + 'v1/laytrip-point/total-available-points/', this.commonFunction.setHeaders());
    };
    GenericService.prototype.createEnquiry = function (data) {
        return this.http.post(environment_1.environment.apiUrl + "v1/enqiry", data)
            .pipe(operators_1.catchError(this.handleError));
    };
    GenericService.prototype.getCmsByPageType = function (type) {
        var payload = { page_type: type };
        return this.http.get(environment_1.environment.apiUrl + 'v1/cms/' + payload.page_type, this.commonFunction.setHeaders());
    };
    GenericService.prototype.getUserLocationInfo = function () {
        return this.http.get(environment_1.environment.apiUrl + 'v1/generic/location/');
    };
    GenericService.prototype.getFaqData = function () {
        return this.http.get(environment_1.environment.apiUrl + 'v1/faq');
    };
    GenericService.prototype.checkUserValidate = function (token) {
        return this.http.get(environment_1.environment.apiUrl + 'v1/auth/validate-user/' + token);
    };
    GenericService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], GenericService);
    return GenericService;
}());
exports.GenericService = GenericService;
