"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var UserService = /** @class */ (function () {
    function UserService(http, commonFunction) {
        this.http = http;
        this.commonFunction = commonFunction;
        this.apiURL = environment_1.environment.apiUrl;
    }
    UserService.prototype.handleError = function (error) {
        var errorMessage = {};
        if (error.status == 0) {
            errorMessage = { message: "API Server is not responding" };
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
    UserService.prototype.socialLogin = function (data) {
        return this.http.post(this.apiURL + 'v1/auth/social-login', data)
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    UserService.prototype.signin = function (jsonData) {
        var json = { "email": jsonData.email, "password": jsonData.password };
        return this.http.post(this.apiURL + 'v1/auth/signin', json)
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    UserService.prototype.signup = function (formValue) {
        var data = {
            "signup_via": "web",
            "first_name": formValue.first_name,
            "last_name": formValue.last_name,
            "email": formValue.email,
            "password": formValue.password,
            "confirm_password": formValue.confirm_password,
            "gender": 'M',
            "device_type": 1,
            "device_model": "RNE-L22",
            "device_token": "123abc#$%456",
            "app_version": "1.0",
            "os_version": "7.0"
        };
        return this.http.post(this.apiURL + 'v1/auth/signup', data)
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    UserService.prototype.verifyOtp = function (data) {
        return this.http.patch(this.apiURL + 'v1/auth/verify-otp', data)
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    UserService.prototype.resendOtp = function (email) {
        var data = { "email": email };
        return this.http.patch(this.apiURL + 'v1/auth/resend-otp', data)
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    UserService.prototype.forgotPassword = function (formValue) {
        var data = {
            "email": formValue.email
        };
        return this.http.post(this.apiURL + 'v1/auth/forgot-password', data)
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    UserService.prototype.resetPassword = function (data) {
        return this.http.post(this.apiURL + 'v1/auth/reset-password', data);
    };
    UserService.prototype.updateProfile = function (data) {
        return this.http.put(this.apiURL + 'v1/auth/profile', data, this.commonFunction.setHeaders());
    };
    UserService.prototype.getProfile = function () {
        return this.http.get(this.apiURL + 'v1/auth/profile/', this.commonFunction.setHeaders());
    };
    UserService.prototype.getBookings = function (pageNumber, limit) {
        return this.http.get(this.apiURL + "v1/booking/user-booking-list?limit=" + limit + "&page_no=" + pageNumber, this.commonFunction.setHeaders());
    };
    UserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
