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
var FlightTravelerComponent = /** @class */ (function () {
    function FlightTravelerComponent(travelerService, route, cookieService, toastr) {
        this.travelerService = travelerService;
        this.route = route;
        this.cookieService = cookieService;
        this.toastr = toastr;
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
        this._travellersCountInvalid = false;
    }
    FlightTravelerComponent.prototype.ngOnInit = function () {
        this.getTravelers();
        this._itinerary = JSON.parse(this.cookieService.get('_itinerary'));
        this.totalTraveler = (Number(this._itinerary.adult) + Number(this._itinerary.child) + Number(this._itinerary.infant));
        this.routeCode = this.route.snapshot.paramMap.get('rc');
    };
    FlightTravelerComponent.prototype.getTravelers = function () {
        var _this = this;
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken) {
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
            });
        }
        this.loading = false;
    };
    FlightTravelerComponent.prototype.getAdultCount = function (count) {
        this.selectedAdults = count;
    };
    FlightTravelerComponent.prototype.getItinerarySelectionArray = function (itinerarys) {
        if (itinerarys.adult.length === Number(this._itinerary.adult)
            && itinerarys.child.length === Number(this._itinerary.child)
            && itinerarys.infant.length === Number(this._itinerary.infant)) {
            this._travellersCountInvalid = true;
        }
    };
    FlightTravelerComponent.prototype.checkTravelesValid = function () {
        if (this._travellersCountInvalid) {
            // let errorMessage = "You have to select adult : "+ Number(this._itinerary.adult)
            // +" Child: "+Number(this._itinerary.child)+" Infant: "+Number(this._itinerary.infant);
            this.toastr.error("You have selected wrong criteria", 'Error');
        }
    };
    FlightTravelerComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken) {
            this.isLoggedIn = true;
            this.is_traveller = false;
        }
    };
    FlightTravelerComponent.prototype.ngDoCheck = function () {
        this.checkUser();
        if (this.is_traveller === false && this.travelers.length === 0) {
            this.is_traveller = true;
            // this.getTravelers();
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
