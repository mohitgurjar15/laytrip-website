"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightSummaryComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var FlightSummaryComponent = /** @class */ (function () {
    function FlightSummaryComponent(flightService, route, cookieService, commonFunction) {
        this.flightService = flightService;
        this.route = route;
        this.cookieService = cookieService;
        this.commonFunction = commonFunction;
        this.totalTravelerValue = new core_1.EventEmitter();
        this.flightAvailable = new core_1.EventEmitter();
        this.routeCode = '';
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.flightDetail = [];
        this.outwardDetails = false;
        this.inwardDetails = false;
        this.outWardStopCount = 0;
        this.inWardStopCount = 0;
        this.flightSummaryLoader = true;
        this.totalTraveler = 1;
        this.showBaggePolicy = false;
        this.showCancellationPolicy = false;
        this.getRouteDetails = new core_1.EventEmitter();
    }
    FlightSummaryComponent.prototype.ngOnInit = function () {
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        this.routeCode = this.route.snapshot.paramMap.get('rc');
        if (this.checkAvailability == 'local') {
            this.getFlightSummary();
        }
        else {
            this.airRevalidate();
        }
    };
    FlightSummaryComponent.prototype.airRevalidate = function () {
        var _this = this;
        console.log('here');
        var routeData = {
            route_code: this.route.snapshot.paramMap.get('rc')
        };
        this.flightService.airRevalidate(routeData).subscribe(function (response) {
            _this.flightDetail = response;
            _this.flightSummaryLoader = false;
            _this.outWardStopCount = response[0].routes[0].stops.length - 1;
            _this.totalTraveler = parseInt(response[0].adult_count) + (parseInt(response[0].child_count) || 0) + (parseInt(response[0].infant_count) || 0);
            _this.inWardStopCount = typeof response[0].routes[1] != 'undefined' ? response[0].routes[1].stops.length - 1 : 0;
            _this.totalTravelerValue.emit(_this.totalTraveler);
            _this.getRouteDetails.emit(response);
        }, function (error) {
            _this.flightAvailable.emit(true);
        });
    };
    FlightSummaryComponent.prototype.getFlightSummary = function () {
        var __route = sessionStorage.getItem('__route');
        var _itinerary = sessionStorage.getItem('_itinerary');
        try {
            var response = JSON.parse(__route);
            var response_itinerary = JSON.parse(_itinerary);
            response[0] = response;
            this.flightDetail = response;
            this.flightSummaryLoader = false;
            this.outWardStopCount = response[0].routes[0].stops.length - 1;
            // this.totalTraveler = parseInt(response[0].adult_count) + (parseInt(response[0].child_count) || 0) + ( parseInt(response[0].infant_count) || 0)  
            this.totalTraveler = parseInt(response_itinerary.adult) + (parseInt(response_itinerary.child) || 0) + (parseInt(response_itinerary.infant) || 0);
            this.inWardStopCount = typeof response[0].routes[1] != 'undefined' ? response[0].routes[1].stops.length - 1 : 0;
            this.totalTravelerValue.emit(this.totalTraveler);
            this.getRouteDetails.emit(response);
        }
        catch (error) {
            this.flightAvailable.emit(true);
        }
    };
    FlightSummaryComponent.prototype.toggleRouteDetails = function (type) {
        if (type == 'onward') {
            this.outwardDetails = !this.outwardDetails;
        }
        if (type == 'inward') {
            this.inwardDetails = !this.inwardDetails;
        }
    };
    FlightSummaryComponent.prototype.toggleBaggagePolicy = function () {
        this.showBaggePolicy = true;
    };
    FlightSummaryComponent.prototype.toggleCancellationPolicy = function () {
        this.showCancellationPolicy = true;
    };
    __decorate([
        core_1.Output()
    ], FlightSummaryComponent.prototype, "totalTravelerValue");
    __decorate([
        core_1.Output()
    ], FlightSummaryComponent.prototype, "flightAvailable");
    __decorate([
        core_1.Input()
    ], FlightSummaryComponent.prototype, "showPartialPayemntOption");
    __decorate([
        core_1.Input()
    ], FlightSummaryComponent.prototype, "checkAvailability");
    __decorate([
        core_1.Output()
    ], FlightSummaryComponent.prototype, "getRouteDetails");
    FlightSummaryComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-summary',
            templateUrl: './flight-summary.component.html',
            styleUrls: ['./flight-summary.component.scss']
        })
    ], FlightSummaryComponent);
    return FlightSummaryComponent;
}());
exports.FlightSummaryComponent = FlightSummaryComponent;
