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
var environment_1 = require("src/environments/environment");
var HotelSuggestionComponent = /** @class */ (function () {
    function HotelSuggestionComponent(hotelService) {
        this.hotelService = hotelService;
        this.selectedHotel = new core_1.EventEmitter();
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
        this.data = [];
        this.isShowDropDown = false;
    }
    HotelSuggestionComponent.prototype.ngOnInit = function () {
    };
    HotelSuggestionComponent.prototype.closeHotelSuggestion = function () {
        this.isShowDropDown = false;
    };
    HotelSuggestionComponent.prototype.searchLocation = function () {
        this.isShowDropDown = this.selectHotelItem.length > 0 ? true : false;
        this.searchHotel(this.searchItem);
    };
    HotelSuggestionComponent.prototype.searchHotel = function (searchItem) {
        var _this = this;
        this.loading = true;
        var searchedData = { term: searchItem };
        this.data = [];
        this.hotelService.searchHotels(searchedData).subscribe(function (response) {
            _this.loading = false;
            if (response && response.data && response.data.length) {
                _this.data = response.data.map(function (res) {
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
            _this.isShowDropDown = false;
        });
    };
    HotelSuggestionComponent.prototype.selectHotelItem = function (item) {
        this.isShowDropDown = false;
        this.searchItem = item.title;
        this.selectedHotel.emit(item);
    };
    __decorate([
        core_1.Output()
    ], HotelSuggestionComponent.prototype, "selectedHotel");
    __decorate([
        core_1.Input()
    ], HotelSuggestionComponent.prototype, "searchItem");
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
