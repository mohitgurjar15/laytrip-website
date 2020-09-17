"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var FlightService = /** @class */ (function () {
    function FlightService(http, commonFunction) {
        this.http = http;
        this.commonFunction = commonFunction;
    }
    FlightService.prototype.searchAirport = function (searchItem) {
        return this.http.get(environment_1.environment.apiUrl + "v1/flight/search-airport/" + searchItem)
            .pipe(operators_1.catchError(this.handleError));
    };
    FlightService.prototype.airRevalidate = function (routeCode) {
        var headers = {
            currency: 'USD',
            language: 'en'
        };
        return this.http.post(environment_1.environment.apiUrl + "v1/flight/air-revalidate/", routeCode, this.commonFunction.setHeaders(headers))
            .pipe(operators_1.catchError(this.handleError));
    };
    FlightService.prototype.getBaggageDetails = function (routeCode) {
        var payload = { route_code: routeCode };
        return this.http.post(environment_1.environment.apiUrl + "v1/flight/baggage-details", payload)
            .pipe(operators_1.catchError(this.handleError));
    };
    FlightService.prototype.getCancellationPolicy = function (routeCode) {
        var payload = { route_code: routeCode };
        return this.http.post(environment_1.environment.apiUrl + "v1/flight/cancellation-policy", payload)
            .pipe(operators_1.catchError(this.handleError));
    };
    FlightService.prototype.bookFligt = function (payload) {
        var headers = {
            currency: 'USD',
            language: 'en'
        };
        return this.http.post(environment_1.environment.apiUrl + "v1/flight/book", payload, this.commonFunction.setHeaders(headers))
            .pipe(operators_1.catchError(this.handleError));
    };
    FlightService.prototype.handleError = function (error) {
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
    FlightService.prototype.getBookingDetails = function (bookingId) {
        var headers = {
            currency: 'USD',
            language: 'en'
        };
        return this.http.get(environment_1.environment.apiUrl + "v1/flight/book/" + bookingId, this.commonFunction.setHeaders(headers))
            .pipe(operators_1.catchError(this.handleError));
    };
    FlightService.prototype.updateAdult = function (data, id) {
        return this.http.put(environment_1.environment.apiUrl + "v1/traveler/" + id, data, this.commonFunction.setHeaders());
    };
    FlightService.prototype.addAdult = function (data) {
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken) {
            return this.http.post(environment_1.environment.apiUrl + "v1/traveler/", data, this.commonFunction.setHeaders());
        }
        else {
            return this.http.post(environment_1.environment.apiUrl + "v1/traveler/", data);
        }
    };
    FlightService.prototype.getFlightSearchResult = function (data) {
        var headers = {
            currency: 'USD',
            language: 'en'
        };
        var url = environment_1.environment.apiUrl + "v1/flight/search-oneway-flight";
        return this.http.post(url, data, this.commonFunction.setHeaders(headers)).pipe(operators_1.catchError(this.handleError));
    };
    FlightService.prototype.getRoundTripFlightSearchResult = function (data) {
        var headers = {
            currency: 'USD',
            language: 'en'
        };
        var url = environment_1.environment.apiUrl + "v1/flight/search-roundtrip-flight";
        return this.http.post(url, data, this.commonFunction.setHeaders(headers)).pipe(operators_1.catchError(this.handleError));
    };
    FlightService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], FlightService);
    return FlightService;
}());
exports.FlightService = FlightService;
