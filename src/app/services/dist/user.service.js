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
var moment = require("moment");
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
            "email": typeof formValue.email != 'undefined' ? formValue.email : formValue
        };
        return this.http.post(this.apiURL + 'v1/auth/forgot-password', data)
            .pipe(operators_1.retry(1), operators_1.catchError(this.handleError));
    };
    UserService.prototype.resetPassword = function (data) {
        return this.http.post(this.apiURL + 'v1/auth/reset-password', data);
    };
    UserService.prototype.deleteAccount = function (isRequireBackupFile) {
        var accessToken = localStorage.getItem('_lay_sess');
        /*   const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                
            },
          } */
        var options = {
            headers: {
                Authorization: "Bearer " + accessToken
            },
            body: {
                requireBackupFile: isRequireBackupFile
            }
        };
        console.log(options);
        return this.http["delete"](this.apiURL + 'v1/user/account/request', options);
    };
    UserService.prototype.changePassword = function (data) {
        return this.http.put(this.apiURL + 'v1/auth/change-password', data, this.commonFunction.setHeaders());
    };
    UserService.prototype.updateProfile = function (data) {
        return this.http.put(this.apiURL + 'v1/auth/profile', data, this.commonFunction.setHeaders());
    };
    UserService.prototype.updateProfileImage = function (data) {
        return this.http.put(this.apiURL + 'v1/auth/profile/picture', data, this.commonFunction.setHeaders());
    };
    UserService.prototype.getProfile = function () {
        return this.http.get(this.apiURL + 'v1/auth/profile/', this.commonFunction.setHeaders());
    };
    UserService.prototype.changePreference = function (data) {
        return this.http.put(this.apiURL + 'v1/auth/preference', data, this.commonFunction.setHeaders());
    };
    UserService.prototype.getPreference = function () {
        return this.http.get(this.apiURL + 'v1/auth/preference', this.commonFunction.setHeaders());
    };
    UserService.prototype.getBookings = function (pageNumber, limit, filterForm) {
        var queryString = "";
        if (filterForm && filterForm != 'undefined') {
            if (filterForm.bookingId) {
                queryString += (filterForm.bookingId) ? '&booking_id=' + filterForm.bookingId : '';
            }
            if (filterForm.module) {
                queryString += (filterForm.module.id) ? '&booking_type=' + filterForm.module.id : '';
            }
            if (filterForm.start_date) {
                queryString += (filterForm.start_date) ? '&start_date=' + moment(filterForm.start_date).format("YYYY-MM-DD") : '';
            }
            if (filterForm.end_date) {
                queryString += (filterForm.end_date) ? '&end_date=' + moment(filterForm.end_date).format("YYYY-MM-DD") : '';
            }
        }
        return this.http.get(this.apiURL + "v1/booking/user-booking-list?module_id=1&limit=" + limit + "&page_no=" + pageNumber + queryString, this.commonFunction.setHeaders());
    };
    UserService.prototype.getPaymentHistory = function (pageNumber, limit, filterForm, payment_status) {
        var queryString = "";
        if (filterForm && filterForm != 'undefined') {
            if (filterForm.bookingId) {
                queryString += (filterForm.bookingId) ? '&booking_id=' + filterForm.bookingId : '';
            }
            if (filterForm.module) {
                queryString += (filterForm.module.id) ? '&booking_type=' + filterForm.module.id : '';
            }
            if (filterForm.start_date) {
                queryString += (filterForm.start_date) ? '&payment_start_date=' + moment(filterForm.start_date).format("YYYY-MM-DD") : '';
            }
            if (filterForm.end_date) {
                queryString += (filterForm.end_date) ? '&payment_end_date=' + moment(filterForm.end_date).format("YYYY-MM-DD") : '';
            }
        }
        return this.http.get(this.apiURL + "v1/booking/payment?limit=" + limit + "&page_no=" + pageNumber + queryString, this.commonFunction.setHeaders());
    };
    UserService.prototype.getModules = function (pageNumber, limit) {
        return this.http.get(this.apiURL + "v1/modules?limit=" + limit + "&page_no=" + pageNumber, this.commonFunction.setHeaders());
    };
    UserService.prototype.getTraveller = function (travelerId) {
        return this.http.get(environment_1.environment.apiUrl + "v1/traveler/get-traveler/" + travelerId, this.commonFunction.setHeaders());
    };
    UserService.prototype.getSubscriptionList = function () {
        return this.http.get(this.apiURL + 'v1/subscription/', this.commonFunction.setHeaders());
    };
    UserService.prototype.getCardList = function () {
        return this.http.get(this.apiURL + 'v1/payment', this.commonFunction.setHeaders());
    };
    UserService.prototype.deleteCard = function () {
        return this.http.get(this.apiURL + 'v1/payment', this.commonFunction.setHeaders());
    };
    UserService.prototype.getSubscriptionPlanDetail = function (data) {
        return this.http.get(this.apiURL + 'v1/subscription/get-plan/' + data.id + '/' + data.currency, this.commonFunction.setHeaders());
    };
    UserService.prototype.payNowSubscription = function (data) {
        return this.http.post(this.apiURL + 'v1/subscription', data, this.commonFunction.setHeaders());
    };
    UserService.prototype.addNewPoints = function (data) {
        return this.http.post(this.apiURL + 'v1/laytrip-point/add', data, this.commonFunction.setHeaders());
    };
    UserService.prototype.subscribeNow = function (email) {
        var data = { email: email };
        return this.http.post(this.apiURL + 'v1/news-letters/subscribe', data);
    };
    UserService.prototype.emailVeryfiy = function (email) {
        return this.http.get(this.apiURL + "v1/auth/verify-email-id?email=" + email, this.commonFunction.setHeaders());
    };
    UserService.prototype.registerGuestUser = function (data) {
        return this.http.post(this.apiURL + "v1/auth/guest-user", data);
    };
    UserService.prototype.mapGuestUser = function (guestUserId) {
        return this.http.patch(this.apiURL + "v1/cart/map-guest-user/" + guestUserId, {}, this.commonFunction.setHeaders());
    };
    UserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
