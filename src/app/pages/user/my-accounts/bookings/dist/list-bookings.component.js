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
    function ListBookingsComponent(userService, accountService, commonFunction, cartService, renderer) {
        this.userService = userService;
        this.accountService = accountService;
        this.commonFunction = commonFunction;
        this.cartService = cartService;
        this.renderer = renderer;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.upComingloading = false;
        this.upComingbookings = [];
        this.completeLoading = false;
        this.completeBookings = [];
        this.selectedInCompletedTabNumber = 0;
        this.selectedCompletedTabNumber = 0;
        this.cartItemsCount = 0;
        this.searchTextLength = 0;
    }
    ListBookingsComponent.prototype.ngOnInit = function () {
        this.getIncomplteBooking();
        this.getComplteBooking();
        this.renderer.addClass(document.body, 'cms-bgColor');
    };
    ListBookingsComponent.prototype.getIncomplteBooking = function (search) {
        var _this = this;
        if (search === void 0) { search = ''; }
        this.upComingloading = true;
        this.accountService.getIncomplteBooking(search).subscribe(function (res) {
            _this.upComingbookings = res.data;
            _this.upComingloading = false;
        }, function (err) {
            _this.upComingloading = false;
            _this.upComingbookings = [];
        });
    };
    ListBookingsComponent.prototype.getComplteBooking = function (search) {
        var _this = this;
        if (search === void 0) { search = ''; }
        this.completeLoading = true;
        this.accountService.getComplteBooking(search).subscribe(function (res) {
            _this.completeBookings = res.data;
            _this.completeLoading = false;
        }, function (err) {
            _this.completeLoading = false;
            _this.completeBookings = [];
        });
    };
    ListBookingsComponent.prototype.searchBooking = function (searchValue) {
        this.searchTextLength = searchValue.length;
        // var upComingbookingsData = this.upComingbookings;
        // console.log(upComingbookingsData)
        // if(this.searchTextLength > 0 ){
        //   this.upComingbookings = this.upComingbookings.filter(element => {
        //     if(element.laytripCartId.includes(searchValue)){
        //       return element;
        //     }
        //   });
        // } else {
        //   console.log('her')
        //   this.upComingbookings = upComingbookingsData;
        // }
        // console.log(this.upComingbookings,upComingbookingsData)
        // this.getComplteBooking(searchValue);
        // this.getIncomplteBooking(searchValue);
    };
    ListBookingsComponent.prototype.selectInCompletedTab = function (cartNumber) {
        this.selectedInCompletedTabNumber = cartNumber;
    };
    ListBookingsComponent.prototype.selectCompletedTab = function (cartNumber) {
        this.selectedCompletedTabNumber = cartNumber;
    };
    ListBookingsComponent.prototype.getProgressPercentage = function (value, totalValue) {
        return { 'width': Math.floor((value / totalValue) * 100) + '%' };
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
