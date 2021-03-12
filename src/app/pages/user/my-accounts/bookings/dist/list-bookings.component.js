"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
        this.upComingbookingsForFilter = [];
        this.completeLoading = false;
        this.completeBookings = [];
        this.completeBookingsForFilter = [];
        this.selectedInCompletedTabNumber = 0;
        this.selectedCompletedTabNumber = 0;
        this.cartItemsCount = 0;
        this.searchTextLength = 0;
        this.searchText = '';
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
            _this.upComingbookingsForFilter = res.data;
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
            _this.completeBookingsForFilter = res.data;
            _this.completeLoading = false;
        }, function (err) {
            _this.completeLoading = false;
            _this.completeBookings = [];
        });
    };
    ListBookingsComponent.prototype.filterBooking = function (items, searchValue) {
        var result = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].laytripCartId.toLowerCase().toString().includes(searchValue)) {
                result.push(items[i]);
            }
            for (var j = 0; j < items[i].booking.length; j++) {
                if (items[i].booking[j].moduleInfo[0].departure_code.toLowerCase().toString().includes(searchValue) ||
                    items[i].booking[j].moduleInfo[0].arrival_code.toLowerCase().toString().includes(searchValue) ||
                    items[i].booking[j].moduleInfo[0].airline_name.toLowerCase().toString().includes(searchValue) ||
                    items[i].booking[j].moduleInfo[0].departure_info.city.toLowerCase().toString().includes(searchValue) ||
                    items[i].booking[j].moduleInfo[0].arrival_info.city.toLowerCase().toString().includes(searchValue)) {
                    result.push(items[i]);
                }
            }
        }
        return result;
    };
    ListBookingsComponent.prototype.searchBooking = function (searchValue) {
        this.searchTextLength = searchValue.length;
        if (this.searchTextLength > 0) {
            // UPCOMING BOOKING
            this.upComingbookings = this.filterBooking(this.upComingbookingsForFilter, searchValue.toLowerCase().toString());
            // COMPLETED BOOKING
            this.completeBookings = this.filterBooking(this.completeBookingsForFilter, searchValue.toLowerCase().toString());
        }
        else {
            this.upComingbookings = __spreadArrays(this.upComingbookingsForFilter);
            this.completeBookings = __spreadArrays(this.completeBookingsForFilter);
        }
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
    ListBookingsComponent.prototype.cancelCartIdRemove = function (event) {
        var filterData = this.upComingbookings.filter(function (obj) {
            return obj.laytripCartId != event;
        });
        this.upComingbookings = [];
        this.upComingbookings = filterData;
    };
    ListBookingsComponent.prototype.loadUpcomming = function (event) {
        console.log(event);
        this.upComingloading = event;
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
