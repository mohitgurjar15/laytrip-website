"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelSearchBarComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var forms_1 = require("@angular/forms");
var moment = require("moment");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngbDateCustomParserFormatter_1 = require("../../../../_helpers/ngbDateCustomParserFormatter");
var HotelSearchBarComponent = /** @class */ (function () {
    function HotelSearchBarComponent(fb, hotelService, commonFunction, cd, route, formatter) {
        this.fb = fb;
        this.hotelService = hotelService;
        this.commonFunction = commonFunction;
        this.cd = cd;
        this.route = route;
        this.formatter = formatter;
        this.searchBarInfo = new core_1.EventEmitter();
        this.calenderPrices = [];
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
        this.data = [];
        this.placeHolder1 = 'New York';
        // tslint:disable-next-line: quotemark
        this.totalPerson = 1;
        this.destinationHotel = {};
        this.checkInDate = new Date();
        this.checkOutDate = new Date();
        this.isPrevButton = false;
        this.searchedValue = [];
        this.itemIconArray = {
            hotel: this.s3BucketUrl + "assets/images/hotels/hotel.svg",
            city: this.s3BucketUrl + "assets/images/hotels/city.svg",
            airport: this.s3BucketUrl + "assets/images/hotels/airport.svg",
            region: this.s3BucketUrl + "assets/images/hotels/region.svg",
            poi: this.s3BucketUrl + "assets/images/hotels/poi.svg"
        };
        this.defaultHotel = {};
        this.searchHotelInfo = {
            latitude: null,
            longitude: null,
            check_in: null,
            check_out: null,
            city: '',
            country: '',
            occupancies: [
                {
                    adults: null,
                    child: [],
                    children: []
                }
            ]
        };
        this.recentSearchInfo = [];
        this.isShowRecentSearch = true;
        this.hotelSearchForm = this.fb.group({
            fromDestination: ['', forms_1.Validators.required]
        });
    }
    HotelSearchBarComponent.prototype.ngOnInit = function () {
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
                    this.defaultHotel.city = info.city;
                    this.defaultHotel.country = info.country;
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
        if (localStorage.getItem('_hotel_recent')) {
            this.recentSearchInfo = JSON.parse(localStorage.getItem('_hotel_recent'));
            this.data = this.recentSearchInfo.map(function (item) {
                return {
                    city: item.city,
                    country: item.country,
                    hotel_id: null,
                    title: item.title,
                    type: item.type,
                    geo_codes: item.geo_codes,
                    recentSearches: 'Recent Searches',
                    isRecentSearch: true
                };
            });
        }
        else {
        }
    };
    HotelSearchBarComponent.prototype.searchHotel = function (searchItem) {
        var _this = this;
        this.loading = true;
        var searchedData = { term: searchItem };
        this.hotelService.searchHotels(searchedData).subscribe(function (response) {
            if (response && response.data && response.data.length) {
                _this.data = response.data.map(function (res) {
                    _this.loading = false;
                    return {
                        city: res.city,
                        country: res.country,
                        hotel_id: res.hotel_id,
                        title: res.title,
                        type: res.type,
                        geo_codes: res.geo_codes
                    };
                });
            }
        }, function (error) {
            _this.loading = false;
        });
    };
    HotelSearchBarComponent.prototype.dateChange = function (type, direction) {
        console.log('date change');
    };
    HotelSearchBarComponent.prototype.checkInDateUpdate = function (date) {
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
    HotelSearchBarComponent.prototype.onChangeSearch = function (event) {
        if (event.term.length > 2) {
            this.searchHotel(event.term);
        }
    };
    HotelSearchBarComponent.prototype.changeGuestInfo = function (event) {
        this.totalPerson = event.totalPerson;
        this.searchedValue.push({ key: 'guest', value: event });
        this.searchHotelInfo.occupancies = event;
    };
    HotelSearchBarComponent.prototype.selectEvent = function (event, item) {
        if (!event) {
            this.placeHolder1 = this.placeHolder1;
            this.defaultHotel.city = this.defaultHotel.city;
            this.defaultHotel.country = this.defaultHotel.country;
        }
        if (event && item && item.key === 'fromSearch') {
            this.defaultHotel.city = event.city;
            this.defaultHotel.country = event.country;
            this.searchHotelInfo.latitude = event.geo_codes.lat;
            this.searchHotelInfo.longitude = event.geo_codes.long;
            this.searchHotelInfo.city = event.city;
            this.searchHotelInfo.country = event.country;
            this.searchedValue.push({ key: 'fromSearch', value: event });
        }
        if (this.recentSearchInfo && this.recentSearchInfo.length < 3) {
            this.recentSearchInfo.push(event);
            localStorage.setItem('_hotel_recent', JSON.stringify(this.recentSearchInfo));
        }
    };
    HotelSearchBarComponent.prototype.onRemove = function (event, item) {
        if (item.key === 'fromSearch') {
            this.defaultHotel = Object.create(null);
        }
    };
    HotelSearchBarComponent.prototype.modifyHotelSearch = function () {
        console.log(this.searchHotelInfo);
        if (this.searchHotelInfo && this.searchHotelInfo.latitude &&
            this.searchHotelInfo.longitude &&
            this.searchHotelInfo.check_in &&
            this.searchHotelInfo.check_out &&
            this.searchHotelInfo.occupancies) {
            this.searchBarInfo.emit(this.searchHotelInfo);
        }
    };
    __decorate([
        core_1.ViewChild('dateFilter', /* TODO: add static flag */ undefined)
    ], HotelSearchBarComponent.prototype, "dateFilter");
    __decorate([
        core_1.Output()
    ], HotelSearchBarComponent.prototype, "searchBarInfo");
    __decorate([
        core_1.Input()
    ], HotelSearchBarComponent.prototype, "calenderPrices");
    HotelSearchBarComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-search-bar',
            templateUrl: './hotel-search-bar.component.html',
            styleUrls: ['./hotel-search-bar.component.scss'],
            providers: [{ provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: ngbDateCustomParserFormatter_1.NgbDateCustomParserFormatter }]
        })
    ], HotelSearchBarComponent);
    return HotelSearchBarComponent;
}());
exports.HotelSearchBarComponent = HotelSearchBarComponent;
