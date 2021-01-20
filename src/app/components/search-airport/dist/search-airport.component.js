"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SearchAirportComponent = void 0;
var core_1 = require("@angular/core");
// import { data } from './airport';
var SearchAirportComponent = /** @class */ (function () {
    function SearchAirportComponent(flightService, cd, cookieService) {
        this.flightService = flightService;
        this.cd = cd;
        this.cookieService = cookieService;
        this.changeValue = new core_1.EventEmitter();
        this.selectedAirport = {};
        this.keyword = 'name';
        this.data = [];
        this.loading = false;
    }
    SearchAirportComponent.prototype.ngOnInit = function () {
        this.setDefaultAirport();
        //this.data.push(this.airport)
        this.data[0] = this.airport ? this.airport : [];
    };
    SearchAirportComponent.prototype.searchAirport = function (searchItem) {
        var _this = this;
        this.loading = true;
        this.flightService.searchAirport(searchItem).subscribe(function (response) {
            _this.data = response.map(function (res) {
                _this.loading = false;
                return {
                    id: res.id,
                    name: res.name,
                    code: res.code,
                    city: res.city,
                    country: res.country,
                    display_name: res.city + "," + res.country + ",(" + res.code + ")," + res.name,
                    parentId: res.parentId
                };
            });
        }, function (error) {
            _this.loading = false;
        });
    };
    SearchAirportComponent.prototype.onChangeSearch = function (event) {
        if (event.term.length > 2) {
            this.searchAirport(event.term);
        }
    };
    SearchAirportComponent.prototype.selectEvent = function (event, index) {
        if (!event) {
            this.placeHolder = this.placeHolder;
        }
        //this.selectedAirport = event;
        if (event && index && index === 'fromSearch') {
            this.changeValue.emit({ key: 'fromSearch', value: event });
        }
        else if (event && index && index === 'toSearch') {
            this.changeValue.emit({ key: 'toSearch', value: event });
        }
    };
    SearchAirportComponent.prototype.onRemove = function (event) {
        this.selectedAirport = {};
    };
    SearchAirportComponent.prototype.setDefaultAirport = function () {
        try {
            var location = this.cookieService.get('__loc');
            location = JSON.parse(location);
            if (typeof location.airport !== 'undefined') {
                /* location.airport.display_name = `${location.city},${location.country},(${location.code}),${location.name}`,
                this.data[0] = location.airport;
                this.airportDefaultDestValue = this.data[0].city;
                this.defaultSelected='';
                this.selectedAirport = this.data[0]; */
            }
        }
        catch (error) {
        }
    };
    SearchAirportComponent.prototype.ngOnChanges = function (changes) {
        if (changes['airport']) {
            this.defaultCity = Object.keys(changes['airport'].currentValue).length > 0 ? changes['airport'].currentValue.city : [];
            this.data = Object.keys(changes['airport'].currentValue).length > 0 ? [changes['airport'].currentValue] : [];
        }
    };
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "label");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "tabIndex");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "placeHolder");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "defaultSelected");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "id");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "form");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "controlName");
    __decorate([
        core_1.Output()
    ], SearchAirportComponent.prototype, "changeValue");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "defaultCity");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "airport");
    SearchAirportComponent = __decorate([
        core_1.Component({
            selector: 'app-search-airport',
            templateUrl: './search-airport.component.html',
            styleUrls: ['./search-airport.component.scss']
        })
    ], SearchAirportComponent);
    return SearchAirportComponent;
}());
exports.SearchAirportComponent = SearchAirportComponent;