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
exports.FlightSearchBarComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var forms_1 = require("@angular/forms");
var moment = require("moment");
var airports_1 = require("../../airports");
var FlightSearchBarComponent = /** @class */ (function () {
    function FlightSearchBarComponent(fb, flightService, commonFunction, cd, route) {
        var _this = this;
        this.fb = fb;
        this.flightService = flightService;
        this.commonFunction = commonFunction;
        this.cd = cd;
        this.route = route;
        this.searchBarInfo = new core_1.EventEmitter();
        this.calenderPrices = [];
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.monthYearArr = [];
        this.isCalenderPriceLoading = true;
        this.countryCode = '';
        // DATE OF FROM_DESTINATION & TO_DESTINATION
        this.isRoundTrip = false;
        this.searchFlightInfo = {
            trip: 'oneway',
            departure: '',
            arrival: '',
            departure_date: null,
            arrival_date: null,
            "class": '',
            adult: 1,
            child: null,
            infant: null
        };
        this.selectedAirport = {};
        this.loadingDeparture = false;
        this.loadingArrival = false;
        this.data = [];
        this.placeHolder1 = 'New York';
        this.placeHolder2 = 'Los Angeles';
        this.defaultSelected = 'NY, United States';
        // tslint:disable-next-line: quotemark
        this.totalPerson = 1;
        this.selectedTraveller = {
            adultValue: 1,
            childValue: 0,
            infantValue: 0,
            totalPerson: 1,
            "class": 'Economy'
        };
        this.searchedValue = [];
        this.departureAirport = {};
        this.arrivalAirport = {};
        this.departureDate = this.commonFunction.convertDateFormat(this.route.snapshot.queryParams['departure_date'], 'YYYY-MM-DD');
        this.returnDate = this.route.snapshot.queryParams['arrival_date'] ? this.commonFunction.convertDateFormat(this.route.snapshot.queryParams['arrival_date'], 'YYYY-MM-DD') : this.commonFunction.convertDateFormat(moment(this.route.snapshot.queryParams['departure_date']).add(1, "days"), 'YYYY-MM-DD');
        this.searchFlightInfo.departure = this.route.snapshot.queryParams['departure'];
        this.searchFlightInfo.arrival = this.route.snapshot.queryParams['arrival'];
        if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
            this.isRoundTrip = true;
        }
        else {
            this.isRoundTrip = false;
        }
        this.arrivalCode = this.route.snapshot.queryParams['arrival'];
        this.flightSearchForm = this.fb.group({
            fromDestination: [[forms_1.Validators.required]],
            toDestination: [[forms_1.Validators.required]]
        });
        var info = [];
        info.push({
            key: 'fromSearch',
            value: airports_1.airports[this.route.snapshot.queryParams['departure']]
        }, {
            key: 'toSearch',
            value: airports_1.airports[this.route.snapshot.queryParams['arrival']]
        });
        info.forEach(function (res) {
            if (res && res.key === 'fromSearch') {
                _this.data.push(res.value);
                _this.airportDefaultDestValue = "" + res.value.city;
                if (_this.airportDefaultDestValue) {
                    _this.defaultSelected = '';
                }
                _this.departureAirport = res.value;
            }
            if (res && res.key === 'toSearch') {
                res.value.display_name = res.value.city + "," + res.value.country + ",(" + res.value.code + ")," + res.value.name;
                _this.data.push(res.value);
                _this.airportDefaultArrivalValue = "" + res.value.city;
                if (_this.airportDefaultArrivalValue) {
                    _this.defaultSelected = '';
                }
                _this.arrivalAirport = res.value;
            }
        });
        this.flightDepartureMinDate = new Date();
        if (moment(this.departureDate).isBefore(moment().format('MM/DD/YYYY'))) {
            this.flightReturnMinDate = new Date();
        }
        else {
            this.flightReturnMinDate = new Date(this.departureDate);
        }
        this.countryCode = this.commonFunction.getUserCountry();
    }
    FlightSearchBarComponent.prototype.ngOnInit = function () {
        this.searchFlightInfo.departure = this.route.snapshot.queryParams['departure'];
        this.searchFlightInfo.arrival = this.route.snapshot.queryParams['arrival'];
        this.searchFlightInfo["class"] = this.route.snapshot.queryParams['class'];
    };
    FlightSearchBarComponent.prototype.searchAirportDeparture = function (searchItem) {
        var _this = this;
        this.loadingDeparture = true;
        this.flightService.searchAirport(searchItem).subscribe(function (response) {
            _this.data = response.map(function (res) {
                _this.loadingDeparture = false;
                return {
                    id: res.id,
                    name: res.name,
                    code: res.code,
                    city: res.city,
                    country: res.country,
                    display_name: res.city + "," + res.country + ",(" + res.code + ")," + res.name,
                    parentId: res.parentId
                };
            });
        }, function (error) {
            _this.loadingDeparture = false;
        });
    };
    FlightSearchBarComponent.prototype.searchAirportArrival = function (searchItem) {
        var _this = this;
        this.loadingArrival = true;
        this.flightService.searchAirport(searchItem).subscribe(function (response) {
            _this.data = response.map(function (res) {
                _this.loadingArrival = false;
                return {
                    id: res.id,
                    name: res.name,
                    code: res.code,
                    city: res.city,
                    country: res.country,
                    display_name: res.city + "," + res.country + ",(" + res.code + ")," + res.name,
                    parentId: res.parentId
                };
            });
        }, function (error) {
            _this.loadingArrival = false;
        });
    };
    FlightSearchBarComponent.prototype.changeSearchDeparture = function (event) {
        if (event.term.length > 2) {
            this.searchAirportDeparture(event.term);
        }
    };
    FlightSearchBarComponent.prototype.changeSearchArrival = function (event) {
        if (event.term.length > 2) {
            this.searchAirportArrival(event.term);
        }
    };
    FlightSearchBarComponent.prototype.tabChange = function (value) {
        this.searchFlightInfo.trip = value;
    };
    FlightSearchBarComponent.prototype.selectEvent = function (event, item) {
        if (!event) {
            this.placeHolder1 = this.placeHolder1;
            this.placeHolder2 = this.placeHolder2;
            this.defaultSelected = this.defaultSelected;
        }
        this.selectedAirport = event;
        this.defaultSelected = '';
        if (event && event.code && item.key === 'fromSearch') {
            this.searchFlightInfo.departure = event.code;
            this.departureAirport = event;
            this.searchedValue.push({ key: 'fromSearch', value: event });
        }
        else if (event && event.code && item.key === 'toSearch') {
            this.searchFlightInfo.arrival = event.code;
            this.searchedValue.push({ key: 'toSearch', value: event });
            this.arrivalAirport = event;
        }
    };
    FlightSearchBarComponent.prototype.onRemove = function (event, item) {
        if (item.key === 'fromSearch') {
            this.departureAirport = Object.create(null);
        }
        else if (item.key === 'toSearch') {
            this.arrivalAirport = Object.create(null);
        }
    };
    FlightSearchBarComponent.prototype.changeTravellerInfo = function (event) {
        this.searchFlightInfo.adult = event.adult;
        this.searchFlightInfo.child = event.child;
        this.searchFlightInfo.infant = event.infant;
        this.searchFlightInfo["class"] = event["class"];
        this.totalPerson = event.totalPerson;
    };
    FlightSearchBarComponent.prototype.searchFlights = function () {
        this.searchFlightInfo.child = this.searchFlightInfo.child ? this.searchFlightInfo.child : 0;
        this.searchFlightInfo.infant = this.searchFlightInfo.infant ? this.searchFlightInfo.infant : 0;
        this.searchFlightInfo["class"] = this.searchFlightInfo["class"] ? this.searchFlightInfo["class"] : 'Economy';
        this.searchFlightInfo.departure_date = moment(this.departureDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
        if (this.isRoundTrip === true) {
            this.searchFlightInfo.trip = 'roundtrip';
            this.searchFlightInfo.arrival_date = moment(this.returnDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }
        if (!this.isRoundTrip && this.totalPerson &&
            this.searchFlightInfo.departure_date && this.searchFlightInfo.departure && this.searchFlightInfo.arrival
            && this.searchFlightInfo.trip === 'oneway') {
            localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
            this.searchBarInfo.emit(this.searchFlightInfo);
        }
        else if (this.isRoundTrip === true && this.totalPerson &&
            this.searchFlightInfo.departure_date && this.searchFlightInfo.arrival_date
            && this.searchFlightInfo.departure && this.searchFlightInfo.arrival
            && this.searchFlightInfo.trip === 'roundtrip') {
            localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
            this.searchBarInfo.emit(this.searchFlightInfo);
        }
    };
    FlightSearchBarComponent.prototype.toggleOnewayRoundTrip = function (type) {
        if (type === 'roundtrip') {
            this.isRoundTrip = true;
            this.searchFlightInfo.trip = 'roundtrip';
        }
        else {
            this.isRoundTrip = false;
            this.searchFlightInfo.trip = 'oneway';
            delete this.searchFlightInfo.arrival_date;
        }
    };
    FlightSearchBarComponent.prototype.departureDateUpdate = function (date) {
        this.returnDate = new Date(date);
        this.flightReturnMinDate = new Date(date);
    };
    FlightSearchBarComponent.prototype.dateChange = function (type, direction) {
        if (type == 'departure') {
            if (direction === 'previous') {
                if (moment(this.departureDate).isAfter(moment(new Date()))) {
                    this.departureDate = new Date(moment(this.departureDate).subtract(1, 'days').format('MM/DD/YYYY'));
                }
            }
            else {
                this.departureDate = new Date(moment(this.departureDate).add(1, 'days').format('MM/DD/YYYY'));
                if (moment(this.departureDate).isAfter(this.returnDate)) {
                    this.returnDate = new Date(moment(this.returnDate).add(1, 'days').format('MM/DD/YYYY'));
                }
            }
            this.flightReturnMinDate = new Date(this.departureDate);
        }
        if (type == 'arrival') {
            if (direction === 'previous') {
                if (moment(this.departureDate).isBefore(this.returnDate)) {
                    this.returnDate = new Date(moment(this.returnDate).subtract(1, 'days').format('MM/DD/YYYY'));
                }
            }
            else {
                this.returnDate = new Date(moment(this.returnDate).add(1, 'days').format('MM/DD/YYYY'));
            }
        }
    };
    FlightSearchBarComponent.prototype.getPrice = function (d, m, y) {
        var month = parseInt(m) + 1;
        var day = d.toString().length == 1 ? '0' + d : d;
        month = month.toString().length == 1 ? '0' + month : month;
        var date = day + "/" + month + "/" + y;
        var price = this.calenderPrices.find(function (d) { return d.date == date; });
        if (price) {
            if (price.secondary_start_price > 0) {
                return "$" + price.secondary_start_price.toFixed(2);
            }
            return "$" + price.price.toFixed(2);
        }
    };
    FlightSearchBarComponent.prototype.ngOnChanges = function (changes) {
        var departureDate = this.route.snapshot.queryParams['departure_date'];
        var departureDates = departureDate.split("-");
        this.monthYearArr.push(departureDates[1] + "-" + departureDates[0]);
        if (typeof changes['calenderPrices'].currentValue != 'undefined' && changes['calenderPrices'].firstChange == false) {
            this.isCalenderPriceLoading = false;
        }
    };
    FlightSearchBarComponent.prototype.changeMonth = function (event) {
        var _this = this;
        if (!this.isRoundTrip) {
            var month = event.month;
            month = month.toString().length == 1 ? '0' + month : month;
            var monthYearName = month + "-" + event.year;
            if (!this.monthYearArr.includes(monthYearName)) {
                this.monthYearArr.push(monthYearName);
                var startDate = moment([event.year, event.month - 1]);
                var endDate = moment(startDate).endOf('month');
                startDate = moment(startDate.toDate()).format("YYYY-MM-DD");
                endDate = moment(endDate.toDate()).format("YYYY-MM-DD");
                if (!moment().isBefore(startDate)) {
                    startDate = moment().format("YYYY-MM-DD");
                }
                var payload = {
                    source_location: this.route.snapshot.queryParams['departure'],
                    destination_location: this.route.snapshot.queryParams['arrival'],
                    flight_class: this.route.snapshot.queryParams['class'],
                    adult_count: this.route.snapshot.queryParams['adult'],
                    child_count: this.route.snapshot.queryParams['child'],
                    infant_count: this.route.snapshot.queryParams['infant'],
                    start_date: startDate,
                    end_date: endDate
                };
                this.isCalenderPriceLoading = true;
                this.flightService.getFlightCalenderDate(payload).subscribe(function (res) {
                    _this.isCalenderPriceLoading = false;
                    _this.calenderPrices = __spreadArrays(_this.calenderPrices, res);
                }, function (err) {
                    _this.isCalenderPriceLoading = false;
                });
            }
        }
    };
    FlightSearchBarComponent.prototype.swapAirport = function () {
        var temp = this.airportDefaultDestValue;
        this.airportDefaultDestValue = this.airportDefaultArrivalValue;
        this.airportDefaultArrivalValue = temp;
        var tempAirport = this.departureAirport;
        this.departureAirport = this.arrivalAirport;
        this.arrivalAirport = tempAirport;
        var tempCode = this.searchFlightInfo.departure;
        this.searchFlightInfo.departure = this.searchFlightInfo.arrival;
        this.searchFlightInfo.arrival = tempCode;
    };
    __decorate([
        core_1.Output()
    ], FlightSearchBarComponent.prototype, "searchBarInfo");
    __decorate([
        core_1.Input()
    ], FlightSearchBarComponent.prototype, "calenderPrices");
    FlightSearchBarComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-search-bar',
            templateUrl: './flight-search-bar.component.html',
            styleUrls: ['./flight-search-bar.component.scss']
        })
    ], FlightSearchBarComponent);
    return FlightSearchBarComponent;
}());
exports.FlightSearchBarComponent = FlightSearchBarComponent;
