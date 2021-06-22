"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AirportSuggestionComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var AirportSuggestionComponent = /** @class */ (function () {
    function AirportSuggestionComponent(flightService) {
        this.flightService = flightService;
        this.data = [];
        this.closeAirportSuggestion = new core_1.EventEmitter();
        this.changeValue = new core_1.EventEmitter();
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
    }
    AirportSuggestionComponent.prototype.ngOnInit = function () {
        this.getAirports();
    };
    AirportSuggestionComponent.prototype.closeAirportDropDown = function (type) {
        this.closeAirportSuggestion.emit(type);
    };
    AirportSuggestionComponent.prototype.ngOnChanges = function (change) {
    };
    AirportSuggestionComponent.prototype.getAirports = function () {
        var _this = this;
        var from = localStorage.getItem('__from') || '';
        var to = localStorage.getItem('__to') || '';
        if (from == '' && to == '') {
            this.loading = true;
            this.flightService.searchAirports(this.type).subscribe(function (result) {
                _this.loading = false;
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].value.length; j++) {
                        if (result[i].value[j].code != 'AMD') {
                            result[i].value[j].display_name = result[i].value[j].city + "," + result[i].value[j].country + ",(" + result[i].value[j].code + ")," + result[i].value[j].name;
                        }
                    }
                }
                _this.data = result;
            }, function (error) {
                _this.loading = false;
                _this.data = [];
            });
        }
        else {
            var isFromLocation = this.type == 'from' ? 'yes' : 'no';
            var alternateLocation = '';
            if (this.type == 'from') {
                alternateLocation = localStorage.getItem('__to') || '';
            }
            else {
                alternateLocation = localStorage.getItem('__from') || '';
            }
            this.loading = true;
            this.flightService.searchRoute('', isFromLocation, alternateLocation).subscribe(function (response) {
                _this.loading = false;
                var opResult = _this.groupByKey(response, 'key');
                var airportArray = [];
                for (var _i = 0, _a = Object.entries(opResult); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    airportArray.push({
                        key: key,
                        value: value
                    });
                }
                airportArray = airportArray.sort(function (a, b) { return a.key.localeCompare(b.key); });
                for (var i = 0; i < airportArray.length; i++) {
                    for (var j = 0; j < airportArray[i].value.length; j++) {
                        if (airportArray[i].value[j].code != 'AMD') {
                            airportArray[i].value[j].display_name = airportArray[i].value[j].city + "," + airportArray[i].value[j].country + ",(" + airportArray[i].value[j].code + ")," + airportArray[i].value[j].name;
                        }
                    }
                }
                _this.data = airportArray;
            }, function (error) {
                _this.data = [];
                _this.loading = false;
            });
        }
    };
    AirportSuggestionComponent.prototype.groupByKey = function (array, key) {
        return array
            .reduce(function (hash, obj) {
            var _a;
            if (obj[key] === undefined)
                return hash;
            return Object.assign(hash, (_a = {}, _a[obj[key]] = (hash[obj[key]] || []).concat(obj), _a));
        }, {});
    };
    AirportSuggestionComponent.prototype.selectAirport = function (event) {
        this.closeAirportSuggestion.emit(this.type);
        if (this.type == 'from') {
            this.changeValue.emit({ key: 'fromSearch', value: event });
            localStorage.setItem('__from', event.code);
        }
        else {
            this.changeValue.emit({ key: 'toSearch', value: event });
            localStorage.setItem('__to', event.code);
        }
    };
    AirportSuggestionComponent.prototype.isSuggestionWithCountry = function (code) {
        if (code == 'SCL') {
            return true;
        }
        else if (code == 'STI') {
            return true;
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input()
    ], AirportSuggestionComponent.prototype, "type");
    __decorate([
        core_1.Input()
    ], AirportSuggestionComponent.prototype, "airport");
    __decorate([
        core_1.Output()
    ], AirportSuggestionComponent.prototype, "closeAirportSuggestion");
    __decorate([
        core_1.Output()
    ], AirportSuggestionComponent.prototype, "changeValue");
    AirportSuggestionComponent = __decorate([
        core_1.Component({
            selector: 'app-airport-suggestion',
            templateUrl: './airport-suggestion.component.html',
            styleUrls: ['./airport-suggestion.component.scss']
        })
    ], AirportSuggestionComponent);
    return AirportSuggestionComponent;
}());
exports.AirportSuggestionComponent = AirportSuggestionComponent;
