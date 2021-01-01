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
exports.FlightSearchWidgetComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../environments/environment");
var airports_1 = require("../../flight/airports");
var moment = require("moment");
var FlightSearchWidgetComponent = /** @class */ (function () {
    function FlightSearchWidgetComponent(genericService, commonFunction, fb, router, route, renderer, flightService) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.route = route;
        this.renderer = renderer;
        this.flightService = flightService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.moduleList = {};
        this.calenderPrices = [];
        this.switchBtnValue = false;
        this.isRoundTrip = false;
        this.flightSearchFormSubmitted = false;
        this.isCalenderPriceLoading = true;
        // DATE OF FROM_DESTINATION & TO_DESTINATION
        this.fromSearch = airports_1.airports['JFK'];
        this.monthYearArr = [];
        this.toSearch = airports_1.airports['PUJ'];
        //toDestinationCode = this.toSearch.code;
        //arrivalCity = this.toSearch.city;
        //arrivalAirportCountry = `${this.toSearch.code}, ${this.toSearch.country}`;
        //toAirport = airports[this.toDestinationCode];
        this.locale = {
            format: 'MM/DD/YYYY',
            displayFormat: 'MM/DD/YYYY'
        };
        this.departureDate = new Date(moment().add(31, 'days').format("MM/DD/YYYY"));
        this.returnDate = new Date(moment().add(38, 'days').format("MM/DD/YYYY"));
        this.totalPerson = 1;
        this.lowMinPrice = 0;
        this.midMinPrice = 0;
        this.highMinPrice = 0;
        this.calPrices = false;
        this.searchFlightInfo = {
            trip: 'oneway',
            departure: this.fromSearch.code,
            arrival: this.toSearch.code,
            departure_date: moment().add(1, 'months').format("YYYY-MM-DD"),
            arrival_date: '',
            "class": 'Economy',
            adult: 1,
            child: null,
            infant: null
        };
        this.searchedValue = [];
        this.fromSearch['display_name'] = this.fromSearch.city + "," + this.fromSearch.country + ",(" + this.fromSearch.code + ")," + this.fromSearch.name;
        this.toSearch['display_name'] = this.toSearch.city + "," + this.toSearch.country + ",(" + this.toSearch.code + ")," + this.toSearch.name;
        this.flightSearchForm = this.fb.group({
            fromDestination: ['', [forms_1.Validators.required]],
            toDestination: ['', [forms_1.Validators.required]],
            departureDate: [[forms_1.Validators.required]],
            returnDate: [[forms_1.Validators.required]]
        });
        this.flightDepartureMinDate = new Date();
        this.flightReturnMinDate = this.departureDate;
        this.countryCode = this.commonFunction.getUserCountry();
        this.rangeDates = [this.departureDate, this.returnDate];
    }
    FlightSearchWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.countryCode = this.commonFunction.getUserCountry();
        if (this.calenderPrices.length == 0) {
            this.isCalenderPriceLoading = false;
        }
        this.route.queryParams.subscribe(function (params) {
            if (Object.keys(params).length > 0) {
                _this.calPrices = true;
                _this.fromSearch = airports_1.airports[params['departure']];
                //this.fromDestinationCode = this.fromSearch.code;
                //this.departureCity = this.fromSearch.city;
                //this.departureAirportCountry =`${this.fromSearch.code}, ${this.fromSearch.country}`
                //this.fromAirport = airports[this.fromDestinationCode];
                _this.toSearch = airports_1.airports[params['arrival']];
                //this.toDestinationCode = this.toSearch.code;
                //this.arrivalCity = this.toSearch.city;
                //this.arrivalAirportCountry = `${this.toSearch.code}, ${this.toSearch.country}`;
                //this.toAirport = airports[this.toDestinationCode];
                _this.toggleOnewayRoundTrip(params['trip']);
                _this.searchFlightInfo["class"] = params['class'];
                _this.departureDate = new Date(params['departure_date']);
                // this.returnDate = new Date(params['arrival_date']);
                _this.returnDate = params['arrival_date'] ? new Date(params['arrival_date']) : new Date(moment(params['departure_date']).add(7, 'days').format('MM/DD/YYYY'));
                _this.rangeDates = [_this.departureDate, _this.returnDate];
            }
            else {
                _this.calPrices = false;
            }
        });
    };
    FlightSearchWidgetComponent.prototype.ngOnChanges = function (changes) {
        if (typeof changes['calenderPrices'].currentValue != 'undefined' && changes['calenderPrices'].firstChange == false) {
            this.isCalenderPriceLoading = false;
            // this.getMinimumPricesList(changes['calenderPrices'].currentValue);
        }
    };
    FlightSearchWidgetComponent.prototype.destinationChangedValue = function (event) {
        if (event && event.key && event.key === 'fromSearch') {
            //this.fromDestinationCode = event.value.code;
            this.fromSearch = event.value;
            //this.departureCity = this.fromSearch.city;
            //this.departureAirportCountry = `${this.fromSearch.code}, ${this.fromSearch.country}`;
            this.searchedValue.push({ key: 'fromSearch', value: this.fromSearch });
        }
        else if (event && event.key && event.key === 'toSearch') {
            this.toSearch = event.value;
            //this.arrivalCity = this.toSearch.city;
            //this.arrivalAirportCountry = `${this.toSearch.code}, ${this.toSearch.country}`;
            this.searchedValue.push({ key: 'toSearch', value: this.toSearch });
        }
        this.searchFlightInfo.departure = this.fromSearch.code;
        this.searchFlightInfo.arrival = this.toSearch.code;
    };
    FlightSearchWidgetComponent.prototype.getDateWithFormat = function (date) {
        this.searchFlightInfo.departure_date = this.commonFunction.parseDateWithFormat(date).departuredate;
        // this.searchFlightInfo.arrival_date = this.commonFunction.parseDateWithFormat(date).returndate;
    };
    FlightSearchWidgetComponent.prototype.changeTravellerInfo = function (event) {
        this.searchFlightInfo.adult = event.adult;
        this.searchFlightInfo.child = event.child;
        this.searchFlightInfo.infant = event.infant;
        this.totalPerson = event.totalPerson;
        this.searchedValue.push({ key: 'travellers', value: event });
    };
    FlightSearchWidgetComponent.prototype.changeEconomyInfo = function (event) {
        this.searchFlightInfo["class"] = event;
    };
    FlightSearchWidgetComponent.prototype.searchFlights = function () {
        this.flightSearchFormSubmitted = true;
        var queryParams = {};
        queryParams.trip = this.isRoundTrip ? 'roundtrip' : 'oneway';
        queryParams.departure = this.searchFlightInfo.departure;
        queryParams.arrival = this.searchFlightInfo.arrival;
        queryParams.departure_date = moment(this.departureDate).format('YYYY-MM-DD');
        if (this.isRoundTrip === true) {
            queryParams.arrival_date = moment(this.returnDate).format('YYYY-MM-DD');
        }
        queryParams["class"] = this.searchFlightInfo["class"] ? this.searchFlightInfo["class"] : 'Economy';
        queryParams.adult = this.searchFlightInfo.adult;
        queryParams.child = this.searchFlightInfo.child ? this.searchFlightInfo.child : 0;
        queryParams.infant = this.searchFlightInfo.infant ? this.searchFlightInfo.infant : 0;
        if (this.searchFlightInfo && this.totalPerson &&
            this.departureDate && this.searchFlightInfo.departure && this.searchFlightInfo.arrival) {
            localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
            this.router.navigate(['flight/search'], {
                queryParams: queryParams,
                queryParamsHandling: 'merge'
            });
        }
    };
    FlightSearchWidgetComponent.prototype.toggleOnewayRoundTrip = function (type) {
        if (type === 'roundtrip') {
            this.isRoundTrip = true;
        }
        else {
            this.isRoundTrip = false;
        }
    };
    FlightSearchWidgetComponent.prototype.departureDateUpdate = function (date) {
        this.returnDate = new Date(date);
        this.flightReturnMinDate = new Date(date);
    };
    FlightSearchWidgetComponent.prototype.dateChange = function (type, direction) {
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
    FlightSearchWidgetComponent.prototype.swapAirport = function () {
        var temp = this.searchFlightInfo.departure;
        this.searchFlightInfo.departure = this.searchFlightInfo.arrival;
        this.searchFlightInfo.arrival = temp;
        /* let tempCity = this.departureCity;
        this.departureCity = this.arrivalCity;
        this.arrivalCity = tempCity; */
        var tempAirport = this.fromSearch;
        this.fromSearch = this.toSearch;
        this.toSearch = tempAirport;
    };
    FlightSearchWidgetComponent.prototype.returnDateUpdate = function (date) {
        // this is only for closing date range picker, after selecting both dates
        if (this.rangeDates[1]) { // If second date is selected
            this.dateFilter.hideOverlay();
        }
        ;
        if (this.rangeDates[0] && this.rangeDates[1]) {
            this.departureDate = this.rangeDates[0];
            this.flightDepartureMinDate = this.rangeDates[0];
            this.returnDate = this.rangeDates[1];
            this.rangeDates = [this.departureDate, this.returnDate];
            // this.checkOutDate = this.rangeDates[1];
            // this.checkOutMinDate = this.rangeDates[1];
            // this.searchHotelInfo.check_in = this.checkInDate;
            // this.searchHotelInfo.check_out = this.checkOutDate;
        }
    };
    FlightSearchWidgetComponent.prototype.getPrice = function (d, m, y) {
        var month = parseInt(m) + 1;
        var day = d.toString().length == 1 ? '0' + d : d;
        month = month.toString().length == 1 ? '0' + month : month;
        var date = day + "/" + month + "/" + y;
        var price = this.calenderPrices.find(function (d) { return d.date == date; });
        this.getMinimumPricesList(this.calenderPrices);
        if (price) {
            if (price.secondary_start_price > 0) {
                return "$" + price.secondary_start_price.toFixed(2);
            }
            return "$" + price.price.toFixed(2);
        }
    };
    FlightSearchWidgetComponent.prototype.getPriceClass = function (d, m, y) {
        var month = parseInt(m) + 1;
        var day = d.toString().length == 1 ? '0' + d : d;
        month = month.toString().length == 1 ? '0' + month : month;
        var date = day + "/" + month + "/" + y;
        var price = this.calenderPrices.find(function (d) { return d.date == date; });
        if (price) {
            if (price.secondary_start_price > 0) {
                return "" + price.flag;
            }
            return "" + price.flag;
        }
    };
    FlightSearchWidgetComponent.prototype.changeMonth = function (event) {
        var _this = this;
        if (!this.isRoundTrip) {
            var month = event.month;
            month = month.toString().length == 1 ? '0' + month : month;
            var monthYearName = month + "-" + event.year;
            if (!this.monthYearArr.includes(monthYearName) && this.calPrices) {
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
                    _this.getMinimumPricesList(res);
                }, function (err) {
                    _this.isCalenderPriceLoading = false;
                });
            }
        }
    };
    FlightSearchWidgetComponent.prototype.getMinimumPricesList = function (prices) {
        this.lowMinPrice = this.getMinPrice(prices.filter(function (book) { return book.flag === 'low'; }));
        this.midMinPrice = this.getMinPrice(prices.filter(function (book) { return book.flag === 'medium'; }));
        this.highMinPrice = this.getMinPrice(prices.filter(function (book) { return book.flag === 'high'; }));
        console.log(this.lowMinPrice, this.midMinPrice, this.highMinPrice);
    };
    FlightSearchWidgetComponent.prototype.getMinPrice = function (prices) {
        return prices.reduce(function (min, p) {
            if (p.secondary_start_price > 0) {
                return p.secondary_start_price < min ? p.secondary_start_price : min, prices[0].secondary_start_price;
            }
            else {
                return p.price < min ? p.price : min, prices[0].price;
            }
        }, 0);
    };
    __decorate([
        core_1.ViewChild('dateFilter', /* TODO: add static flag */ undefined)
    ], FlightSearchWidgetComponent.prototype, "dateFilter");
    __decorate([
        core_1.Input()
    ], FlightSearchWidgetComponent.prototype, "calenderPrices");
    FlightSearchWidgetComponent = __decorate([
        core_1.Component({
            selector: 'app-flight-search-widget',
            templateUrl: './flight-search-widget.component.html',
            styleUrls: ['./flight-search-widget.component.scss']
        })
    ], FlightSearchWidgetComponent);
    return FlightSearchWidgetComponent;
}());
exports.FlightSearchWidgetComponent = FlightSearchWidgetComponent;
