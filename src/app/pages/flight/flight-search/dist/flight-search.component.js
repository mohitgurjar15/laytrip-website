"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightSearchComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
// import { data } from '../../flight/components/flight-item-wrapper/data';
var moment = require("moment");
var FlightSearchComponent = /** @class */ (function () {
    function FlightSearchComponent(layTripStoreService, route, layTripService, flightService, router, location, actions$) {
        this.layTripStoreService = layTripStoreService;
        this.route = route;
        this.layTripService = layTripService;
        this.flightService = flightService;
        this.router = router;
        this.location = location;
        this.actions$ = actions$;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = true;
        this.isNotFound = false;
        this.subscriptions = [];
    }
    FlightSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        // const payload = {
        //   source_location: 'JAI',
        //   destination_location: 'DEL',
        //   departure_date: '2020-12-06',
        //   flight_class: 'Economy',
        //   adult_count: 1,
        //   child_count: 0,
        //   infant_count: 0,
        // };
        var payload = {};
        this.route.queryParams.forEach(function (params) {
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
            }
            else {
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
    FlightSearchComponent.prototype.getFlightSearchData = function (payload, tripType) {
        var _this = this;
        this.loading = true;
        // // DISPATCH CALL FOR GET FLIGHT SEARCH RESULT
        // this.layTripStoreService.dispatchGetFlightSearchResult(payload);
        // // SELECTOR CALL FOR GET FLIGHT SEARCH RESULT
        // this.subscriptions.push(this.layTripStoreService.selectFlightSearchResult().subscribe(res => {
        //   console.log(res);
        //   if (res) {
        //     this.flightSearchData = res.items;
        //     this.loading = false;
        //     this.isNotFound = false;
        //   }
        // }));
        if (payload && tripType === 'roundtrip') {
            // this.flightDetails = data.items;
            // this.filterFlightDetails = data;
            // this.loading = false;
            this.flightService.getRoundTripFlightSearchResult(payload).subscribe(function (res) {
                if (res) {
                    _this.loading = false;
                    _this.isNotFound = false;
                    _this.flightDetails = res.items;
                    _this.filterFlightDetails = res;
                }
            }, function (err) {
                if (err && err.status === 404) {
                    _this.isNotFound = true;
                    _this.loading = false;
                }
            });
        }
        else {
            this.flightService.getFlightSearchResult(payload).subscribe(function (res) {
                if (res) {
                    _this.loading = false;
                    _this.isNotFound = false;
                    _this.flightDetails = res.items;
                    _this.filterFlightDetails = res;
                }
            }, function (err) {
                if (err && err.status === 404) {
                    _this.isNotFound = true;
                    _this.loading = false;
                }
            });
        }
        // this.flightService.getFlightSearchResult(payload).subscribe((res: any) => {
        //   if (res) {
        //     this.loading = false;
        //     this.isNotFound = false;
        //     this.flightDetails = res.items;
        //     this.filterFlightDetails = res;
        //   }
        // }, err => {
        //   if (err && err.status === 404) {
        //     this.isNotFound = true;
        //     this.loading = false;
        //   }
        // });
    };
    FlightSearchComponent.prototype.getSearchItem = function (event) {
        var payload = {
            source_location: event.departure,
            destination_location: event.arrival,
            departure_date: event.departure_date,
            flight_class: event["class"],
            adult_count: parseInt(event.adult),
            child_count: parseInt(event.child),
            infant_count: parseInt(event.infant)
        };
        // this.getFlightSearchData(payload);
        this.router.navigate(['flight/search'], {
            skipLocationChange: false, queryParams: {
                trip: event.trip,
                departure: event.departure,
                arrival: event.arrival,
                departure_date: event.departure_date,
                "class": event["class"] ? event["class"] : 'Economy',
                adult: event.adult,
                child: event.child ? event.child : 0,
                infant: event.infant ? event.infant : 0
            },
            queryParamsHandling: 'merge'
        });
        // TRIP is round-trip then call this API
        if (event.trip === 'roundtrip') {
            this.getFlightSearchDataForRoundTrip(event);
        }
    };
    FlightSearchComponent.prototype.getFlightSearchDataForRoundTrip = function (event) {
        var payload = {
            source_location: event.departure,
            destination_location: event.arrival,
            departure_date: event.departure_date,
            arrival_date: event.arrival_date,
            flight_class: event["class"],
            adult_count: parseInt(event.adult),
            child_count: parseInt(event.child),
            infant_count: parseInt(event.infant)
        };
        this.router.navigate(['flight/search'], {
            skipLocationChange: false, queryParams: {
                trip: event.trip,
                departure: event.departure,
                arrival: event.arrival,
                departure_date: event.departure_date,
                arrival_date: event.arrival_date,
                "class": event["class"] ? event["class"] : 'Economy',
                adult: event.adult,
                child: event.child ? event.child : 0,
                infant: event.infant ? event.infant : 0
            },
            queryParamsHandling: 'merge'
        });
    };
    FlightSearchComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    FlightSearchComponent.prototype.sortFlight = function (event) {
        var key = event.key, order = event.order;
        if (key == 'total_duration') {
            this.flightDetails = this.sortByDuration(this.flightDetails, key, order);
        }
        else if (key == 'arrival') {
            this.flightDetails = this.sortByArrival(this.flightDetails, key, order);
        }
        else if (key == 'departure') {
            this.flightDetails = this.sortByDeparture(this.flightDetails, key, order);
        }
        else {
            this.flightDetails = this.sortJSON(this.flightDetails, key, order);
        }
        console.log(this.flightDetails);
    };
    FlightSearchComponent.prototype.sortJSON = function (data, key, way) {
        if (typeof data == "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
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
    FlightSearchComponent.prototype.sortByDuration = function (data, key, way) {
        if (typeof data == "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
                var x = moment(a.arrival_date + " " + a.arrival_time, 'DD/MM/YYYY hh:mm A').diff(moment(a.departure_date + " " + a.departure_time, 'DD/MM/YYYY hh:mm A'), 'seconds');
                var y = moment(b.arrival_date + " " + b.arrival_time, 'DD/MM/YYYY hh:mm A').diff(moment(b.departure_date + " " + b.departure_time, 'DD/MM/YYYY hh:mm A'), 'seconds');
                console.log(a.arrival_date + " " + a.arrival_time, a.departure_date + " " + a.departure_time, x, y, way);
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    FlightSearchComponent.prototype.sortByArrival = function (data, key, way) {
        if (typeof data == "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
                var x = moment(a.arrival_date + " " + a.arrival_time, 'DD/MM/YYYY hh:mm A').format("X");
                var y = moment(b.arrival_date + " " + b.arrival_time, 'DD/MM/YYYY hh:mm A').format("X");
                console.log(x, y, way);
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    FlightSearchComponent.prototype.sortByDeparture = function (data, key, way) {
        if (typeof data == "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
                var x = moment(a.departure_date + " " + a.departure_time, 'DD/MM/YYYY hh:mm A').format("X");
                var y = moment(b.departure_date + " " + b.departure_time, 'DD/MM/YYYY hh:mm A').format("X");
                console.log(x, y, way);
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    FlightSearchComponent.prototype.filterFlight = function (event) {
        this.flightDetails = event;
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
