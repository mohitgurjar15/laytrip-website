"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomeService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("../../environments/environment");
var HomeService = /** @class */ (function () {
    function HomeService(http, commonFunction) {
        this.http = http;
        this.commonFunction = commonFunction;
        this.toString = new rxjs_1.BehaviorSubject({});
        this.fromDestinationInfo = new rxjs_1.BehaviorSubject({});
        this.getToString = this.toString.asObservable();
        this.getLocationForHotelDeal = this.fromDestinationInfo.asObservable();
    }
    HomeService.prototype.handleError = function (error) {
        var errorMessage = {};
        if (error.starepertoireSubjecttus == 0) {
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
    HomeService.prototype.setToString = function (flightToCode) {
        this.toString.next(flightToCode);
    };
    HomeService.prototype.setLocationForHotel = function (destinationInfo) {
        this.fromDestinationInfo.next(destinationInfo);
    };
    HomeService.prototype.getDealList = function (moduleId) {
        var headers = {
            currency: 'USD',
            language: 'en'
        };
        return this.http.get(environment_1.environment.apiUrl + "v1/deal/" + moduleId, this.commonFunction.setHeaders(headers))
            .pipe(operators_1.catchError(this.handleError));
    };
    HomeService.prototype.removeToString = function (module) {
        if (module == 'flight') {
            this.toString.next({});
        }
        else if (module == 'hotel') {
            this.fromDestinationInfo.next({});
        }
        else {
        }
    };
    HomeService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], HomeService);
    return HomeService;
}());
exports.HomeService = HomeService;
