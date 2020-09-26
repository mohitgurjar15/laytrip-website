"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightsComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../../environments/environment");
var FlightsComponent = /** @class */ (function () {
    function FlightsComponent(commonFunction, flightService) {
        this.commonFunction = commonFunction;
        this.flightService = flightService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.flightList = [];
        this.flightBookings = [];
        this.pageSize = 12;
        this.perPageLimitConfig = [12, 25, 50, 100];
        this.showPaginationBar = false;
        this.showFlightDetails = [];
        this.loadBaggageDetails = true;
        this.loadCancellationPolicy = false;
    }
    FlightsComponent.prototype.ngOnInit = function () {
        this.page = 1;
        this.limit = this.perPageLimitConfig[0];
    };
    FlightsComponent.prototype.ngOnChanges = function (changes) {
        this.flightList = changes.flightLists.currentValue;
        this.showPaginationBar = true;
    };
    FlightsComponent.prototype.ngAfterContentChecked = function () {
        this.flightBookings = this.flightList;
        this.totalItems = this.flightBookings.length;
        this.showPaginationBar = true;
    };
    FlightsComponent.prototype.pageChange = function (event) {
        this.showPaginationBar = false;
        this.page = event;
    };
    FlightsComponent.prototype.showDetails = function (index) {
        var _this = this;
        if (typeof this.showFlightDetails[index] === 'undefined') {
            this.showFlightDetails[index] = true;
        }
        else {
            this.showFlightDetails[index] = !this.showFlightDetails[index];
        }
        this.showFlightDetails = this.showFlightDetails.map(function (item, i) {
            return ((index === i) && _this.showFlightDetails[index] === true) ? true : false;
        });
    };
    FlightsComponent.prototype.closeFlightDetail = function () {
        this.showFlightDetails = this.showFlightDetails.map(function (item) {
            return false;
        });
    };
    FlightsComponent.prototype.getBaggageDetails = function (routeCode) {
        var _this = this;
        this.loadBaggageDetails = true;
        this.flightService.getBaggageDetails(routeCode).subscribe(function (data) {
            _this.baggageDetails = data;
            console.log(_this.baggageDetails);
            _this.loadBaggageDetails = false;
        });
    };
    __decorate([
        core_1.Input()
    ], FlightsComponent.prototype, "flightLists");
    FlightsComponent = __decorate([
        core_1.Component({
            selector: 'app-flights',
            templateUrl: './flights.component.html',
            styleUrls: ['./flights.component.scss']
        })
    ], FlightsComponent);
    return FlightsComponent;
}());
exports.FlightsComponent = FlightsComponent;
