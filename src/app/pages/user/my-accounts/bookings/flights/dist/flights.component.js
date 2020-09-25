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
    function FlightsComponent(commonFunction) {
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.flightList = [];
        this.flightBookings = [];
        this.pageSize = 12;
        this.perPageLimitConfig = [12, 25, 50, 100];
        this.showPaginationBar = false;
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
