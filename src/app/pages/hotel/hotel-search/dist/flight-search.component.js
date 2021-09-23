"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightSearchComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var moment = require("moment");
var FlightSearchComponent = /** @class */ (function() {
    function FlightSearchComponent(route, flightService, router, location, commonFunction) {
        this.route = route;
        this.flightService = flightService;
        this.router = router;
        this.location = location;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = true;
        this.isNotFound = false;
        this.isResetFilter = 'no';
        this.subscriptions = [];
        this.tripType = '';
        this.flexibleLoading = false;
        this.flexibleNotFound = false;
        this.dates = [];
        this.calenderPrices = [];
        this.errorMessage = '';
    }
    FlightSearchComponent.prototype.ngOnInit = function() {
        var _this = this;
        window.scroll(0, 0);
        var payload = {};
        this.route.queryParams.forEach(function(params) {
            _this.flightSearchInfo = params;
            if (params && params.trip === 'roundtrip') {
                payload = {
                    source_location: params.departure,
                    destination_location: params.arrival,
                    departure_date: params.departure_date,
                    arrival_date: params.arrival_date,
                    flight_class: params["class"],
                    adult_count: parseInt(params.adult),
                    child_count: parseInt(params.child),
                    infant_count: parseInt(params.infant)
                };
            } else {
                payload = {
                    source_location: params.departure,
                    destination_location: params.arrival,
                    departure_date: params.departure_date,
                    flight_class: params["class"],
                    adult_count: parseInt(params.adult),
                    child_count: parseInt(params.child),
                    infant_count: parseInt(params.infant)
                };
            }
            _this.getFlightSearchData(payload, params.trip);
        });
    };
    FlightSearchComponent.prototype.getFlightSearchData = function(payload, tripType) {
        var _this = this;
        this.loading = true;
        this.tripType = tripType;
        this.errorMessage = '';
        if (payload && tripType === 'roundtrip') {
            this.flightService.getRoundTripFlightSearchResult(payload).subscribe(function(res) {
                if (res) {
                    _this.loading = false;
                    _this.isNotFound = false;
                    _this.flightDetails = res.items;
                    _this.filterFlightDetails = res;
                }
            }, function(err) {
                if (err && err.status === 404) {
                    _this.errorMessage = err.message;
                } else {
                    _this.isNotFound = true;
                }
                _this.loading = false;
            });
        } else {
            this.flightService.getFlightSearchResult(payload).subscribe(function(res) {
                if (res) {
                    _this.loading = false;
                    _this.isNotFound = false;
                    _this.flightDetails = res.items;
                    _this.filterFlightDetails = res;
                }
            }, function(err) {
                if (err.status == 422) {
                    _this.errorMessage = err.message;
                } else {
                    _this.isNotFound = true;
                }
                _this.loading = false;
            });
            this.dates = [];
            // console.log("this.dates", this.dates);
            this.flightService.getFlightFlexibleDates(payload).subscribe(function(res) {
                if (res) {
                    _this.flexibleLoading = false;
                    _this.flexibleNotFound = false;
                    _this.dates = res;
                }
            }, function(err) {
                _this.flexibleNotFound = true;
                _this.flexibleLoading = false;
            });
            this.getCalenderPrice(payload);
        }
    };
    FlightSearchComponent.prototype.getCalenderPrice = function(payload) {
        var _this = this;
        var departureDate = this.route.snapshot.queryParams['departure_date'];
        var departureDates = departureDate.split("-");
        var startDate = moment([departureDates[0], departureDates[1] - 1]);
        var endDate = moment(startDate).endOf('month');
        startDate = moment(startDate.toDate()).format("YYYY-MM-DD");
        endDate = moment(endDate.toDate()).format("YYYY-MM-DD");
        if (!moment().isBefore(startDate)) {
            startDate = moment().format("YYYY-MM-DD");
        }
        payload.start_date = startDate;
        payload.end_date = endDate;
        this.flightService.getFlightCalenderDate(payload).subscribe(function(res) {
            if (res) {
                _this.calenderPrices = res;
            }
        }, function(err) {});
    };
    FlightSearchComponent.prototype.getSearchItem = function(event) {
        // TRIP is round-trip then call this API
        if (event.trip === 'roundtrip') {
            this.getFlightSearchDataForRoundTrip(event);
        } else if (event.trip === 'oneway') {
            this.getFlightSearchDataForOneway(event);
        }
    };
    FlightSearchComponent.prototype.getFlightSearchDataForOneway = function(event) {
        var _this = this;
        var urlData = this.commonFunction.decodeUrl(this.router.url);
        var queryParams = {
            trip: event.trip,
            departure: event.departure,
            arrival: event.arrival,
            departure_date: event.departure_date,
            "class": event["class"] ? event["class"] : 'Economy',
            adult: event.adult,
            child: event.child ? event.child : 0,
            infant: event.infant ? event.infant : 0
        };
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(function() {
            _this.router.navigate(["" + urlData.url], { queryParams: queryParams, queryParamsHandling: 'merge' });
        });
    };
    FlightSearchComponent.prototype.getFlightSearchDataForRoundTrip = function(event) {
        var _this = this;
        var urlData = this.commonFunction.decodeUrl(this.router.url);
        var queryParams = {
            trip: event.trip,
            departure: event.departure,
            arrival: event.arrival,
            departure_date: event.departure_date,
            arrival_date: event.arrival_date,
            "class": event["class"] ? event["class"] : 'Economy',
            adult: event.adult,
            child: event.child ? event.child : 0,
            infant: event.infant ? event.infant : 0
        };
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(function() {
            _this.router.navigate(["" + urlData.url], { queryParams: queryParams, queryParamsHandling: 'merge' });
        });
    };
    FlightSearchComponent.prototype.ngOnDestroy = function() {
        this.subscriptions.forEach(function(sub) { return sub.unsubscribe(); });
    };
    FlightSearchComponent.prototype.sortFlight = function(event) {
        var key = event.key,
            order = event.order;
        if (key === 'total_duration') {
            this.flightDetails = this.sortByDuration(this.flightDetails, key, order);
        } else if (key === 'arrival') {
            this.flightDetails = this.sortByArrival(this.flightDetails, key, order);
        } else if (key === 'departure') {
            this.flightDetails = this.sortByDeparture(this.flightDetails, key, order);
        } else {
            this.flightDetails = this.sortJSON(this.flightDetails, key, order);
        }
    };
    FlightSearchComponent.prototype.sortJSON = function(data, key, way) {
        if (typeof data === "undefined") {
            return data;
        } else {
            return data.sort(function(a, b) {
                var x = a[key];
                var y = b[key];
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    FlightSearchComponent.prototype.sortByDuration = function(data, key, way) {
        if (typeof data === "undefined") {
            return data;
        } else {
            return data.sort(function(a, b) {
                var x = moment(a.arrival_date + " " + a.arrival_time, 'DD/MM/YYYY hh:mm A').diff(moment(a.departure_date + " " + a.departure_time, 'DD/MM/YYYY hh:mm A'), 'seconds');
                var y = moment(b.arrival_date + " " + b.arrival_time, 'DD/MM/YYYY hh:mm A').diff(moment(b.departure_date + " " + b.departure_time, 'DD/MM/YYYY hh:mm A'), 'seconds');
                // console.log(a.arrival_date + " " + a.arrival_time, a.departure_date + " " + a.departure_time, x, y, way);
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    FlightSearchComponent.prototype.sortByArrival = function(data, key, way) {
        if (typeof data === "undefined") {
            return data;
        } else {
            return data.sort(function(a, b) {
                var x = moment(a.arrival_date + " " + a.arrival_time, 'DD/MM/YYYY hh:mm A').format("X");
                var y = moment(b.arrival_date + " " + b.arrival_time, 'DD/MM/YYYY hh:mm A').format("X");
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    FlightSearchComponent.prototype.sortByDeparture = function(data, key, way) {
        if (typeof data === "undefined") {
            return data;
        } else {
            return data.sort(function(a, b) {
                var x = moment(a.departure_date + " " + a.departure_time, 'DD/MM/YYYY hh:mm A').format("X");
                var y = moment(b.departure_date + " " + b.departure_time, 'DD/MM/YYYY hh:mm A').format("X");
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    FlightSearchComponent.prototype.filterFlight = function(event) {
        this.flightDetails = event;
    };
    FlightSearchComponent.prototype.resetFilter = function() {
        this.isResetFilter = (new Date()).toString();
    };
    FlightSearchComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-search',
            templateUrl: './flight-search.component.html',
            styleUrls: ['./flight-search.component.scss']
        })
    ], FlightSearchComponent);
    return FlightSearchComponent;
}());
exports.FlightSearchComponent = FlightSearchComponent;