"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightSearchWidgetComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../environments/environment");
var airports_1 = require("../../flight/airports");
var moment = require("moment");
var FlightSearchWidgetComponent = /** @class */ (function () {
    function FlightSearchWidgetComponent(genericService, commonFunction, fb, router, renderer) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.renderer = renderer;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.moduleList = {};
        this.switchBtnValue = false;
        this.isRoundTrip = false;
        this.flightSearchFormSubmitted = false;
        // DATE OF FROM_DESTINATION & TO_DESTINATION
        this.fromDestinationCode = 'JFK';
        this.departureCity = 'New York';
        this.departureAirportCountry = 'JFK, USA';
        this.fromAirport = airports_1.airports[this.fromDestinationCode];
        this.toDestinationCode = 'PUJ';
        this.arrivalCity = 'Punta Cana';
        this.arrivalAirportCountry = 'PUJ, Dominican Republic';
        this.toAirport = airports_1.airports[this.toDestinationCode];
        this.locale = {
            format: 'MM/DD/YYYY',
            displayFormat: 'MM/DD/YYYY'
        };
        this.departureDate = new Date(moment().add(31, 'days').format("MM/DD/YYYY"));
        this.returnDate = new Date(moment().add(38, 'days').format("MM/DD/YYYY"));
        this.totalPerson = 1;
        this.searchFlightInfo = {
            trip: 'oneway',
            departure: this.fromDestinationCode,
            arrival: this.toDestinationCode,
            departure_date: moment().add(1, 'months').format("YYYY-MM-DD"),
            arrival_date: '',
            "class": '',
            adult: 1,
            child: null,
            infant: null
        };
        this.searchedValue = [];
        this.fromAirport['display_name'] = this.fromAirport.city + "," + this.fromAirport.country + ",(" + this.fromAirport.code + ")," + this.fromAirport.name;
        this.toAirport['display_name'] = this.toAirport.city + "," + this.toAirport.country + ",(" + this.toAirport.code + ")," + this.toAirport.name;
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
        window.scrollTo(0, 0);
        this.countryCode = this.commonFunction.getUserCountry();
    };
    FlightSearchWidgetComponent.prototype.destinationChangedValue = function (event) {
        if (event && event.key && event.key === 'fromSearch') {
            this.fromDestinationCode = event.value.code;
            this.departureCity = event.value.city;
            this.departureAirportCountry = event.value.code + ", " + event.value.country;
            this.searchedValue.push({ key: 'fromSearch', value: event.value });
        }
        else if (event && event.key && event.key === 'toSearch') {
            this.toDestinationCode = event.value.code;
            this.arrivalCity = event.value.city;
            this.arrivalAirportCountry = event.value.code + ", " + event.value.country;
            this.searchedValue.push({ key: 'toSearch', value: event.value });
        }
        this.searchFlightInfo.departure = this.fromDestinationCode;
        this.searchFlightInfo.arrival = this.toDestinationCode;
    };
    FlightSearchWidgetComponent.prototype.getDateWithFormat = function (date) {
        this.searchFlightInfo.departure_date = this.commonFunction.parseDateWithFormat(date).departuredate;
        // this.searchFlightInfo.arrival_date = this.commonFunction.parseDateWithFormat(date).returndate;
    };
    FlightSearchWidgetComponent.prototype.changeTravellerInfo = function (event) {
        this.searchFlightInfo.adult = event.adult;
        this.searchFlightInfo.child = event.child;
        this.searchFlightInfo.infant = event.infant;
        this.searchFlightInfo["class"] = event["class"];
        this.totalPerson = event.totalPerson;
        this.searchedValue.push({ key: 'travellers', value: event });
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
        var temp = this.fromDestinationCode;
        this.fromDestinationCode = this.toDestinationCode;
        this.toDestinationCode = temp;
        this.searchFlightInfo.departure = this.searchFlightInfo.arrival;
        this.searchFlightInfo.arrival = temp;
        var tempCity = this.departureCity;
        this.departureCity = this.arrivalCity;
        this.arrivalCity = tempCity;
        var tempAirportCountry = this.departureAirportCountry;
        this.departureAirportCountry = this.arrivalAirportCountry;
        this.arrivalAirportCountry = tempAirportCountry;
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
    __decorate([
        core_1.ViewChild('dateFilter', /* TODO: add static flag */ undefined)
    ], FlightSearchWidgetComponent.prototype, "dateFilter");
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
