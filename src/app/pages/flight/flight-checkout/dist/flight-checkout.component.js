"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightCheckoutComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var moment = require("moment");
var rxjs_1 = require("rxjs");
var FlightCheckoutComponent = /** @class */ (function () {
    function FlightCheckoutComponent(route, router, flightService, cookieService, genericService, toastr) {
        this.route = route;
        this.router = router;
        this.flightService = flightService;
        this.cookieService = cookieService;
        this.genericService = genericService;
        this.toastr = toastr;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.validateCardDetails = new rxjs_1.Subject();
        this.showAddCardForm = false;
        this.progressStep = { step1: true, step2: true, step3: false };
        this.cardToken = '';
        this.instalmentMode = 'instalment';
        this.laycreditpoints = 0;
        this.travelers = [];
        this.isDisableBookBtn = true;
        this.isTandCaccepeted = false;
        this.bookingStatus = 0;
        this.bookingLoader = false;
        this.bookingResult = {};
        this.flightSummary = [];
        this.instalmentType = 'weekly';
        this.isFlightNotAvailable = false;
        this.isSessionTimeOut = false;
        this.isShowCardOption = true;
        this.isShowPaymentOption = true;
        this.isShowFeedbackPopup = false;
    }
    FlightCheckoutComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        if (typeof this.userInfo.roleId == 'undefined') {
            this.router.navigate(['/']);
        }
        this.routeCode = this.route.snapshot.paramMap.get('rc');
        var timerInfo = this.cookieService.get('flight_booking_timer');
        timerInfo = timerInfo ? JSON.parse(timerInfo) : {};
        if (timerInfo.route_code == this.routeCode) {
            this.bookingTimerConfig = {
                leftTime: 600 - moment(moment().format('YYYY-MM-DD h:mm:ss')).diff(timerInfo.time, 'seconds'),
                format: 'm:s'
            };
        }
        else {
            this.bookingTimerConfig = {
                leftTime: 600, format: 'm:s'
            };
            var bookingTimer = {
                'route_code': this.routeCode,
                'time': moment().format('YYYY-MM-DD h:mm:ss')
            };
            this.cookieService.put("flight_booking_timer", JSON.stringify(bookingTimer));
        }
        if (this.userInfo.roleId == 7) {
            this.instalmentMode = 'no-instalment';
            this.instalmentType = '';
            this.showAddCardForm = true;
        }
        var travelersIds = this.cookieService.get('_travelers');
        try {
            travelersIds = JSON.parse(travelersIds);
            this.travelerList = travelersIds;
            if (travelersIds.length) {
                for (var i = 0; i < travelersIds.length; i++) {
                    this.travelers.push({
                        "traveler_id": travelersIds[i]['userId']
                    });
                }
            }
        }
        catch (e) {
        }
        this.validateBookingButton();
    };
    FlightCheckoutComponent.prototype.toggleAddcardForm = function () {
        this.showAddCardForm = !this.showAddCardForm;
    };
    FlightCheckoutComponent.prototype.applyLaycredit = function (laycreditpoints) {
        console.log("laycreditpoints", laycreditpoints);
        this.isShowCardOption = true;
        this.laycreditpoints = laycreditpoints;
        this.isShowPaymentOption = true;
        if (this.laycreditpoints >= this.sellingPrice) {
            this.isShowCardOption = false;
            this.isShowPaymentOption = false;
            this.cardToken = '';
        }
        this.validateBookingButton();
    };
    FlightCheckoutComponent.prototype.selectCreditCard = function (cardToken) {
        this.cardToken = cardToken;
        this.validateBookingButton();
    };
    FlightCheckoutComponent.prototype.selectInstalmentMode = function (instalmentMode) {
        this.instalmentMode = instalmentMode;
    };
    FlightCheckoutComponent.prototype.acceptTermCondtion = function () {
        this.isTandCaccepeted = !this.isTandCaccepeted;
        this.validateBookingButton();
    };
    FlightCheckoutComponent.prototype.bookFlight = function () {
        var _this = this;
        /* Guest user */
        if (this.userInfo.roleId == 7) {
            var isValid = this.validateCard(this.guestCardDetails);
            if (isValid === false) {
                return;
            }
            this.bookingLoader = true;
            this.genericService.saveCard(this.guestCardDetails).subscribe(function (res) {
                if (res.cardToken) {
                    _this.cardToken = res.cardToken;
                    _this.bookFlightApi();
                }
            }, (function (error) {
                _this.bookingLoader = false;
                _this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
            }));
        }
        /* Login user */
        else {
            this.bookingLoader = true;
            this.bookFlightApi();
        }
        //this.bookFlightApi(bookingData);
    };
    FlightCheckoutComponent.prototype.bookFlightApi = function () {
        var _this = this;
        window.scroll(0, 0);
        var bookingData = {
            payment_type: this.instalmentMode,
            laycredit_points: this.laycreditpoints,
            instalment_type: this.instalmentType,
            route_code: this.routeCode,
            travelers: this.travelers,
            additional_amount: this.additionalAmount,
            card_token: this.cardToken,
            custom_instalment_amount: this.customAmount,
            custom_instalment_no: this.customInstalment
        };
        this.flightService.bookFligt(bookingData).subscribe(function (res) {
            _this.bookingStatus = 1;
            _this.bookingId = res.laytrip_booking_id;
            _this.bookingLoader = false;
            _this.progressStep = { step1: true, step2: true, step3: true };
            _this.bookingResult = res;
            _this.isShowFeedbackPopup = true;
        }, function (error) {
            if (error.status == 422) {
                _this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
            }
            if (error.status == 404) {
                _this.bookingStatus = 2; // Flight Not available  
            }
            if (error.status == 424) {
                _this.bookingStatus = 2; // Booking failed from supplier side
            }
            _this.bookingLoader = false;
        });
    };
    FlightCheckoutComponent.prototype.bookingDetails = function (bookingId) {
        this.flightService.getBookingDetails(bookingId).subscribe(function (res) {
        }, function (error) {
        });
    };
    FlightCheckoutComponent.prototype.validateBookingButton = function () {
        this.isDisableBookBtn = true;
        if (this.userInfo.roleId != 7 &&
            this.isTandCaccepeted == true &&
            (this.cardToken != '' || this.laycreditpoints >= this.sellingPrice)) {
            this.isDisableBookBtn = false;
        }
        else if (this.userInfo.roleId == 7 &&
            this.isTandCaccepeted == true) {
            this.isDisableBookBtn = false;
        }
    };
    FlightCheckoutComponent.prototype.validateCard = function (guestCardDetails) {
        this.validateCardDetails.next(guestCardDetails);
        if (typeof guestCardDetails.first_name == 'undefined' || guestCardDetails.first_name == '')
            return false;
        if (typeof guestCardDetails.last_name == 'undefined' || guestCardDetails.last_name == '')
            return false;
        if (typeof guestCardDetails.card_number == 'undefined' || guestCardDetails.card_number == '')
            return false;
        if (typeof guestCardDetails.expiry == 'undefined' || guestCardDetails.expiry == '')
            return false;
        if (typeof guestCardDetails.card_cvv == 'undefined' || guestCardDetails.card_cvv == '')
            return false;
    };
    FlightCheckoutComponent.prototype.getFlightSummaryData = function (data) {
        this.flightSummary = data;
        this.sellingPrice = data[0].selling_price;
    };
    FlightCheckoutComponent.prototype.getInstalmentData = function (data) {
        this.additionalAmount = data.additionalAmount;
        this.instalmentType = data.instalmentType;
        this.customAmount = data.customAmount;
        this.customInstalment = data.customInstalment;
    };
    FlightCheckoutComponent.prototype.emitNewCard = function (event) {
        this.newCard = event;
    };
    FlightCheckoutComponent.prototype.emitGuestCardDetails = function (event) {
        this.guestCardDetails = event;
    };
    FlightCheckoutComponent.prototype.flightAvailable = function (event) {
        this.isFlightNotAvailable = event;
    };
    FlightCheckoutComponent.prototype.sessionTimeout = function (event) {
        this.isSessionTimeOut = event;
    };
    FlightCheckoutComponent.prototype.feedbackToggle = function (event) {
        if (event) {
            this.isShowFeedbackPopup = false;
        }
    };
    FlightCheckoutComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-checkout',
            templateUrl: './flight-checkout.component.html',
            styleUrls: ['./flight-checkout.component.scss']
        })
    ], FlightCheckoutComponent);
    return FlightCheckoutComponent;
}());
exports.FlightCheckoutComponent = FlightCheckoutComponent;
