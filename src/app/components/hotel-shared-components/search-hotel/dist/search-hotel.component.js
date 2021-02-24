"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SearchHotelComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var SearchHotelComponent = /** @class */ (function () {
    function SearchHotelComponent(hotelService, cd, cookieService) {
        this.hotelService = hotelService;
        this.cd = cd;
        this.cookieService = cookieService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.changeValue = new core_1.EventEmitter();
        this.selectedHotel = {};
        this.loading = false;
        this.data = [];
        this.itemIconArray = {
            hotel: this.s3BucketUrl + "assets/images/hotels/hotel.svg",
            city: this.s3BucketUrl + "assets/images/hotels/city.svg",
            airport: this.s3BucketUrl + "assets/images/hotels/airport.svg",
            region: this.s3BucketUrl + "assets/images/hotels/region.svg",
            poi: this.s3BucketUrl + "assets/images/hotels/poi.svg"
        };
        this.recentSearchInfo = [];
        this.isShowRecentSearch = true;
    }
    SearchHotelComponent.prototype.ngOnInit = function () {
        if (this.defaultSelected) {
            this.data.push({
                city: this.defaultSelected.city,
                country: this.defaultSelected.country,
                hotel_id: null,
                title: this.defaultSelected.title,
                type: this.defaultSelected.type,
                geo_codes: this.defaultSelected.geo_codes
            });
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
            // console.log('no');
        }
    };
    SearchHotelComponent.prototype.ngDocheck = function () {
    };
    SearchHotelComponent.prototype.ngAfterViewChecked = function () {
    };
    SearchHotelComponent.prototype.searchHotel = function (searchItem) {
        var _this = this;
        this.loading = true;
        var searchedData = { term: searchItem };
        this.data = [];
        this.isShowRecentSearch = false;
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
    SearchHotelComponent.prototype.onChangeSearch = function (event) {
        if (event.term.length > 2) {
            this.searchHotel(event.term);
        }
    };
    SearchHotelComponent.prototype.selectEvent = function (event, index) {
        if (!event) {
            this.placeHolder = this.placeHolder;
            this.defaultSelected = this.defaultSelected;
        }
        //this.selectedHotel = event;
        this.defaultSelected = [];
        this.defaultSelected = event;
        if (event && index && index === 'fromSearch') {
            this.changeValue.emit({ key: 'fromSearch', value: event });
            if (this.recentSearchInfo && this.recentSearchInfo.length < 3) {
                this.recentSearchInfo.push(event);
                localStorage.setItem('_hotel_recent', JSON.stringify(this.recentSearchInfo));
            }
        }
    };
    SearchHotelComponent.prototype.onRemove = function (event) {
        this.selectedHotel = {};
        this.defaultSelected = this.defaultSelectedTemp;
    };
    __decorate([
        core_1.Input()
    ], SearchHotelComponent.prototype, "label");
    __decorate([
        core_1.Input()
    ], SearchHotelComponent.prototype, "tabIndex");
    __decorate([
        core_1.Input()
    ], SearchHotelComponent.prototype, "placeHolder");
    __decorate([
        core_1.Input()
    ], SearchHotelComponent.prototype, "defaultSelected");
    __decorate([
        core_1.Input()
    ], SearchHotelComponent.prototype, "id");
    __decorate([
        core_1.Input()
    ], SearchHotelComponent.prototype, "form");
    __decorate([
        core_1.Input()
    ], SearchHotelComponent.prototype, "controlName");
    __decorate([
        core_1.Output()
    ], SearchHotelComponent.prototype, "changeValue");
    __decorate([
        core_1.Input()
    ], SearchHotelComponent.prototype, "defaultCity");
    SearchHotelComponent = __decorate([
        core_1.Component({
            selector: 'app-search-hotel',
            templateUrl: './search-hotel.component.html',
            styleUrls: ['./search-hotel.component.scss']
        })
    ], SearchHotelComponent);
    return SearchHotelComponent;
}());
exports.SearchHotelComponent = SearchHotelComponent;
