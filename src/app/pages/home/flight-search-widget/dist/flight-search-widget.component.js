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
    function FlightSearchWidgetComponent(genericService, commonFunction, fb, router, route, renderer, flightService, homeService) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.route = route;
        this.renderer = renderer;
        this.flightService = flightService;
        this.homeService = homeService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.moduleList = {};
        this.calenderPrices = [];
        this.switchBtnValue = false;
        this.isRoundTrip = false;
        this.flightSearchFormSubmitted = false;
        this.isCalenderPriceLoading = true;
        // DATE OF FROM_DESTINATION & TO_DESTINATION
        //fromSearch : any = airports['JFK'];
        this.fromSearch = {};
        this.monthYearArr = [];
        //toSearch:any = airports['PUJ'];
        this.toSearch = {};
        this.locale = {
            format: 'MM/DD/YYYY',
            displayFormat: 'MM/DD/YYYY'
        };
        this.customStartDateValidation = "2021-06-01";
        this.customEndDateValidation = "2021-06-07";
        this.returnDate = new Date(moment(this.customEndDateValidation).format("MM/DD/YYYY"));
        this.totalPerson = 1;
        this.calPrices = false;
        this.showFromAirportSuggestion = false;
        this.showToAirportSuggestion = false;
        this.thisElementClicked = false;
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
        if (typeof this.fromSearch.city != 'undefined') {
            this.fromSearch['display_name'] = this.fromSearch.city + "," + this.fromSearch.country + ",(" + this.fromSearch.code + ")," + this.fromSearch.name;
            this.toSearch['display_name'] = this.toSearch.city + "," + this.toSearch.country + ",(" + this.toSearch.code + ")," + this.toSearch.name;
        }
        this.flightSearchForm = this.fb.group({
            fromDestination: ['', [forms_1.Validators.required]],
            toDestination: ['', [forms_1.Validators.required]],
            departureDate: [[forms_1.Validators.required]],
            returnDate: [[forms_1.Validators.required]]
        });
        this.setFlightDepartureMinDate();
        this.flightReturnMinDate = this.departureDate;
        this.countryCode = this.commonFunction.getUserCountry();
        this.rangeDates = [this.departureDate, this.returnDate];
    }
    FlightSearchWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.departureDate = moment(this.customStartDateValidation).toDate();
        if (new Date(this.customStartDateValidation) <= new Date()) {
            this.departureDate = moment().add('30', 'days').toDate();
        }
        window.scrollTo(0, 0);
        this.countryCode = this.commonFunction.getUserCountry();
        if (this.calenderPrices.length == 0) {
            this.isCalenderPriceLoading = false;
        }
        this.route.queryParams.subscribe(function (params) {
            if (Object.keys(params).length > 0 && window.location.pathname == '/flight/search') {
                //delete BehaviorSubject in the listing page
                _this.homeService.removeToString('flight');
                _this.calPrices = true;
                _this.fromSearch = airports_1.airports[params['departure']];
                _this.toSearch = airports_1.airports[params['arrival']];
                //this.fromSearch['display_name'] = `${this.fromSearch.city},${this.fromSearch.country},(${this.fromSearch.code}),${this.fromSearch.name}`;
                //this.toSearch['display_name'] = `${this.toSearch.city},${this.toSearch.country},(${this.toSearch.code}),${this.toSearch.name}`;
                _this.searchFlightInfo.departure = _this.fromSearch.code;
                _this.searchFlightInfo.arrival = _this.toSearch.code;
                _this.toggleOnewayRoundTrip(params['trip']);
                localStorage.setItem('__from', params['departure']);
                localStorage.setItem('__to', params['arrival']);
                _this.searchFlightInfo["class"] = params['class'];
                _this.departureDate = moment(params['departure_date']).toDate();
                // console.log(params['departure_date'], moment(params['departure_date']).format("YYYY-MM-DD"))
                if (moment(_this.departureDate).format("YYYY-MM-DD") < _this.customStartDateValidation) {
                    // this.router.navigate(['/flight/flight-not-found'])
                }
                _this.currentMonth = moment(_this.departureDate).format("MM");
                _this.currentYear = moment(_this.departureDate).format("YYYY");
                // this.returnDate = new Date(params['arrival_date']);
                _this.returnDate = params['arrival_date'] ? moment(params['arrival_date']).toDate() : new Date(moment(params['departure_date']).add(7, 'days').format('MM/DD/YYYY'));
                _this.rangeDates = [_this.departureDate, _this.returnDate];
            }
            else {
                _this.calPrices = false;
            }
        });
        this.homeService.getToString.subscribe(function (toSearchString) {
            if (typeof toSearchString != 'undefined' && Object.keys(toSearchString).length > 0) {
                var keys = toSearchString;
                localStorage.setItem('__to', keys);
                // this.toSearch = null;   
                _this.toSearch = airports_1.airports[keys];
                _this.flightSearchForm.controls.fromDestination.setValue('');
                _this.fromSearch = [];
                if (!_this.isRoundTrip) {
                    _this.departureDate = moment(_this.customStartDateValidation).add(1, 'M').toDate();
                }
                else {
                    _this.rangeDates = [moment(_this.customStartDateValidation).add(1, 'M').toDate(), moment(_this.customStartDateValidation).add(38, 'days').toDate()];
                    _this.searchFlightInfo.arrival = _this.toSearch.code;
                }
            }
        });
        //delete BehaviorSubject at the end
        this.homeService.removeToString('flight');
        this.lowMinPrice = this.midMinPrice = this.highMinPrice = 0;
    };
    FlightSearchWidgetComponent.prototype.ngOnChanges = function (changes) {
    };
    FlightSearchWidgetComponent.prototype.setFlightDepartureMinDate = function () {
        var date = new Date();
        var curretdate = moment().format();
        var juneDate = moment(this.customStartDateValidation).format('YYYY-MM-DD');
        var daysDiffFromCurToJune = moment(this.customEndDateValidation, "YYYY-MM-DD").diff(moment(curretdate, "YYYY-MM-DD"), 'days');
        date.setDate(date.getDate() + 30);
        if (curretdate < juneDate && daysDiffFromCurToJune > 30) {
            this.flightDepartureMinDate = moment(juneDate).toDate();
            this.departureDate = this.flightDepartureMinDate;
        }
        else if (daysDiffFromCurToJune < 30) {
            this.flightDepartureMinDate = date;
            this.departureDate = date;
        }
        else {
            this.departureDate = date;
            this.flightDepartureMinDate = date;
        }
    };
    FlightSearchWidgetComponent.prototype.destinationChangedValue = function (event) {
        if (event && event.key && event.key === 'fromSearch') {
            this.fromSearch = event.value;
            this.searchedValue.push({ key: 'fromSearch', value: this.fromSearch });
        }
        else if (event && event.key && event.key === 'toSearch') {
            this.toSearch = event.value;
            this.searchedValue.push({ key: 'toSearch', value: this.toSearch });
        }
        this.searchFlightInfo.departure = this.fromSearch.code;
        this.searchFlightInfo.arrival = this.toSearch.code;
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
        var _this = this;
        this.flightSearchFormSubmitted = true;
        var queryParams = {};
        queryParams.trip = this.isRoundTrip ? 'roundtrip' : 'oneway';
        queryParams.departure = this.fromSearch.code ? this.fromSearch.code : this.searchFlightInfo.departure;
        queryParams.arrival = this.toSearch.code ? this.toSearch.code : this.searchFlightInfo.arrival;
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
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                _this.router.navigate(['flight/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
            });
        }
    };
    FlightSearchWidgetComponent.prototype.toggleOnewayRoundTrip = function (type) {
        if (type === 'roundtrip') {
            this.returnDate = moment(this.departureDate).add(7, 'days').toDate();
            this.rangeDates = [this.departureDate, this.returnDate];
            this.isRoundTrip = true;
        }
        else {
            this.isRoundTrip = false;
        }
    };
    FlightSearchWidgetComponent.prototype.selectDepartureDate = function (date) {
        this.departureDate = moment(date).toDate();
        this.returnDate = new Date(date);
        this.flightReturnMinDate = new Date(date);
    };
    FlightSearchWidgetComponent.prototype.swapAirport = function () {
        var temp = this.searchFlightInfo.departure;
        this.searchFlightInfo.departure = this.searchFlightInfo.arrival;
        this.searchFlightInfo.arrival = temp;
        var tempAirport = this.fromSearch;
        this.fromSearch = this.toSearch;
        this.toSearch = tempAirport;
        if (this.fromSearch.code) {
            localStorage.setItem('__from', this.fromSearch.code);
        }
        if (this.toSearch.code) {
            localStorage.setItem('__to', this.toSearch.code);
        }
    };
    FlightSearchWidgetComponent.prototype.selectReturnDateUpdate = function (date) {
        // this is only for closing date range picker, after selecting both dates
        if (this.rangeDates[1]) { // If second date is selected
            this.dateFilter.hideOverlay();
        }
        ;
        if (this.rangeDates[0] && this.rangeDates[1]) {
            this.departureDate = this.rangeDates[0];
            // this.flightDepartureMinDate = this.rangeDates[0];
            this.returnDate = this.rangeDates[1];
            this.rangeDates = [this.departureDate, this.returnDate];
        }
    };
    FlightSearchWidgetComponent.prototype.getPrice = function (d, m, y) {
        this.lowMinPrice = this.midMinPrice = this.highMinPrice = 0;
        // this.currentMonth = m.toString().length == 1 ? '0' + m : m;
        // this.currentYear = y;
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
        var currentDate = new Date();
        // 1 June validation apply
        var juneDate = moment(this.customStartDateValidation).format('YYYY-MM-DD');
        this.lowMinPrice = this.highMinPrice = this.midMinPrice = 0;
        this.route.queryParams.subscribe(function (params) {
            _this.calPrices = false;
            if (Object.keys(params).length > 0) {
                _this.calPrices = true;
            }
        });
        this.currentMonth = event.month.toString().length == 1 ? '0' + event.month : event.month;
        this.currentYear = event.year;
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
                var GivenDate = new Date(endDate);
                if (startDate >= juneDate) { //june calendar validation        
                    if (GivenDate > currentDate || currentDate < new Date(startDate)) {
                        this.lowMinPrice = this.highMinPrice = this.midMinPrice = 0;
                        this.isCalenderPriceLoading = this.calPrices = true;
                        this.flightService.getFlightCalenderDate(payload).subscribe(function (res) {
                            _this.calenderPrices = __spreadArrays(_this.calenderPrices, res);
                            _this.isCalenderPriceLoading = false;
                        }, function (err) {
                            _this.calPrices = false;
                            _this.isCalenderPriceLoading = false;
                        });
                    }
                    else {
                        this.calPrices = this.isCalenderPriceLoading = false;
                    }
                }
            }
        }
    };
    FlightSearchWidgetComponent.prototype.getPriceLabel = function (type) {
        var _this = this;
        this.isCalenderPriceLoading = true;
        if (type == 'lowMinPrice') {
            var lowMinPrice = this.calenderPrices.filter(function (item) { return item.flag === 'low' && _this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM') && _this.currentYear == moment(item.date, 'DD/MM/YYYY').format('YYYY'); });
            if (typeof lowMinPrice != 'undefined' && lowMinPrice.length) {
                this.lowMinPrice = this.getMinPrice(lowMinPrice);
            }
            this.isCalenderPriceLoading = false;
            return this.lowMinPrice.toFixed(2);
        }
        if (type == 'midMinPrice') {
            var midMinPrice = this.calenderPrices.filter(function (item) { return item.flag === 'medium' && _this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM') && _this.currentYear == moment(item.date, 'DD/MM/YYYY').format('YYYY'); });
            if (typeof midMinPrice != 'undefined' && midMinPrice.length) {
                this.midMinPrice = this.getMinPrice(midMinPrice);
            }
            this.isCalenderPriceLoading = false;
            return this.midMinPrice.toFixed(2);
        }
        if (type == 'highMinPrice') {
            var highMinPrice = this.calenderPrices.filter(function (item) { return item.flag === 'high' && _this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM') && _this.currentYear == moment(item.date, 'DD/MM/YYYY').format('YYYY'); });
            if (typeof highMinPrice != 'undefined' && highMinPrice.length) {
                this.highMinPrice = this.getMinPrice(highMinPrice);
            }
            this.isCalenderPriceLoading = false;
            return this.highMinPrice.toFixed(2);
        }
    };
    FlightSearchWidgetComponent.prototype.getMinPrice = function (prices) {
        if (prices.length > 0) {
            var values = prices.map(function (v) {
                if (v.secondary_start_price > 0) {
                    if (v.secondary_start_price < 5) {
                        return '$5.00';
                    }
                    return v.secondary_start_price;
                }
                else {
                    if (v.price < 5) {
                        return '$5.00';
                    }
                    return v.price;
                }
            });
            return Math.min.apply(null, values);
        }
        else {
            return 0;
        }
    };
    FlightSearchWidgetComponent.prototype.ngOnDestroy = function () {
        localStorage.removeItem('__from');
        localStorage.removeItem('__to');
    };
    FlightSearchWidgetComponent.prototype.showAirportSuggestion = function (type) {
        this.showFromAirportSuggestion = false;
        this.showToAirportSuggestion = false;
        if (type == 'from') {
            this.showFromAirportSuggestion = true;
        }
        if (type == 'to') {
            this.showToAirportSuggestion = true;
        }
    };
    FlightSearchWidgetComponent.prototype.closeAirportSuggestion = function (type) {
        if (type == 'from') {
            this.showFromAirportSuggestion = false;
        }
        if (type == 'to') {
            this.showToAirportSuggestion = false;
        }
    };
    FlightSearchWidgetComponent.prototype.clickOutside = function () {
        if (!this.thisElementClicked) {
            this.showFromAirportSuggestion = false;
            this.showToAirportSuggestion = false;
        }
        this.thisElementClicked = false;
    };
    FlightSearchWidgetComponent.prototype.clickInside = function () {
        this.thisElementClicked = true;
    };
    FlightSearchWidgetComponent.prototype.searchAirport = function (event) {
        console.log("event", event);
    };
    FlightSearchWidgetComponent.prototype.searchItem = function (data) {
        if (data.type == 'fromSearch') {
            if (data.key.length > 0) {
                this.showFromAirportSuggestion = false;
            }
            else {
                this.showFromAirportSuggestion = true;
            }
        }
        else {
            if (data.key.length > 0) {
                this.showToAirportSuggestion = false;
            }
            else {
                this.showToAirportSuggestion = true;
            }
        }
    };
    FlightSearchWidgetComponent.prototype.airportValueChange = function (event) {
        if (event.key == 'fromSearch') {
            this.fromSearch = event.value;
            this.searchedValue.push({ key: 'fromSearch', value: this.fromSearch });
        }
        else {
            this.toSearch = event.value;
            this.searchedValue.push({ key: 'toSearch', value: this.toSearch });
        }
        this.searchFlightInfo.departure = this.fromSearch.code;
        this.searchFlightInfo.arrival = this.toSearch.code;
    };
    __decorate([
        core_1.ViewChild('dateFilter', /* TODO: add static flag */ undefined)
    ], FlightSearchWidgetComponent.prototype, "dateFilter");
    __decorate([
        core_1.Input()
    ], FlightSearchWidgetComponent.prototype, "calenderPrices");
    __decorate([
        core_1.HostListener('document:click')
    ], FlightSearchWidgetComponent.prototype, "clickOutside");
    __decorate([
        core_1.HostListener('click')
    ], FlightSearchWidgetComponent.prototype, "clickInside");
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
