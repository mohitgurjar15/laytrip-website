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
    function HotelSearchWidgetComponent(commonFunction, fb, router, route) {
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.route = route;
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
        this.selectedGuest = [
            {
                adults: 2,
                child: [],
                children: []
            }
        ];
        this.showCommingSoon = false;
        this.hotelSearchForm = this.fb.group({
            fromDestination: ['', [forms_1.Validators.required]]
        });
        this.checkInMinDate = new Date();
        this.checkOutMinDate = this.checkInDate;
        this.checkOutDate.setDate(this.checkInDate.getDate() + 1);
        this.rangeDates = [this.checkInDate, this.checkOutDate];
        this.searchHotelInfo =
            {
                latitude: null,
                longitude: null,
                check_in: this.checkInDate,
                check_out: this.checkOutDate,
                occupancies: [
                    {
                        adults: null,
                        children: []
                    }
                ]
            };
        var host = window.location.origin;
        if (host.includes("staging")) {
            this.showCommingSoon = true;
        }
    }
    HotelSearchWidgetComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.countryCode = this.commonFunction.getUserCountry();
        if (this.route && this.route.snapshot.queryParams['check_in']) {
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
        if (this.selectedGuest) {
            this.searchedValue.push({ key: 'guest', value: this.selectedGuest });
        }
    };
    // ngAfterContentChecked() {
    //   if (this.route && this.route.snapshot.queryParams['check_in']) {
    //     this.checkInDate = new Date(this.route.snapshot.queryParams['check_in']);
    //     this.checkInMinDate = this.checkInDate;
    //     this.checkOutDate = new Date(this.route.snapshot.queryParams['check_out']);
    //     this.checkOutMinDate = this.checkOutDate;
    //     this.rangeDates = [this.checkInDate, this.checkOutDate];
    //     if (this.route && this.route.snapshot && this.route.snapshot.queryParams) {
    //       let info;
    //       this.searchHotelInfo =
    //       {
    //         latitude: this.route.snapshot.queryParams['latitude'],
    //         longitude: this.route.snapshot.queryParams['longitude'],
    //         check_in: moment(this.route.snapshot.queryParams['check_in']).format('MM/DD/YYYY'),
    //         check_out: moment(this.route.snapshot.queryParams['check_out']).format('MM/DD/YYYY'),
    //       };
    //       if (this.route.snapshot.queryParams['location']) {
    //         info = JSON.parse(atob(this.route.snapshot.queryParams['location']));
    //         if (info) {
    //           this.fromDestinationInfo.city = info.city;
    //           this.fromDestinationInfo.country = info.country;
    //           this.searchHotelInfo.city = info.city;
    //           this.searchHotelInfo.country = info.country;
    //         }
    //       }
    //       if (this.route.snapshot.queryParams['itenery']) {
    //         info = JSON.parse(atob(this.route.snapshot.queryParams['itenery']));
    //         if (info) {
    //           this.searchHotelInfo.occupancies = info;
    //         }
    //       }
    //     }
    //   }
    //   if (this.fromDestinationInfo) {
    //     this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat;
    //     this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long;
    //     this.searchedValue.push({ key: 'fromSearch', value: this.fromDestinationInfo });
    //   }
    //   if (this.selectedGuest) {
    //     this.searchedValue.push({ key: 'guest', value: this.selectedGuest });
    //   }
    // }
    HotelSearchWidgetComponent.prototype.checkInDateUpdate = function (date) {
        // this is only for closing date range picker, after selecting both dates
        if (this.rangeDates[1]) { // If second date is selected
            this.dateFilter.hideOverlay();
        }
        ;
        if (this.rangeDates[0] && this.rangeDates[1]) {
            this.checkInDate = this.rangeDates[0];
            this.checkInMinDate = this.rangeDates[0];
            this.checkOutDate = this.rangeDates[1];
            this.checkOutMinDate = this.rangeDates[1];
            this.searchHotelInfo.check_in = this.checkInDate;
            this.searchHotelInfo.check_out = this.checkOutDate;
        }
    };
    // dateChange(type, direction) {
    //   if (type === 'checkIn') {
    //     if (direction === 'previous') {
    //       if (moment(this.checkInDate).isAfter(moment(new Date()))) {
    //         this.checkInDate = new Date(moment(this.checkInDate).subtract(1, 'days').format('MM/DD/YYYY'));
    //       }
    //     } else {
    //       this.checkInDate = new Date(moment(this.checkInDate).add(1, 'days').format('MM/DD/YYYY'));
    //       if (moment(this.checkInDate).isAfter(this.checkOutDate)) {
    //         this.checkOutDate = new Date(moment(this.checkOutDate).add(1, 'days').format('MM/DD/YYYY'));
    //       }
    //     }
    //     this.checkOutMinDate = new Date(this.checkInDate);
    //   }
    //   if (type === 'checkOut') {
    //     if (direction === 'previous') {
    //       if (moment(this.checkInDate).isBefore(this.checkOutDate)) {
    //         this.checkOutDate = new Date(moment(this.checkOutDate).subtract(1, 'days').format('MM/DD/YYYY'));
    //       }
    //     } else {
    //       this.checkOutDate = new Date(moment(this.checkOutDate).add(1, 'days').format('MM/DD/YYYY'));
    //     }
    //   }
    // }
    HotelSearchWidgetComponent.prototype.changeGuestInfo = function (event) {
        if (this.searchedValue && this.searchedValue.find(function (i) { return i.key === 'guest'; })) {
            this.searchedValue[1]['value'] = event;
            this.searchHotelInfo.occupancies = event;
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