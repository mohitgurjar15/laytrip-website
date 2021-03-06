"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelSuggestionComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var HotelSuggestionComponent = /** @class */ (function () {
    function HotelSuggestionComponent(hotelService, homeService, commonFunction) {
        this.hotelService = hotelService;
        this.homeService = homeService;
        this.commonFunction = commonFunction;
        this.selectedHotel = new core_1.EventEmitter();
        this.validateSearch = new core_1.EventEmitter();
        this.currentChangeCounter = new core_1.EventEmitter();
        this.isValidSearch = true;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
        this.data = [];
        this.defaultTempData = [];
        this.isShowDropDown = false;
        this.thisElementClicked = false;
        this.isInputFocus = false;
        this.counterChangeVal = 0;
        this.counter = 0;
    }
    HotelSuggestionComponent.prototype.ngOnInit = function () {
        this.defaultTempData[0] = this.defaultItem;
    };
    HotelSuggestionComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        this.homeService.getLocationForHotelDeal.subscribe(function (hotelInfo) {
            if (typeof hotelInfo != 'undefined' && Object.keys(hotelInfo).length > 0) {
                _this.searchItem = hotelInfo.title;
            }
        });
    };
    HotelSuggestionComponent.prototype.searchLocation = function (event) {
        var notAllowedKey = [40, 38, 9, 37, 39];
        if ((this.searchItem.length == 0 && event.keyCode == 8)) {
            this.data = [];
            this.loading = false;
            this.isShowDropDown = this.searchItem.length > 0 ? true : false;
            this.isValidSearch = this.searchItem.length > 0 ? true : false;
            //this.selectedHotel.emit({})
            this.validateSearch.emit(false);
            return;
        }
        if (!notAllowedKey.includes(event.keyCode)) {
            this.isShowDropDown = this.searchItem.length > 0 ? true : false;
            this.isValidSearch = this.searchItem.length > 0 ? true : false;
            this.data = [];
            if (this.loading) {
                this.$autoComplete.unsubscribe();
            }
            if (event.keyCode == 8) {
                var item = this.searchItem.split(',');
                this.searchHotel(item[0]);
            }
            else {
                this.searchHotel(this.searchItem);
                this.validateSearch.emit(false);
            }
        }
        else {
            this.loading = false;
        }
    };
    HotelSuggestionComponent.prototype.searchHotel = function (searchItem) {
        var _this = this;
        this.loading = true;
        var searchedData = { term: searchItem.replace(/(^\s+|\s+$)/g, "") };
        this.$autoComplete = this.hotelService.searchHotels(searchedData).subscribe(function (response) {
            _this.loading = false;
            if (response && response.data && response.data.length) {
                _this.data = response.data.map(function (res) {
                    return {
                        city: res.city,
                        country: res.country,
                        hotel_id: res.hotel_id,
                        title: res.title,
                        type: res.type,
                        geo_codes: res.geo_codes,
                        city_id: res.city_id
                    };
                });
                _this.selectedHotel.emit(_this.data[0]);
                _this.validateSearch.emit(true);
            }
            else {
                _this.isShowDropDown = false;
            }
        }, function (error) {
            _this.validateSearch.emit(false);
            _this.loading = false;
            _this.isShowDropDown = false;
        });
    };
    HotelSuggestionComponent.prototype.selectHotelItem = function (item) {
        this.isShowDropDown = false;
        this.searchItem = item.title;
        this.selectedHotel.emit(item);
        this.validateSearch.emit(true);
        this.isValidSearch = true;
    };
    HotelSuggestionComponent.prototype.clickOutside = function () {
        if (!this.thisElementClicked) {
            this.isShowDropDown = false;
        }
        this.thisElementClicked = false;
    };
    HotelSuggestionComponent.prototype.clickInside = function () {
        this.counter += 1;
        this.currentChangeCounter.emit(this.counter);
        this.isShowDropDown = true;
    };
    HotelSuggestionComponent.prototype.onFocus = function () {
        var _this = this;
        this.isInputFocus = true;
        if (this.commonFunction.isRefferal()) {
            this.progressInterval = setInterval(function () {
                if (_this.isInputFocus) {
                    _this.currentChangeCounter.emit(_this.counterChangeVal += 1);
                }
                else {
                    clearInterval(_this.progressInterval);
                }
            }, 1000);
        }
    };
    HotelSuggestionComponent.prototype.focusOut = function () {
        this.isInputFocus = false;
    };
    __decorate([
        core_1.Output()
    ], HotelSuggestionComponent.prototype, "selectedHotel");
    __decorate([
        core_1.Output()
    ], HotelSuggestionComponent.prototype, "validateSearch");
    __decorate([
        core_1.Output()
    ], HotelSuggestionComponent.prototype, "currentChangeCounter");
    __decorate([
        core_1.Input()
    ], HotelSuggestionComponent.prototype, "searchItem");
    __decorate([
        core_1.Input()
    ], HotelSuggestionComponent.prototype, "defaultItem");
    __decorate([
        core_1.HostListener('document:click')
    ], HotelSuggestionComponent.prototype, "clickOutside");
    __decorate([
        core_1.HostListener('click')
    ], HotelSuggestionComponent.prototype, "clickInside");
    HotelSuggestionComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-suggestion',
            templateUrl: './hotel-suggestion.component.html',
            styleUrls: ['./hotel-suggestion.component.scss']
        })
    ], HotelSuggestionComponent);
    return HotelSuggestionComponent;
}());
exports.HotelSuggestionComponent = HotelSuggestionComponent;
