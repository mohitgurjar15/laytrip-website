"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FilterFlightComponent = void 0;
var core_1 = require("@angular/core");
var moment = require("moment");
var environment_1 = require("../../../../../environments/environment");
var forms_1 = require("@angular/forms");
var FilterFlightComponent = /** @class */ (function () {
    function FilterFlightComponent() {
        var _this = this;
        this.filterFlight = new core_1.EventEmitter();
        this.showMinAirline = 4;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.priceSlider = new forms_1.FormGroup({
            price: new forms_1.FormControl([20, 80])
        });
        this.partialPriceSlider = new forms_1.FormGroup({
            partial_price: new forms_1.FormControl([20, 80])
        });
        this.isShowoutbound = false;
        this.isShowinbound = false;
        this.airLines = [];
        this.outBoundDepartureTimeRangeSlots = [];
        this.outBoundArrivalTimeRangeSlots = [];
        this.inBoundDepartureTimeRangeSlots = [];
        this.inBoundArrivalTimeRangeSlots = [];
        this.outBoundStops = [];
        this.inBoundStops = [];
        /* End of filter variable */
        // tslint:disable-next-line: variable-name
        this._currency = localStorage.getItem('_curr');
        this.priceValue = 0;
        this.priceHighValue = 0;
        this.priceOptions = {
            floor: 0,
            ceil: 0,
            step: 1,
            translate: function (value) {
                var currency = JSON.parse(_this._currency);
                return "" + currency.symbol + value;
            }
        };
        this.partialPaymentValue = 0;
        this.partialPaymentHighValue = 0;
        this.partialPaymentOptions = {
            floor: 0,
            ceil: 0,
            step: 1,
            translate: function (value) {
                var currency = JSON.parse(_this._currency);
                return "" + currency.symbol + value;
            }
        };
        this.subscriptions = [];
        this.is_open = false;
    }
    FilterFlightComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currency = JSON.parse(this._currency);
        if (this.filterFlightDetails && this.filterFlightDetails.price_range) {
            // FOR FILTER FLIGHT - PRICE & PARTIAL PRICE
            this.priceValue = this.filterFlightDetails.price_range.min_price ? Math.floor(this.filterFlightDetails.price_range.min_price) : 0;
            this.priceHighValue = this.filterFlightDetails.price_range.max_price ? Math.ceil(this.filterFlightDetails.price_range.max_price) : 0;
            this.priceSlider.controls.price.setValue([Math.floor(this.priceValue), Math.ceil(this.priceHighValue)]);
            this.minPrice = Math.floor(this.priceValue);
            this.maxPrice = Math.ceil(this.priceHighValue);
            this.priceOptions.floor = this.priceValue;
            this.priceOptions.ceil = this.priceHighValue;
            parseInt(this.filterFlightDetails.price_range.max_price) ?
                parseInt(this.filterFlightDetails.price_range.max_price) : 0;
        }
        if (this.filterFlightDetails && this.filterFlightDetails.partial_payment_price_range) {
            this.partialPaymentValue =
                this.filterFlightDetails.partial_payment_price_range.min_price ? Math.floor(this.filterFlightDetails.partial_payment_price_range.min_price) : 0;
            this.minPartialPaymentPrice = Math.floor(this.partialPaymentValue);
            this.partialPaymentHighValue =
                this.filterFlightDetails.partial_payment_price_range.max_price ? Math.ceil(this.filterFlightDetails.partial_payment_price_range.max_price) : 0;
            this.maxPartialPaymentPrice = Math.ceil(this.partialPaymentHighValue);
            this.partialPaymentOptions.floor = this.partialPaymentValue;
            this.partialPaymentOptions.ceil = this.partialPaymentHighValue;
            //this.partialPriceSlider.controls.partial_price.setValue([Math.floor(this.partialPaymentValue), Math.ceil(this.partialPaymentHighValue)])
            this.partialPriceSlider.controls.partial_price.setValue(this.partialPaymentValue, this.partialPaymentHighValue);
        }
        if (this.filterFlightDetails && this.filterFlightDetails.arrival_time_slot || this.filterFlightDetails
            && this.filterFlightDetails.depature_time_slot) {
            // FOR FILTER FLIGHT - ARRIVAL TIME & DEPATURE TIME
            this.arrivalTimeSlot = this.filterFlightDetails.arrival_time_slot;
            this.depatureTimeSlot = this.filterFlightDetails.depature_time_slot;
        }
        if (this.filterFlightDetails && this.filterFlightDetails.stop_data) {
            // FOR FLIGHT STOPS
            this.flightStops = this.filterFlightDetails.stop_data;
        }
        if (this.filterFlightDetails && this.filterFlightDetails.airline_list) {
            // FOR FLIGHT AIRLINE - AIRLINE
            this.airLineCount = this.filterFlightDetails.airline_list.length + 1;
            this.airlineList = this.filterFlightDetails.airline_list;
            this.airlineList.forEach(function (element) {
                return element.isChecked = false;
            });
        }
        if (this.filterFlightDetails && this.filterFlightDetails.items) {
            this.filterFlightDetails.items.forEach(function (element) {
                _this.departureTimeSlotCityName = element.departure_info.city;
                _this.arrivalTimeSlotCityName = element.arrival_info.city;
            });
        }
        this.loadJquery();
    };
    FilterFlightComponent.prototype.toggleOutbound = function () {
        this.isShowoutbound = !this.isShowoutbound;
    };
    FilterFlightComponent.prototype.toggleInbound = function () {
        this.isShowinbound = !this.isShowinbound;
    };
    FilterFlightComponent.prototype.closeModal = function () {
        $('#filter_mob_modal1').modal('hide');
    };
    FilterFlightComponent.prototype.loadJquery = function () {
        //Start REsponsive Fliter js
        $(".responsive_filter_btn").click(function () {
            $("#responsive_filter_show").slideDown();
            $("body").addClass('overflow-hidden');
        });
        $(".filter_close > a").click(function () {
            $("#responsive_filter_show").slideUp();
            $("body").removeClass('overflow-hidden');
        });
        //Close REsponsive Fliter js
        // Start filter Shortby js
        $(document).on('show', '#accordion2', function (e) {
            $(e.target).prev('.accordion-heading').addClass('accordion-opened');
        });
        $(document).on('hide', '#accordion2', function (e) {
            $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
        });
    };
    FilterFlightComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    FilterFlightComponent.prototype.toggleAirlines = function (type) {
        this.showMinAirline = (type === 'more') ? 500 : 4;
    };
    FilterFlightComponent.prototype.toggleFilter = function () {
        this.is_open = !this.is_open;
    };
    FilterFlightComponent.prototype.resetFilter = function () {
        this.minPrice = this.filterFlightDetails.price_range.min_price;
        this.maxPrice = this.filterFlightDetails.price_range.max_price;
        this.airLines = [];
        this.minPartialPaymentPrice = 0;
        this.maxPartialPaymentPrice = 0;
        this.outBoundDepartureTimeRangeSlots = [];
        this.outBoundArrivalTimeRangeSlots = [];
        this.inBoundDepartureTimeRangeSlots = [];
        this.inBoundArrivalTimeRangeSlots = [];
        this.outBoundStops = [];
        this.inBoundStops = [];
        //Reset Price
        this.priceSlider.reset({ price: [Math.floor(this.filterFlightDetails.price_range.min_price), Math.ceil(this.filterFlightDetails.price_range.max_price)] });
        //Reset partial payment
        this.partialPriceSlider.reset({ partial_price: [Math.floor(this.filterFlightDetails.partial_payment_price_range.min_price), Math.ceil(this.filterFlightDetails.partial_payment_price_range.max_price)] });
        //Reset airlines
        if (typeof this.airlineList != 'undefined' && this.airlineList.length) {
            this.airlineList.forEach(function (element) {
                return element.isChecked = false;
            });
        }
        $("input:checkbox").prop('checked', false);
        this.filterFlights();
    };
    /**
     * Filter by price range
     * @param event
     */
    FilterFlightComponent.prototype.fliterByPrice = function (event) {
        this.minPrice = event.value;
        this.maxPrice = event.highValue;
        this.filterFlights();
    };
    /**
     * Filetr by airlines
     * @param event
     */
    FilterFlightComponent.prototype.filterByAirline = function (event, index) {
        if (event.target.checked === true) {
            this.airLines.push(event.target.value);
        }
        else {
            this.airLines = this.airLines.filter(function (airline) {
                return airline != event.target.value;
            });
        }
        this.airlineList[index].isChecked = !this.airlineList[index].isChecked;
        this.filterFlights();
    };
    FilterFlightComponent.prototype.fliterByPartialPayment = function (event) {
        this.minPartialPaymentPrice = event.value;
        this.maxPartialPaymentPrice = event.highValue;
        this.filterFlights();
    };
    FilterFlightComponent.prototype.filterByOutBoundDepartureTimeSlot = function (event, journey, type, slot) {
        var slotValue = {
            value: slot,
            journey: journey,
            type: type
        };
        if (event.target.checked) {
            this.outBoundDepartureTimeRangeSlots.push(slotValue);
        }
        else {
            this.outBoundDepartureTimeRangeSlots = this.outBoundDepartureTimeRangeSlots.filter(function (slot) {
                return JSON.stringify(slot) !== JSON.stringify(slotValue);
            });
        }
        this.filterFlights();
    };
    FilterFlightComponent.prototype.filterByOutBoundArrivalTimeSlot = function (event, journey, type, slot) {
        var slotValue = {
            value: slot,
            journey: journey,
            type: type
        };
        if (event.target.checked) {
            this.outBoundArrivalTimeRangeSlots.push(slotValue);
        }
        else {
            this.outBoundArrivalTimeRangeSlots = this.outBoundArrivalTimeRangeSlots.filter(function (slot) {
                return JSON.stringify(slot) !== JSON.stringify(slotValue);
            });
        }
        this.filterFlights();
    };
    FilterFlightComponent.prototype.filterByInBoundDepartureTimeSlot = function (event, journey, type, slot) {
        var slotValue = {
            value: slot,
            journey: journey,
            type: type
        };
        if (event.target.checked) {
            this.inBoundDepartureTimeRangeSlots.push(slotValue);
        }
        else {
            this.inBoundDepartureTimeRangeSlots = this.inBoundDepartureTimeRangeSlots.filter(function (slot) {
                return JSON.stringify(slot) !== JSON.stringify(slotValue);
            });
        }
        this.filterFlights();
    };
    FilterFlightComponent.prototype.filterByInBoundArrivalTimeSlot = function (event, journey, type, slot) {
        var slotValue = {
            value: slot,
            journey: journey,
            type: type
        };
        if (event.target.checked) {
            this.inBoundArrivalTimeRangeSlots.push(slotValue);
        }
        else {
            this.inBoundArrivalTimeRangeSlots = this.inBoundArrivalTimeRangeSlots.filter(function (slot) {
                return JSON.stringify(slot) !== JSON.stringify(slotValue);
            });
        }
        this.filterFlights();
    };
    FilterFlightComponent.prototype.filterByDepartureStop = function (event, stopCount) {
        if (event.target.checked === true) {
            this.outBoundStops.push(stopCount);
        }
        else {
            this.outBoundStops = this.outBoundStops.filter(function (stop) {
                return stop != stopCount;
            });
        }
        this.filterFlights();
    };
    FilterFlightComponent.prototype.filterByArrivalStop = function (event, stopCount) {
        if (event.target.checked === true) {
            this.inBoundStops.push(stopCount);
        }
        else {
            this.inBoundStops = this.inBoundStops.filter(function (stop) {
                return stop != stopCount;
            });
        }
        this.filterFlights();
    };
    /**
     * Comman function to process filtration of flight
     */
    FilterFlightComponent.prototype.filterFlights = function () {
        var _this = this;
        var filterdFlights = this.filterFlightDetails.items;
        /* Filter flight based on min & max price */
        if (this.minPrice && this.maxPrice) {
            filterdFlights = filterdFlights.filter(function (item) {
                return item.selling_price >= _this.minPrice && item.selling_price <= _this.maxPrice;
            });
        }
        /* Filter flight based on airline selected */
        if (this.airLines.length) {
            filterdFlights = filterdFlights.filter(function (item) {
                return _this.airLines.includes(item.airline);
            });
        }
        /* Filter flight based on min & max partial payment price */
        if (this.minPartialPaymentPrice && this.maxPartialPaymentPrice) {
            filterdFlights = filterdFlights.filter(function (item) {
                return item.secondary_start_price >= _this.minPartialPaymentPrice && item.secondary_start_price <= _this.maxPartialPaymentPrice;
            });
        }
        /* Filter based on outbound departure time slot */
        if (this.outBoundDepartureTimeRangeSlots.length) {
            filterdFlights = filterdFlights.filter(function (item) {
                var journeyIndex;
                var typeIndex;
                var timeValue;
                for (var _i = 0, _a = _this.outBoundDepartureTimeRangeSlots; _i < _a.length; _i++) {
                    var slot = _a[_i];
                    journeyIndex = slot.journey == 'outbound' ? 0 : 1;
                    typeIndex = slot.type == 'departure' ? 0 : item.routes[journeyIndex].stops.length - 1;
                    timeValue = slot.type == 'departure' ? 'departure_time' : 'arrival_time';
                    if (moment(item.routes[journeyIndex].stops[typeIndex][timeValue], 'hh:mm A').
                        isBetween(moment(slot.value.from_time, 'hh:mm a'), moment(slot.value.to_time, 'hh:mm a'))) {
                        return true;
                    }
                }
            });
        }
        /* Filter based on outbound arrival time slot */
        if (this.outBoundArrivalTimeRangeSlots.length) {
            filterdFlights = filterdFlights.filter(function (item) {
                var journeyIndex;
                var typeIndex;
                var timeValue;
                for (var _i = 0, _a = _this.outBoundArrivalTimeRangeSlots; _i < _a.length; _i++) {
                    var slot = _a[_i];
                    journeyIndex = slot.journey == 'outbound' ? 0 : 1;
                    typeIndex = slot.type == 'departure' ? 0 : item.routes[journeyIndex].stops.length - 1;
                    timeValue = slot.type == 'departure' ? 'departure_time' : 'arrival_time';
                    if (moment(item.routes[journeyIndex].stops[typeIndex][timeValue], 'hh:mm A').
                        isBetween(moment(slot.value.from_time, 'hh:mm a'), moment(slot.value.to_time, 'hh:mm a'))) {
                        return true;
                    }
                }
            });
        }
        /* Filter based on inbound departure time slot */
        if (this.inBoundDepartureTimeRangeSlots.length) {
            filterdFlights = filterdFlights.filter(function (item) {
                var journeyIndex;
                var typeIndex;
                var timeValue;
                for (var _i = 0, _a = _this.inBoundDepartureTimeRangeSlots; _i < _a.length; _i++) {
                    var slot = _a[_i];
                    journeyIndex = slot.journey == 'outbound' ? 0 : 1;
                    typeIndex = slot.type == 'departure' ? 0 : item.routes[journeyIndex].stops.length - 1;
                    timeValue = slot.type == 'departure' ? 'departure_time' : 'arrival_time';
                    if (moment(item.routes[journeyIndex].stops[typeIndex][timeValue], 'hh:mm A').
                        isBetween(moment(slot.value.from_time, 'hh:mm a'), moment(slot.value.to_time, 'hh:mm a'))) {
                        return true;
                    }
                }
            });
        }
        /* Filter based on inbound arrival time slot */
        if (this.inBoundArrivalTimeRangeSlots.length) {
            filterdFlights = filterdFlights.filter(function (item) {
                var journeyIndex;
                var typeIndex;
                var timeValue;
                for (var _i = 0, _a = _this.inBoundArrivalTimeRangeSlots; _i < _a.length; _i++) {
                    var slot = _a[_i];
                    journeyIndex = slot.journey == 'outbound' ? 0 : 1;
                    typeIndex = slot.type == 'departure' ? 0 : item.routes[journeyIndex].stops.length - 1;
                    timeValue = slot.type == 'departure' ? 'departure_time' : 'arrival_time';
                    if (moment(item.routes[journeyIndex].stops[typeIndex][timeValue], 'hh:mm A').
                        isBetween(moment(slot.value.from_time, 'hh:mm a'), moment(slot.value.to_time, 'hh:mm a'))) {
                        return true;
                    }
                }
            });
        }
        if (this.outBoundStops.length) {
            filterdFlights = filterdFlights.filter(function (item) {
                if (typeof item.inbound_stop_count != 'undefined') {
                    return (_this.outBoundStops.includes(item.stop_count) || _this.outBoundStops.includes(item.inbound_stop_count));
                }
                else {
                    return _this.outBoundStops.includes(item.stop_count);
                }
            });
        }
        /* if (this.inBoundStops.length) {
          filterdFlights = filterdFlights.filter(item => {
    
            return this.inBoundStops.includes(item.inbound_stop_count);
    
          })
        } */
        this.filterFlight.emit(filterdFlights);
    };
    FilterFlightComponent.prototype.ngOnChanges = function (changes) {
        if (changes['isResetFilter']) {
            this.isResetFilter = changes['isResetFilter'].currentValue;
            this.minPrice = this.filterFlightDetails.price_range.min_price;
            this.maxPrice = this.filterFlightDetails.price_range.max_price;
            this.airLines = [];
            this.minPartialPaymentPrice = 0;
            this.maxPartialPaymentPrice = 0;
            this.outBoundDepartureTimeRangeSlots = [];
            this.outBoundArrivalTimeRangeSlots = [];
            this.inBoundDepartureTimeRangeSlots = [];
            this.inBoundArrivalTimeRangeSlots = [];
            this.outBoundStops = [];
            this.inBoundStops = [];
            //Reset Price
            this.priceSlider.reset({ price: [Math.floor(this.filterFlightDetails.price_range.min_price), Math.ceil(this.filterFlightDetails.price_range.max_price)] });
            //Reset partial payment
            this.partialPriceSlider.reset({ partial_price: [Math.floor(this.filterFlightDetails.partial_payment_price_range.min_price), Math.ceil(this.filterFlightDetails.partial_payment_price_range.max_price)] });
            //Reset airlines
            if (typeof this.airlineList != 'undefined' && this.airlineList.length) {
                this.airlineList.forEach(function (element) {
                    return element.isChecked = false;
                });
            }
            $("input:checkbox").prop('checked', false);
            this.filterFlights();
        }
    };
    __decorate([
        core_1.Input()
    ], FilterFlightComponent.prototype, "filterFlightDetails");
    __decorate([
        core_1.Input()
    ], FilterFlightComponent.prototype, "isResetFilter");
    __decorate([
        core_1.Output()
    ], FilterFlightComponent.prototype, "filterFlight");
    FilterFlightComponent = __decorate([
        core_1.Component({
            selector: 'app-filter-flight',
            templateUrl: './filter-flight.component.html',
            styleUrls: ['./filter-flight.component.scss']
        })
    ], FilterFlightComponent);
    return FilterFlightComponent;
}());
exports.FilterFlightComponent = FilterFlightComponent;
