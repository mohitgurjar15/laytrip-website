"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var HotelService = /** @class */ (function () {
    function HotelService(http, commonFunction) {
        this.http = http;
        this.commonFunction = commonFunction;
        this.headers = {
            currency: 'USD',
            language: 'en',
            token: ""
        };
        this.hotels = new rxjs_1.BehaviorSubject([]);
        this.getHotels = this.hotels.asObservable();
    }
    HotelService.prototype.setHotels = function (hotels) {
        this.hotels.next(hotels);
    };
    HotelService.prototype.searchHotels = function (data) {
        return this.http.post(environment_1.environment.apiUrl + "v1/hotel/search-location/", data)
            .pipe(operators_1.catchError(this.handleError));
    };
    HotelService.prototype.getHotelSearchResult = function (data) {
        return this.http.post(environment_1.environment.apiUrl + "v1/hotel/search/", data, this.commonFunction.setHeaders(this.headers))
            .pipe(operators_1.catchError(this.handleError));
    };
    HotelService.prototype.getFilterObjectsHotel = function (data) {
        return this.http.post(environment_1.environment.apiUrl + "v1/hotel/filter-objects", data, this.commonFunction.setHeaders(this.headers))
            .pipe(operators_1.catchError(this.handleError));
    };
    HotelService.prototype.getHotelDetail = function (id, token) {
        this.headers.token = "" + token;
        return this.http.post(environment_1.environment.apiUrl + "v1/hotel/detail", { hotel_id: id }, this.commonFunction.setHeaders(this.headers))
            .pipe(operators_1.catchError(this.handleError));
    };
    HotelService.prototype.getRoomDetails = function (id, token) {
        //this.headers.token = `${token}`;
        return this.http.post(environment_1.environment.apiUrl + "v1/hotel/rooms", { hotel_id: id, bundle: token }, this.commonFunction.setHeaders(this.headers))
            .pipe(operators_1.catchError(this.handleError));
    };
    HotelService.prototype.handleError = function (error) {
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
    HotelService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], HotelService);
    return HotelService;
}());
exports.HotelService = HotelService;
