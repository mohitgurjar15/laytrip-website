"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ListBookingsComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var ListBookingsComponent = /** @class */ (function () {
    function ListBookingsComponent(userService, accountService, commonFunction) {
        this.userService = userService;
        this.accountService = accountService;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.upComingloading = false;
        this.upComingbookings = [];
        this.completeLoading = false;
        this.completeBookings = [];
        this.selectedInCompletedTabNumber = 0;
        this.selectedCompletedTabNumber = 0;
    }
    ListBookingsComponent.prototype.ngOnInit = function () {
        this.getIncomplteBooking();
        this.getComplteBooking();
    };
    ListBookingsComponent.prototype.getIncomplteBooking = function (bookingId) {
        var _this = this;
        if (bookingId === void 0) { bookingId = ''; }
        this.upComingloading = true;
        this.accountService.getIncomplteBooking(bookingId).subscribe(function (res) {
            _this.upComingbookings = res.data;
            _this.upComingloading = false;
        }, function (err) {
            _this.upComingloading = false;
            _this.upComingbookings = [];
        });
    };
    ListBookingsComponent.prototype.getComplteBooking = function (bookingId) {
        var _this = this;
        if (bookingId === void 0) { bookingId = ''; }
        this.completeLoading = true;
        this.accountService.getComplteBooking(bookingId).subscribe(function (res) {
            _this.completeBookings = res.data;
            _this.completeLoading = false;
        }, function (err) {
            _this.completeLoading = false;
            _this.completeBookings = [];
        });
    };
    ListBookingsComponent.prototype.searchBooking = function (searchKey) {
        this.getComplteBooking(searchKey);
        this.getIncomplteBooking(searchKey);
    };
    ListBookingsComponent.prototype.selectInCompletedTab = function (cartNumber) {
        this.selectedInCompletedTabNumber = cartNumber;
    };
    ListBookingsComponent.prototype.selectCompletedTab = function (cartNumber) {
        this.selectedCompletedTabNumber = cartNumber;
    };
    ListBookingsComponent = __decorate([
        core_1.Component({
            selector: 'app-list-bookings',
            templateUrl: './list-bookings.component.html',
            styleUrls: ['./list-bookings.component.scss']
        })
    ], ListBookingsComponent);
    return ListBookingsComponent;
}());
exports.ListBookingsComponent = ListBookingsComponent;
