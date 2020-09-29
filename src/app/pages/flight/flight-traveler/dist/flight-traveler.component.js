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
var FlightTravelerComponent = /** @class */ (function () {
    function FlightTravelerComponent(travelerService, route, cookieService, toastr, router) {
        this.travelerService = travelerService;
        this.route = route;
        this.cookieService = cookieService;
        this.toastr = toastr;
        this.router = router;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelers = [];
        this._adults = [];
        this._childs = [];
        this._infants = [];
        this.selectedAdults = 0;
        this.routeCode = '';
        this.loading = true;
        this.progressStep = { step1: true, step2: false, step3: false };
        this.isLoggedIn = false;
        this.is_traveller = false;
        this.totalTraveler = 0;
        this._travellersCountValid = false;
        this.isFlightNotAvailable = false;
        this.is_updateToken = false;
    }
    FlightTravelerComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        this.loading = true;
        this.getTravelers();
        if (sessionStorage.getItem('_itinerary')) {
            this._itinerary = JSON.parse(sessionStorage.getItem('_itinerary'));
            this.totalTraveler = (Number(this._itinerary.adult) + Number(this._itinerary.child) + Number(this._itinerary.infant));
        }
        this.routeCode = this.route.snapshot.paramMap.get('rc');
    };
    FlightTravelerComponent.prototype.getTravelers = function () {
        var _this = this;
        this._adults = this._childs = this._infants = [];
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken && userToken != 'undefined') {
            this.is_traveller = true;
            this.travelerService.getTravelers().subscribe(function (res) {
                _this.travelers = res.data;
                _this.travelers.forEach(function (element) {
                    if (element.user_type == 'adult') {
                        _this._adults.push(element);
                    }
                    else if (element.user_type == 'child') {
                        _this._childs.push(element);
                    }
                    else if (element.user_type == 'infant') {
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
            var errorMessage = "You have to select " + Number(this._itinerary.adult) + " Adult, "
                + Number(this._itinerary.child) + " Child " + Number(this._itinerary.infant) + " Infant";
            this.toastr.error(errorMessage, 'Invalid Criteria', { positionClass: 'toast-top-center', easeTime: 1000 });
        }
    };
    FlightTravelerComponent.prototype.checkUser = function () {
        this.userDetails = jwt_helper_1.getLoginUserInfo();
        if (this.isLoggedIn && this.userDetails.roleId != 7 && !this.is_updateToken) {
            this.is_updateToken = true;
            this.getTravelers();
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
