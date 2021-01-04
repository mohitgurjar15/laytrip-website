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
var booking_status_const_1 = require("../../../../../constant/booking-status.const");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var send_email_popup_component_1 = require("../send-email-popup/send-email-popup.component");
var FlightsComponent = /** @class */ (function () {
    function FlightsComponent(commonFunction, flightService, userService, modalService, route) {
        this.commonFunction = commonFunction;
        this.flightService = flightService;
        this.userService = userService;
        this.modalService = modalService;
        this.route = route;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.flightList = [];
        this.flightBookings = [];
        this.pageSize = 10;
        this.perPageLimitConfig = [10, 25, 50, 100];
        this.showPaginationBar = false;
        this.totalItems = 0;
        this.showFlightDetails = [];
        this.loadBaggageDetails = true;
        this.loadCancellationPolicy = false;
        this.loadMoreCancellationPolicy = false;
        this.cancellationPolicyArray = [];
        this.isNotFound = false;
        this.loading = true;
        this.notFoundBaggageDetails = false;
        this.filterData = {};
        this.filterInfo = {};
        this.closeResult = '';
        this.showFareDetails = 0;
        this.bookingStatus = booking_status_const_1.BookingStatus;
    }
    FlightsComponent.prototype.ngOnInit = function () {
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        this.page = 1;
        this.loading = true;
        this.isNotFound = false;
        this.limit = this.perPageLimitConfig[0];
        this.getBookings();
    };
    FlightsComponent.prototype.goToBookingId = function (bookingId) {
        var modalRef = this.modalService.open(send_email_popup_component_1.SendEmailPopupComponent, { windowClass: 'modal fade send_mail_modal', centered: true });
        modalRef.componentInstance.bookingId = bookingId;
    };
    FlightsComponent.prototype.pageChange = function (event) {
        this.showPaginationBar = false;
        window.scroll(0, 0);
        this.loading = true;
        this.page = event;
        this.getBookings();
    };
    FlightsComponent.prototype.ngOnChanges = function (changes) {
        this.filterData = changes.result.currentValue;
        if (this.filterData) {
            this.showPaginationBar = false;
            this.getBookings();
        }
    };
    FlightsComponent.prototype.showDetails = function (index, flag) {
        var _this = this;
        if (flag === void 0) { flag = null; }
        if (typeof this.showFlightDetails[index] === 'undefined') {
            this.showFlightDetails[index] = true;
        }
        else {
            this.showFlightDetails[index] = !this.showFlightDetails[index];
        }
        if (flag == 'true') {
            this.showFareDetails = 1;
        }
        else {
            this.showFareDetails = 0;
        }
        this.showFlightDetails = this.showFlightDetails.map(function (item, i) {
            return ((index === i) && _this.showFlightDetails[index] === true) ? true : false;
        });
    };
    FlightsComponent.prototype.getBookings = function () {
        var _this = this;
        this.loading = true;
        if (this.filterData != 'undefined') {
            this.filterInfo = this.filterData;
        }
        this.userService.getBookings(this.page, this.limit, this.filterInfo).subscribe(function (res) {
            if (res) {
                console.log(res);
                _this.flightBookings = res.data.map(function (flight) {
                    if (flight.moduleId == 1) {
                        return {
                            tripId: flight.laytripBookingId,
                            journey_type: flight.locationInfo.journey_type,
                            checkInDate: _this.commonFunction.convertDateFormat(flight.checkInDate, 'YYYY-MM-DD'),
                            departure_time: flight.moduleInfo[0].routes[0].stops[0].departure_time,
                            arrival_time: flight.moduleInfo[0].routes[0].stops[0].arrival_time,
                            departure_city: flight.moduleInfo[0].routes[0].stops[0].departure_info.city,
                            arrival_city: flight.moduleInfo[0].routes[0].stops[0].arrival_info.city,
                            duration: flight.moduleInfo[0].routes[0].duration,
                            airline_logo: flight.moduleInfo[0].routes[0].stops[0].airline_logo,
                            airline_name: flight.moduleInfo[0].routes[0].stops[0].airline_name,
                            airline: flight.moduleInfo[0].routes[0].stops[0].airline,
                            flight_number: flight.moduleInfo[0].routes[0].stops[0].flight_number,
                            instalment_amount: flight.moduleInfo[0].start_price,
                            selling_price: flight.bookingType == 2 ? flight.moduleInfo[0].secondary_selling_price : flight.moduleInfo[0].selling_price,
                            stop_count: flight.moduleInfo[0].instalment_details.stop_count,
                            is_refundable: flight.moduleInfo[0].instalment_details.is_refundable,
                            routes: flight.moduleInfo[0].routes,
                            moduleInfo: flight.moduleInfo[0],
                            travelers: flight.travelers,
                            bookingType: flight.bookingType,
                            bookingStatus: flight.bookingStatus,
                            bookingInstalments: flight.bookingInstalments
                        };
                    }
                });
                console.log('this.flightBookings', _this.flightBookings);
                _this.totalItems = res.total_count;
                _this.isNotFound = false;
                _this.loading = false;
                _this.showPaginationBar = true;
            }
        }, function (err) {
            _this.isNotFound = true;
            _this.showPaginationBar = _this.loading = false;
        });
    };
    FlightsComponent.prototype.closeFlightDetail = function () {
        this.showFareDetails = 0;
        this.showFlightDetails = this.showFlightDetails.map(function (item) {
            return false;
        });
    };
    FlightsComponent.prototype.getBaggageDetails = function (routeCode) {
        var _this = this;
        this.loadBaggageDetails = true;
        this.flightService.getBaggageDetails(routeCode).subscribe(function (data) {
            _this.baggageDetails = data;
            _this.loadBaggageDetails = _this.notFoundBaggageDetails = false;
        }, function (err) {
            _this.loadBaggageDetails = false;
            _this.notFoundBaggageDetails = true;
            _this.errorMessage = err.message;
        });
    };
    FlightsComponent.prototype.getCancellationPolicy = function (routeCode) {
        var _this = this;
        console.log(routeCode);
        this.loadCancellationPolicy = true;
        this.loadMoreCancellationPolicy = false;
        this.errorMessage = '';
        this.flightService.getCancellationPolicy(routeCode).subscribe(function (data) {
            _this.cancellationPolicyArray = data.cancellation_policy.split('--');
            _this.loadCancellationPolicy = false;
            _this.cancellationPolicy = data;
        }, function (err) {
            _this.loadCancellationPolicy = false;
            _this.errorMessage = err.message;
        });
    };
    FlightsComponent.prototype.toggleCancellationContent = function () {
        this.loadMoreCancellationPolicy = !this.loadMoreCancellationPolicy;
    };
    FlightsComponent.prototype.open = function (content) {
        var _this = this;
        console.log(content);
        this.modalReference = this.modalService.open(content, { windowClass: 'cancle_alert_modal', centered: true });
        this.modalReference.result.then(function (result) {
            _this.closeResult = "Closed with: " + result;
        }, function (reason) {
            // this.getTravelers();
            _this.closeResult = "Dismissed " + _this.getDismissReason(reason);
            console.log(_this.closeResult);
        });
    };
    FlightsComponent.prototype.getDismissReason = function (reason) {
        if (reason === ng_bootstrap_1.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === ng_bootstrap_1.ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return "with: " + reason;
        }
    };
    __decorate([
        core_1.Input()
    ], FlightsComponent.prototype, "flightLists");
    __decorate([
        core_1.Input()
    ], FlightsComponent.prototype, "result");
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
