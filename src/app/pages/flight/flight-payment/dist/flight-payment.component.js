"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightPaymentComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var FlightPaymentComponent = /** @class */ (function () {
    function FlightPaymentComponent(route, router) {
        this.route = route;
        this.router = router;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.progressStep = { step1: true, step2: false, step3: false, step4: false };
        this.isShowPaymentOption = true;
        this.laycreditpoints = 0;
        this.flightSummary = [];
        this.instalmentMode = 'instalment';
        this.instalmentType = 'weekly';
        this.routeCode = '';
        this.isFlightNotAvailable = false;
        this.isShowGuestPopup = false;
        this.isLoggedIn = false;
    }
    FlightPaymentComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        this.routeCode = this.route.snapshot.paramMap.get('rc');
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        var __route = sessionStorage.getItem('__route');
        try {
            var response = JSON.parse(__route);
            response[0] = response;
            this.flightSummary = response;
            this.sellingPrice = response[0].selling_price;
        }
        catch (e) {
        }
        sessionStorage.setItem('__insMode', btoa(this.instalmentMode));
    };
    FlightPaymentComponent.prototype.applyLaycredit = function (laycreditpoints) {
        this.laycreditpoints = laycreditpoints;
        this.isShowPaymentOption = true;
        if (this.laycreditpoints >= this.sellingPrice) {
            this.isShowPaymentOption = false;
        }
    };
    FlightPaymentComponent.prototype.selectInstalmentMode = function (instalmentMode) {
        this.instalmentMode = instalmentMode;
        sessionStorage.setItem('__insMode', btoa(this.instalmentMode));
    };
    FlightPaymentComponent.prototype.getInstalmentData = function (data) {
        this.additionalAmount = data.additionalAmount;
        this.instalmentType = data.instalmentType;
        this.customAmount = data.customAmount;
        this.customInstalment = data.customInstalment;
        this.laycreditpoints = data.layCreditPoints;
        sessionStorage.setItem('__islt', btoa(JSON.stringify(data)));
    };
    FlightPaymentComponent.prototype.flightAvailable = function (event) {
        this.isFlightNotAvailable = event;
    };
    FlightPaymentComponent.prototype.checkUserAndRedirect = function () {
        console.log(this.userInfo);
        if (typeof this.userInfo.roleId != 'undefined' && this.userInfo.roleId != 7) {
            this.router.navigate(['/flight/traveler', this.routeCode]);
        }
        else {
            this.isShowGuestPopup = true;
        }
    };
    FlightPaymentComponent.prototype.changePopupValue = function (event) {
        this.isShowGuestPopup = event;
    };
    FlightPaymentComponent.prototype.ngDoCheck = function () {
        var userToken = localStorage.getItem('_lay_sess');
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (userToken) {
            this.isLoggedIn = true;
        }
    };
    FlightPaymentComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-payment',
            templateUrl: './flight-payment.component.html',
            styleUrls: ['./flight-payment.component.scss']
        })
    ], FlightPaymentComponent);
    return FlightPaymentComponent;
}());
exports.FlightPaymentComponent = FlightPaymentComponent;
