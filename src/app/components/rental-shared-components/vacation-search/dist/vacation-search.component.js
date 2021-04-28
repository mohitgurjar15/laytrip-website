"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VacationSearchComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var VacationSearchComponent = /** @class */ (function () {
    function VacationSearchComponent(rentalService, cd, cookieService) {
        this.rentalService = rentalService;
        this.cd = cd;
        this.cookieService = cookieService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.changeValue = new core_1.EventEmitter();
        this.selectedRental = {};
        this.loading = false;
        this.data = [];
        this.recentSearchInfo = [];
        this.itemIconArray = {
            hotel: this.s3BucketUrl + "assets/images/hotels/hotel.svg",
            city: this.s3BucketUrl + "assets/images/hotels/city.svg"
        };
    }
    VacationSearchComponent.prototype.ngOnInit = function () {
        if (this.defaultSelected) {
            this.data.push({
                city: this.defaultSelected.city,
                country: this.defaultSelected.country,
                id: this.defaultSelected.id,
                display_name: this.defaultSelected.display_name,
                type: this.defaultSelected.type
            });
        }
        if (localStorage.getItem('_rental_recent')) {
            this.recentSearchInfo = JSON.parse(localStorage.getItem('_rental_recent'));
            this.data = this.recentSearchInfo.map(function (item) {
                return {
                    city: item.city,
                    country: item.country,
                    id: item.id,
                    display_name: item.display_name,
                    type: item.type,
                    recentSearches: 'Recent Searches',
                    isRecentSearch: true
                };
            });
        }
        else {
        }
    };
    VacationSearchComponent.prototype.ngDocheck = function () {
    };
    VacationSearchComponent.prototype.ngAfterViewChecked = function () {
    };
    VacationSearchComponent.prototype.searchByRental = function (searchItem) {
        var _this = this;
        this.loading = true;
        this.rentalService.searchRentalData(searchItem).subscribe(function (response) {
            _this.data = response.map(function (res) {
                _this.loading = false;
                return {
                    id: res.id,
                    display_name: res.display_name,
                    type: res.type,
                    city: res.city,
                    country: res.country
                };
            });
        }, function (error) {
            _this.loading = false;
        });
    };
    VacationSearchComponent.prototype.onChangeSearch = function (event) {
        if (event.term.length > 2) {
            this.searchByRental(event.term);
        }
    };
    VacationSearchComponent.prototype.selectEvent = function (event, index) {
        var _this = this;
        if (!event) {
            this.placeHolder = this.placeHolder;
            this.defaultSelected = this.defaultSelected;
        }
        //this.selectedHotel = event;
        this.defaultSelected = [];
        this.defaultSelected = event;
        if (event && index && index === 'fromSearch1') {
            this.changeValue.emit({ key: 'fromSearch1', value: event });
            if (this.recentSearchInfo && this.recentSearchInfo.length < 3) {
                var check = this.recentSearchInfo.some(function (temp) { return temp.id == _this.defaultSelected.id; });
                if (!check) {
                    this.recentSearchInfo.unshift({ id: event.id, city: event.city, country: event.country, display_name: event.display_name, type: event.type });
                    localStorage.setItem('_rental_recent', JSON.stringify(this.recentSearchInfo));
                }
            }
            else {
                var check = this.recentSearchInfo.some(function (temp) { return temp.id == _this.defaultSelected.id; });
                if (!check) {
                    this.recentSearchInfo.pop();
                    this.recentSearchInfo.unshift({ id: event.id, city: event.city, country: event.country, display_name: event.display_name, type: event.type });
                    localStorage.setItem('_rental_recent', JSON.stringify(this.recentSearchInfo));
                }
            }
        }
    };
    VacationSearchComponent.prototype.onRemove = function (event) {
        this.selectedRental = {};
        this.defaultSelected = this.defaultSelectedTemp;
    };
    __decorate([
        core_1.Input()
    ], VacationSearchComponent.prototype, "label");
    __decorate([
        core_1.Input()
    ], VacationSearchComponent.prototype, "tabIndex");
    __decorate([
        core_1.Input()
    ], VacationSearchComponent.prototype, "placeHolder");
    __decorate([
        core_1.Input()
    ], VacationSearchComponent.prototype, "defaultSelected");
    __decorate([
        core_1.Input()
    ], VacationSearchComponent.prototype, "id");
    __decorate([
        core_1.Input()
    ], VacationSearchComponent.prototype, "form");
    __decorate([
        core_1.Input()
    ], VacationSearchComponent.prototype, "controlName");
    __decorate([
        core_1.Output()
    ], VacationSearchComponent.prototype, "changeValue");
    __decorate([
        core_1.Input()
    ], VacationSearchComponent.prototype, "defaultCity");
    VacationSearchComponent = __decorate([
        core_1.Component({
            selector: 'app-vacation-search',
            templateUrl: './vacation-search.component.html',
            styleUrls: ['./vacation-search.component.scss']
        })
    ], VacationSearchComponent);
    return VacationSearchComponent;
}());
exports.VacationSearchComponent = VacationSearchComponent;
