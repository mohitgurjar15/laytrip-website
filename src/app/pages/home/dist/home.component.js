"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var forms_1 = require("@angular/forms");
var moment = require("moment");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(genericService, commonFunction, fb, router, cd) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.cd = cd;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.moduleList = {};
        this.switchBtnValue = false;
        this.tempSwapData = {
            leftSideValue: {},
            rightSideValue: {}
        };
        this.swapped = [];
        this.isSwap = false;
        this.swapError = '';
        this.isRoundTrip = false;
        this.locale = {
            format: 'MM/DD/YYYY',
            displayFormat: 'MM/DD/YYYY'
        };
        this.departureDate = new Date(moment().add(30, 'days').format("MM/DD/YYYY"));
        this.returnDate = new Date(moment().add(37, 'days').format("MM/DD/YYYY"));
        this.totalPerson = 1;
        this.searchFlightInfo = {
            trip: 'oneway',
            departure: '',
            arrival: '',
            departure_date: moment().add(1, 'months').format("YYYY-MM-DD"),
            arrival_date: '',
            "class": '',
            adult: 1,
            child: null,
            infant: null
        };
        this.searchedValue = [];
        this.flightSearchForm = this.fb.group({
            fromDestination: [[forms_1.Validators.required]],
            toDestination: [[forms_1.Validators.required]],
            departureDate: [[forms_1.Validators.required]],
            returnDate: [[forms_1.Validators.required]]
        });
        //this.flightReturnMinDate = moment().add(30, 'days');
        this.flightDepartureMinDate = new Date();
        this.flightReturnMinDate = this.departureDate;
    }
    HomeComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.getModules();
        this.loadJquery();
    };
    HomeComponent.prototype.loadJquery = function () {
        $(".featured_slid").slick({
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
        // Start Featured List Js
        $(".deals_slid").slick({
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
        // Close Featured List Js
    };
    /**
     * Get All module like (hotel, flight & VR)
     */
    HomeComponent.prototype.getModules = function () {
        var _this = this;
        this.genericService.getModules().subscribe(function (response) {
            response.data.forEach(function (module) {
                _this.moduleList[module.name] = module.status;
            });
            // console.log(this.moduleList);
        }, function (error) {
        });
    };
    HomeComponent.prototype.destinationChangedValue = function (event) {
        if (event && event.key && event.key === 'fromSearch') {
            this.fromDestinationCode = event.value.code;
            this.searchedValue.push({ key: 'fromSearch', value: event.value });
        }
        else if (event && event.key && event.key === 'toSearch') {
            this.toDestinationCode = event.value.code;
            this.searchedValue.push({ key: 'toSearch', value: event.value });
        }
        this.searchFlightInfo.departure = this.fromDestinationCode;
        this.searchFlightInfo.arrival = this.toDestinationCode;
    };
    HomeComponent.prototype.getDateWithFormat = function (date) {
        this.searchFlightInfo.departure_date = this.commonFunction.parseDateWithFormat(date).departuredate;
        // this.searchFlightInfo.arrival_date = this.commonFunction.parseDateWithFormat(date).returndate;
    };
    HomeComponent.prototype.getSwappedValue = function (event) {
        if (event && event.key && event.key === 'fromSearch') {
            this.tempSwapData.leftSideValue = event.value;
        }
        else if (event && event.key && event.key === 'toSearch') {
            this.tempSwapData.rightSideValue = event.value;
        }
    };
    HomeComponent.prototype.switchDestination = function () {
    };
    HomeComponent.prototype.changeTravellerInfo = function (event) {
        this.searchFlightInfo.adult = event.adult;
        this.searchFlightInfo.child = event.child;
        this.searchFlightInfo.infant = event.infant;
        this.searchFlightInfo["class"] = event["class"];
        this.totalPerson = event.totalPerson;
        this.searchedValue.push({ key: 'travellers', value: event });
    };
    HomeComponent.prototype.searchFlights = function () {
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
    HomeComponent.prototype.toggleOnewayRoundTrip = function (type) {
        if (type === 'roundtrip') {
            this.isRoundTrip = true;
        }
        else {
            this.isRoundTrip = false;
        }
    };
    HomeComponent.prototype.departureDateUpdate = function (date) {
        this.returnDate = new Date(date);
        this.flightReturnMinDate = new Date(date);
    };
    HomeComponent.prototype.dateChange = function (type, direction) {
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
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.scss']
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
