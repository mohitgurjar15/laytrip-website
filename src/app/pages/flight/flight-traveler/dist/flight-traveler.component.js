"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightTravelerComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var moment = require("moment");
var FlightTravelerComponent = /** @class */ (function () {
    function FlightTravelerComponent(travelerService, route, cookieService, toastr, router, flightService) {
        this.travelerService = travelerService;
        this.route = route;
        this.cookieService = cookieService;
        this.toastr = toastr;
        this.router = router;
        this.flightService = flightService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelers = [];
        this._adults = [];
        this._childs = [];
        this._infants = [];
        this.selectedAdults = 0;
        this.routeCode = '';
        this.loading = true;
        this.progressStep = { step1: true, step2: true, step3: false, step4: false };
        this.isLoggedIn = false;
        this.is_traveller = false;
        this.totalTraveler = 0;
        this._travellersCountValid = false;
        this.isFlightNotAvailable = false;
        this.is_updateToken = false;
        this.partialPaymentAmount = 0;
        this.showPartialPayemntOption = false;
        this.isComplete = false;
        this.payNowAmount = 0;
        this.instalmentMode = '';
        this.priceData = [];
    }
    FlightTravelerComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        this.loading = true;
        this.getTravelers();
        this.getSellingPrice();
        if (sessionStorage.getItem('_itinerary')) {
            this._itinerary = JSON.parse(sessionStorage.getItem('_itinerary'));
            this.totalTraveler = (Number(this._itinerary.adult) + Number(this._itinerary.child) + Number(this._itinerary.infant));
        }
        this.routeCode = this.route.snapshot.paramMap.get('rc');
        var customInstalmentData = atob(sessionStorage.getItem('__islt'));
        customInstalmentData = JSON.parse(customInstalmentData);
        console.log("customInstalmentData", customInstalmentData);
        this.partialPaymentAmount = customInstalmentData.partialPaymentAmount;
        this.instalmentMode = atob(sessionStorage.getItem('__insMode'));
        this.showPartialPayemntOption = this.instalmentMode == 'instalment' ? true : false;
        if (this.instalmentMode == 'no-instalment') {
        }
        else {
            this.payNowAmount = customInstalmentData.payNowAmount;
        }
    };
    FlightTravelerComponent.prototype.getTravelers = function () {
        var _this = this;
        this._adults = this._childs = this._infants = this.travelers = [];
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken && userToken != 'undefined') {
            this.is_traveller = true;
            this.travelerService.getTravelers().subscribe(function (res) {
                _this.travelers = res.data;
                _this.travelers.forEach(function (element) {
                    if (element.user_type == 'adult') {
                        element.isComplete = _this.checkTravellerComplete(element, 'adult');
                        _this._adults.push(element);
                    }
                    else if (element.user_type == 'child') {
                        element.isComplete = _this.checkTravellerComplete(element, 'child');
                        _this._childs.push(element);
                    }
                    else if (element.user_type == 'infant') {
                        element.isComplete = _this.checkTravellerComplete(element, 'infant');
                        _this._infants.push(element);
                    }
                });
                _this.loading = false;
            });
        }
        else {
            this.loading = false;
        }
        setTimeout(function () {
            _this.loading = false;
        }, 2000);
    };
    FlightTravelerComponent.prototype.checkTravellerComplete = function (object, type) {
        var isEmpty = false;
        var travellerKeys = ["firstName", "lastName", "email", "dob", "gender"];
        var _itinerary;
        var _itineraryJson;
        _itinerary = sessionStorage.getItem('_itinerary');
        try {
            _itineraryJson = JSON.parse(_itinerary);
        }
        catch (e) { }
        if (type == 'adult') {
            var adultTravellerKeys = ["firstName", "lastName", "email", "dob", "gender", "countryCode", "phoneNo"];
            if (_itineraryJson && _itineraryJson.is_passport_required) {
                adultTravellerKeys = ["firstName", "lastName", "email", "dob", "gender", "countryCode", "phoneNo", "passportNumber", "passportExpiry"];
            }
            isEmpty = this.checkObj(object, adultTravellerKeys);
        }
        else if (type == 'child' || type == 'infant') {
            isEmpty = this.checkObj(object, travellerKeys);
        }
        return isEmpty;
    };
    FlightTravelerComponent.prototype.checkObj = function (obj, travellerKeys) {
        var isComplete = true;
        var userStr = JSON.stringify(obj);
        console.log("userStr", userStr);
        JSON.parse(userStr, function (key, value) {
            if (!value && travellerKeys.indexOf(key) !== -1) {
                return isComplete = false;
            }
        });
        return isComplete;
    };
    FlightTravelerComponent.prototype.getAdultCount = function (count) {
        this.selectedAdults = count;
    };
    FlightTravelerComponent.prototype.getItinerarySelectionArray = function (itinerarys) {
        this._travellersCountValid = false;
        if (itinerarys.adult.length === Number(this._itinerary.adult)
            && itinerarys.child.length === Number(this._itinerary.child)
            && itinerarys.infant.length === Number(this._itinerary.infant)) {
            this._travellersCountValid = true;
        }
    };
    FlightTravelerComponent.prototype.checkTravelesValid = function () {
        if (this._travellersCountValid) {
            this.router.navigate(['/flight/checkout', this.routeCode]);
        }
        else {
            var errorMessage = "You can only select ";
            if (Number(this._itinerary.adult)) {
                errorMessage += Number(this._itinerary.adult) + " Adult, ";
            }
            if (Number(this._itinerary.child)) {
                errorMessage += Number(this._itinerary.child) + " Child, ";
            }
            if (Number(this._itinerary.infant)) {
                errorMessage += Number(this._itinerary.infant) + " Infant";
            }
            errorMessage = errorMessage.replace(/,\s*$/, "");
            this.toastr.error(errorMessage, 'Invalid Criteria', { positionClass: 'toast-top-center', easeTime: 1000 });
        }
    };
    FlightTravelerComponent.prototype.checkUser = function () {
        this.userDetails = jwt_helper_1.getLoginUserInfo();
        if (this.isLoggedIn && this.userDetails.roleId != 7 && !this.is_updateToken) {
            this.is_updateToken = this.is_traveller = true;
            // this.getTravelers();
        }
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken && userToken != 'undefined') {
            this.isLoggedIn = true;
        }
    };
    FlightTravelerComponent.prototype.ngDoCheck = function () {
        this.checkUser();
        if (this.is_traveller === false) {
            this.loading = true;
            this.getTravelers();
        }
    };
    FlightTravelerComponent.prototype.flightAvailable = function (event) {
        this.isFlightNotAvailable = event;
    };
    FlightTravelerComponent.prototype.onActivate = function (event) {
        window.scroll(0, 0);
    };
    FlightTravelerComponent.prototype.getSellingPrice = function () {
        var _this = this;
        try {
            var __route = sessionStorage.getItem('__route');
            var response = JSON.parse(__route);
            response[0] = response;
            var payLoad = {
                departure_date: moment(response[0].departure_date, 'DD/MM/YYYY').format("YYYY-MM-DD"),
                net_rate: response[0].net_rate
            };
            this.flightService.getSellingPrice(payLoad).subscribe(function (res) {
                _this.priceData = res;
            }, function (error) {
            });
        }
        catch (e) {
        }
    };
    FlightTravelerComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-traveler',
            templateUrl: './flight-traveler.component.html',
            styleUrls: ['./flight-traveler.component.scss']
        })
    ], FlightTravelerComponent);
    return FlightTravelerComponent;
}());
exports.FlightTravelerComponent = FlightTravelerComponent;
