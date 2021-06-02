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
        this.searchItem = new core_1.EventEmitter();
        this.flightSearchRoute = new core_1.EventEmitter();
        this.selectedAirport = {};
        this.keyword = 'name';
        this.data = [];
        this.loading = false;
    }
    SearchAirportComponent.prototype.ngOnInit = function () {
        this.data[0] = this.airport ? this.airport : [];
        if (Object.keys(this.airport).length == 0) {
            this.data = [];
        }
    };
    SearchAirportComponent.prototype.searchAirport = function (searchItem) {
        var _this = this;
        this.loading = true;
        var isFromLocation = this.id == 'fromSearch' ? 'yes' : 'no';
        var alternateLocation = '';
        if (this.id == 'fromSearch') {
            alternateLocation = localStorage.getItem('__to') || '';
        }
        else {
            alternateLocation = localStorage.getItem('__from') || '';
        }
        this.flightService.searchRoute(searchItem, isFromLocation, alternateLocation).subscribe(function (response) {
            _this.flightSearchRoute.emit(response);
            _this.data = response.map(function (res) {
                _this.loading = false;
                var searchRoute = {
                    id: res.id,
                    name: res.name,
                    code: res.code,
                    city: res.city,
                    country: res.country,
                    display_name: res.city + "," + res.country + ",(" + res.code + ")," + res.name,
                    parentId: 0
                };
                return searchRoute;
            });
        }, function (error) {
            _this.loading = false;
        });
    };
    SearchAirportComponent.prototype.onChangeSearch = function (event) {
        this.searchAirport(event.term);
        // this.searchItem.emit({key : event.term,type : this.id})
    };
    SearchAirportComponent.prototype.selectEvent = function (event, index) {
        if (!event) {
            this.placeHolder = this.placeHolder;
        }
        if (typeof event == 'undefined') {
            if (index === 'fromSearch') {
                localStorage.removeItem('__from');
            }
            else if (index === 'toSearch') {
                localStorage.removeItem('__to');
            }
        }
        this.selectedAirport = event;
        if (event && index && index === 'fromSearch') {
            this.changeValue.emit({ key: 'fromSearch', value: event });
            localStorage.setItem('__from', this.selectedAirport.code);
        }
        else if (event && index && index === 'toSearch') {
            localStorage.setItem('__to', this.selectedAirport.code);
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
        if (changes['airport'] && typeof changes['airport'].currentValue != 'undefined') {
            this.defaultCity = Object.keys(changes['airport'].currentValue).length > 0 ? changes['airport'].currentValue.city : '';
            this.data = Object.keys(changes['airport'].currentValue).length > 0 ? Object.assign([], [changes['airport'].currentValue]) : [];
            // this.cd.checkNoChanges()
        }
        console.log(this.inputName, this.data);
        /*     if(this.inputName == 'toSearch'){
              
        
            }
         */ /* this.homeService.getToString.subscribe(toSearchString => {
             if (typeof toSearchString != 'undefined' && Object.keys(toSearchString).length > 0) {
               this.data  = [];
               this.data = [airports[toSearchString]]
               this.defaultCity = airports[toSearchString].city
               console.log(this.defaultCity)
             }
           }); */
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
        core_1.Output()
    ], SearchAirportComponent.prototype, "searchItem");
    __decorate([
        core_1.Output()
    ], SearchAirportComponent.prototype, "flightSearchRoute");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "defaultCity");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "airport");
    __decorate([
        core_1.Input()
    ], SearchAirportComponent.prototype, "inputName");
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
