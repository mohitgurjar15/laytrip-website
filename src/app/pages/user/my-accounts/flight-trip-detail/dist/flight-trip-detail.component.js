"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightTripDetailComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var FlightTripDetailComponent = /** @class */ (function () {
    function FlightTripDetailComponent(route, flightService) {
        this.route = route;
        this.flightService = flightService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.bookingResult = {};
        this.isFlightNotAvailable = false;
        this.isTripDetailloading = false;
        this.isTripNotFound = false;
        this.bookingLoader = true;
    }
    FlightTripDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        this.route.params.subscribe(function (params) { return _this.bookingId = params['id']; });
        this.getBookingDetails();
    };
    FlightTripDetailComponent.prototype.getBookingDetails = function () {
        var _this = this;
        this.flightService.getFlightBookingDetails(this.bookingId).subscribe(function (res) {
            _this.bookingResult.booking_details = res;
            _this.isTripDetailloading = true;
            _this.isTripNotFound = _this.bookingLoader = false;
        }, function (error) {
            _this.isTripDetailloading = _this.bookingLoader = false;
            _this.isFlightNotAvailable = _this.isTripNotFound = true;
        });
    };
    FlightTripDetailComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-trip-detail',
            templateUrl: './flight-trip-detail.component.html',
            styleUrls: ['./flight-trip-detail.component.scss']
        })
    ], FlightTripDetailComponent);
    return FlightTripDetailComponent;
}());
exports.FlightTripDetailComponent = FlightTripDetailComponent;
