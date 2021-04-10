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
        this.isPrevButton = false;
        this.defaultCity = 'New York';
        this.defaultHotelCountry = 'NY, United States';
        this.fromDestinationTitle = 'New York, United States';
        this.fromDestinationInfo = {
            city: 'New York',
            country: 'United States',
            hotel_id: null,
            title: 'New York',
            type: 'city',
            geo_codes: { lat: 40.7681, long: -73.9819 }
        };
        this.searchedValue = [];
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
                    if (info) {
                        this.fromDestinationInfo.city = info.city;
                        this.fromDestinationInfo.country = info.country;
                        this.searchHotelInfo.city = info.city;
                        this.searchHotelInfo.country = info.country;
                    }
                }
                if (this.route.snapshot.queryParams['itenery']) {
                    info = JSON.parse(atob(this.route.snapshot.queryParams['itenery']));
                    if (info) {
                        this.searchHotelInfo.occupancies = info;
                    }
                }
            }
        }
        if (this.fromDestinationInfo) {
            this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat;
            this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long;
            this.searchedValue.push({ key: 'fromSearch', value: this.fromDestinationInfo });
        }
        this.$dealLocatoin = this.homeService.getLocationForHotelDeal.subscribe(function (hotelInfo) {
            if (typeof hotelInfo != 'undefined' && Object.keys(hotelInfo).length > 0) {
                _this.fromDestinationInfo.city = hotelInfo.city;
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
            this.searchedValue.push({ key: 'guest', value: this.selectedGuest });
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
        this.checkInDate = date;
        this.checkInMinDate = moment(this.customStartDateValidation, 'YYYY-MM-DD').add(1, 'days').toDate();
        this.checkOutDate = moment(this.checkInDate).add(1, 'days').toDate();
        this.checkOutMinDate = this.checkOutDate;
        this.searchHotelInfo.check_in = this.rangeDates[0];
        this.rangeDates[1] = this.searchHotelInfo.check_out = this.checkOutDate;
    };
    HotelSearchWidgetComponent.prototype.changeGuestInfo = function (event) {
        if (this.searchedValue && this.searchedValue.find(function (i) { return i.key === 'guest'; })) {
            this.searchedValue[1]['value'] = event;
            this.searchHotelInfo.occupancies = event;
            console.log(this.searchHotelInfo.occupancies);
        }
    };
    HotelSearchWidgetComponent.prototype.destinationChangedValue = function (event) {
        if (event && event.key && event.key === 'fromSearch') {
            this.searchedValue[0]['value'] = event.value;
            this.fromDestinationTitle = event.value.title;
            this.searchHotelInfo.latitude = event.value.geo_codes.lat;
            this.searchHotelInfo.longitude = event.value.geo_codes.long;
        }
    };
    HotelSearchWidgetComponent.prototype.searchHotels = function () {
        var _this = this;
        this.hotelSearchFormSubmitted = true;
        var queryParams = {};
        queryParams.check_in = moment(this.searchHotelInfo.check_in).format('YYYY-MM-DD');
        queryParams.check_out = moment(this.searchHotelInfo.check_out).format('YYYY-MM-DD');
        queryParams.latitude = parseFloat(this.searchHotelInfo.latitude);
        queryParams.longitude = parseFloat(this.searchHotelInfo.longitude);
        queryParams.itenery = btoa(JSON.stringify(this.searchedValue[1]['value']));
        queryParams.location = btoa(JSON.stringify(this.searchedValue[0]['value']));
        console.log("queryParams", this.searchedValue[1]['value']);
        if (this.searchHotelInfo && this.searchHotelInfo.latitude && this.searchHotelInfo.longitude &&
            this.searchHotelInfo.check_in && this.searchHotelInfo.check_out && this.searchHotelInfo.occupancies) {
            // localStorage.setItem('_hote', JSON.stringify(this.searchedValue));
            // this.router.navigate(['hotel/search'], {
            //   queryParams: queryParams,
            //   queryParamsHandling: 'merge'
            // });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                _this.router.navigate(['hotel/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
            });
        }
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
