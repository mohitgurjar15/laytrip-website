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
    function ListBookingsComponent(userService, commonFunction) {
        this.userService = userService;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = true;
        this.isNotFound = false;
        this.flightLists = [];
        this.perPageLimitConfig = [10, 25, 50, 100];
    }
    ListBookingsComponent.prototype.ngOnInit = function () {
        this.pageNumber = 1;
        this.limit = this.perPageLimitConfig[0];
        this.getBookings();
    };
    ListBookingsComponent.prototype.getBookings = function () {
        var _this = this;
        this.userService.getBookings(this.pageNumber, this.limit).subscribe(function (res) {
            if (res) {
                _this.flightLists = res.data.map(function (flight) {
                    if (flight.moduleId == 1) {
                        return {
                            tripId: flight.id,
                            bookingDate: _this.commonFunction.convertDateFormat(flight.bookingDate, 'YYYY-MM-DD'),
                            departure_time: flight.moduleInfo[0].routes[0].stops[0].departure_time,
                            arrival_time: flight.moduleInfo[0].routes[0].stops[0].arrival_time,
                            departure_city: flight.moduleInfo[0].routes[0].stops[0].departure_info.city,
                            arrival_city: flight.moduleInfo[0].routes[0].stops[0].arrival_info.city,
                            duration: flight.moduleInfo[0].total_duration,
                            airline_logo: flight.moduleInfo[0].routes[0].stops[0].airline_logo,
                            airline_name: flight.moduleInfo[0].routes[0].stops[0].airline_name,
                            airline: flight.moduleInfo[0].routes[0].stops[0].airline,
                            flight_number: flight.moduleInfo[0].routes[0].stops[0].flight_number,
                            instalment_amount: flight.moduleInfo[0].start_price,
                            selling_price: flight.moduleInfo[0].selling_price,
                            stop_count: flight.moduleInfo[0].instalment_details.stop_count,
                            is_refundable: flight.moduleInfo[0].instalment_details.is_refundable
                        };
                    }
                });
                _this.isNotFound = false;
                _this.loading = false;
            }
        }, function (err) {
            _this.isNotFound = true;
            if (err && err.status === 404) {
                _this.loading = false;
            }
        });
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
