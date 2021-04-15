"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelSearchWidgetComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var moment = require("moment");
var forms_1 = require("@angular/forms");
var HotelSearchWidgetComponent = /** @class */ (function () {
    function HotelSearchWidgetComponent(commonFunction, fb, router, route, homeService) {
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.route = route;
        this.homeService = homeService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.checkInDate = new Date();
        this.checkOutDate = new Date();
        this.maxDate = {};
        this.minDate = {};
        this.validSearch = true;
        this.fromDestinationInfo = {
            title: "Cancún, Mexico",
            city: "Cancún",
            state: "",
            country: "Mexico",
            type: "city",
            hotel_id: null,
            geo_codes: {
                lat: 21.1613,
                long: -86.8341
            }
        };
        this.showHotelDropDown = false;
        this.hotelSearchFormSubmitted = false;
        this.searchHotelInfo = {
            latitude: null,
            longitude: null,
            check_in: null,
            check_out: null,
            occupancies: [
                {
                    adults: null,
                    children: []
                }
            ]
        };
        this.selectedGuest = {
            rooms: 1,
            adults: 1,
            child: 0,
            children: []
        };
        this.showCommingSoon = false;
        this.customStartDateValidation = "2021-06-02";
        this.customEndDateValidation = "2021-06-03";
        this.hotelSearchForm = this.fb.group({
            fromDestination: ['', [forms_1.Validators.required]]
        });
        this.setHotelDate();
        this.checkOutMinDate = this.checkInDate;
        this.checkOutDate = moment(this.checkInDate).add(1, 'days').toDate();
        this.rangeDates = [this.checkInDate, this.checkOutDate];
        this.searchHotelInfo =
            {
                latitude: null,
                longitude: null,
                check_in: this.checkInDate,
                check_out: this.checkOutDate,
                location: {},
                occupancies: {
                    adults: null,
                    children: []
                }
            };
        var host = window.location.origin;
        if (host.includes("staging")) {
            this.showCommingSoon = true;
        }
    }
    HotelSearchWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.checkInDate = moment(this.customStartDateValidation).toDate();
        if (new Date(this.customStartDateValidation) <= new Date()) {
            this.checkInDate = moment().add('31', 'days').toDate();
        }
        this.countryCode = this.commonFunction.getUserCountry();
        if (this.route && this.route.snapshot.queryParams['check_in']) {
            // this.$dealLocatoin.unsubscribe();  
            this.homeService.removeToString('hotel');
            this.checkInDate = new Date(this.route.snapshot.queryParams['check_in']);
            this.checkInMinDate = this.checkInDate;
            this.checkOutDate = new Date(this.route.snapshot.queryParams['check_out']);
            this.checkOutMinDate = this.checkOutDate;
            this.rangeDates = [this.checkInDate, this.checkOutDate];
            if (this.route && this.route.snapshot && this.route.snapshot.queryParams) {
                var info = void 0;
                this.searchHotelInfo =
                    {
                        latitude: this.route.snapshot.queryParams['latitude'],
                        longitude: this.route.snapshot.queryParams['longitude'],
                        check_in: moment(this.route.snapshot.queryParams['check_in']).format('MM/DD/YYYY'),
                        check_out: moment(this.route.snapshot.queryParams['check_out']).format('MM/DD/YYYY')
                    };
                if (this.route.snapshot.queryParams['location']) {
                    info = JSON.parse(atob(this.route.snapshot.queryParams['location']));
                    this.searchHotelInfo.location = info;
                    if (info) {
                        this.fromDestinationInfo.title = info.title;
                        this.fromDestinationInfo.city = info.city;
                        this.fromDestinationInfo.country = info.country;
                        this.searchHotelInfo.city = info.city;
                        this.searchHotelInfo.country = info.country;
                    }
                }
                if (this.route.snapshot.queryParams['itenery']) {
                    info = JSON.parse(atob(this.route.snapshot.queryParams['itenery']));
                    this.searchHotelInfo.occupancies = info;
                }
            }
        }
        else {
            this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat;
            this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long;
            this.searchHotelInfo.location = this.fromDestinationInfo;
        }
        this.$dealLocatoin = this.homeService.getLocationForHotelDeal.subscribe(function (hotelInfo) {
            if (typeof hotelInfo != 'undefined' && Object.keys(hotelInfo).length > 0) {
                _this.fromDestinationInfo.city = _this.fromDestinationInfo.title = hotelInfo.city;
                _this.searchHotelInfo.check_in = _this.checkInDate = moment().add(31, 'days').toDate();
                _this.searchHotelInfo.check_out = _this.checkOutMinDate = _this.checkOutDate = moment(_this.searchHotelInfo.check_in).add(1, 'days').toDate();
                _this.searchHotelInfo.latitude = hotelInfo.lat;
                _this.searchHotelInfo.longitude = hotelInfo.long;
                _this.checkInMinDate = moment(_this.customStartDateValidation).toDate();
                _this.rangeDates = [_this.checkInDate, _this.checkOutDate];
            }
        });
        this.homeService.removeToString('hotel');
        if (this.selectedGuest) {
            this.searchHotelInfo.occupancies = this.selectedGuest;
        }
    };
    HotelSearchWidgetComponent.prototype.setHotelDate = function () {
        var curretdate = moment().format();
        var customStartDate = moment(this.customStartDateValidation).format('YYYY-MM-DD');
        var daysDiff = moment(this.customEndDateValidation, "YYYY-MM-DD").diff(moment(curretdate, "YYYY-MM-DD"), 'days');
        if (curretdate < customStartDate && daysDiff > 30) {
            this.checkInDate = moment(customStartDate).toDate();
            this.checkInMinDate = this.checkInDate;
        }
        else if (daysDiff < 30) {
            this.checkInDate = moment(curretdate).add(31, 'days').toDate();
            this.checkInMinDate = this.checkInDate;
            // this.departureDate = date; 
        }
        else {
            this.checkInDate = moment(curretdate).add(31, 'days').toDate();
            this.checkInMinDate = this.checkInDate;
            // this.flightDepartureMinDate =  date;
        }
    };
    HotelSearchWidgetComponent.prototype.checkInDateUpdate = function (date) {
        // this is only for closing date range picker, after selecting both dates
        if (this.rangeDates[1]) { // If second date is selected
            this.dateFilter.hideOverlay();
        }
        ;
        var daysDiff = this.rangeDates[0] ? moment(this.rangeDates[1], "YYYY-MM-DD").diff(moment(this.rangeDates[0], "YYYY-MM-DD"), 'days') : 0;
        if (daysDiff == 0) {
            // this.checkInMinDate = moment(this.rangeDates[0],'YYYY-MM-DD').add(1,'days').toDate();
            this.checkOutDate = moment(this.rangeDates[0]).add(1, 'days').toDate();
            this.rangeDates[1] = this.searchHotelInfo.check_out = this.checkOutDate;
        }
    };
    HotelSearchWidgetComponent.prototype.changeGuestInfo = function (event) {
        this.searchHotelInfo.occupancies = event;
    };
    HotelSearchWidgetComponent.prototype.searchHotels = function () {
        var _this = this;
        this.hotelSearchFormSubmitted = true;
        var queryParams = {};
        queryParams.check_in = moment(this.rangeDates[0]).format('YYYY-MM-DD');
        queryParams.check_out = moment(this.rangeDates[1]).format('YYYY-MM-DD');
        queryParams.latitude = parseFloat(this.searchHotelInfo.latitude);
        queryParams.longitude = parseFloat(this.searchHotelInfo.longitude);
        queryParams.itenery = btoa(JSON.stringify(this.searchHotelInfo.occupancies));
        queryParams.location = btoa(JSON.stringify(this.searchHotelInfo.location));
        console.log(queryParams, this.searchHotelInfo.occupancies);
        if (this.validSearch && this.searchHotelInfo && this.searchHotelInfo.latitude && this.searchHotelInfo.longitude &&
            this.searchHotelInfo.check_in && this.searchHotelInfo.check_out && this.searchHotelInfo.occupancies) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                _this.router.navigate(['hotel/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
            });
        }
    };
    HotelSearchWidgetComponent.prototype.selectedHotel = function (event) {
        this.searchHotelInfo.location = event;
        this.searchHotelInfo.latitude = event.geo_codes.lat;
        this.searchHotelInfo.longitude = event.geo_codes.long;
    };
    HotelSearchWidgetComponent.prototype.validateSearch = function (event) {
        this.validSearch = event;
    };
    __decorate([
        core_1.ViewChild('dateFilter', /* TODO: add static flag */ undefined)
    ], HotelSearchWidgetComponent.prototype, "dateFilter");
    HotelSearchWidgetComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-search-widget',
            templateUrl: './hotel-search-widget.component.html',
            styleUrls: ['./hotel-search-widget.component.scss']
        })
    ], HotelSearchWidgetComponent);
    return HotelSearchWidgetComponent;
}());
exports.HotelSearchWidgetComponent = HotelSearchWidgetComponent;
