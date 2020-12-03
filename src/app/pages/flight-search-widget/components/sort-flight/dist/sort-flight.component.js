"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SortFlightComponent = void 0;
var core_1 = require("@angular/core");
var SortFlightComponent = /** @class */ (function () {
    function SortFlightComponent(route) {
        this.route = route;
        this.sortFlight = new core_1.EventEmitter();
        this.sortType = 'lh_price';
        this.departureCode = '';
        this.arrivalCode = '';
        this.lowToHighToggle = false;
        this.departureCode = this.route.snapshot.queryParams['departure'];
        this.arrivalCode = this.route.snapshot.queryParams['arrival'];
    }
    SortFlightComponent.prototype.ngOnInit = function () {
        this.loadJquery();
    };
    SortFlightComponent.prototype.loadJquery = function () {
        // Start filter Shortby js
        $(document).on('show', '#accordion', function (e) {
            $(e.target).prev('.accordion-heading').addClass('accordion-opened');
        });
        $(document).on('hide', '#accordion', function (e) {
            $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
        });
    };
    SortFlightComponent.prototype.sortFlightData = function (key, order, name) {
        this.sortType = name;
        this.sortFlight.emit({ key: key, order: order });
    };
    SortFlightComponent.prototype.resetFilter = function (key, order) {
        this.sortType = 'lh_price';
        this.sortFlight.emit({ key: key, order: order });
    };
    SortFlightComponent.prototype.ngOnChanges = function (changes) {
        if (changes['flightDetails'].currentValue != 'undefined') {
            if (this.flightDetails != 'undefined') {
                this.flightDetails = changes['flightDetails'].currentValue;
            }
        }
    };
    SortFlightComponent.prototype.toggleLowToHigh = function () {
        this.lowToHighToggle = !this.lowToHighToggle;
    };
    __decorate([
        core_1.Output()
    ], SortFlightComponent.prototype, "sortFlight");
    __decorate([
        core_1.Input()
    ], SortFlightComponent.prototype, "flightDetails");
    SortFlightComponent = __decorate([
        core_1.Component({
            selector: 'app-sort-flight',
            templateUrl: './sort-flight.component.html',
            styleUrls: ['./sort-flight.component.scss']
        })
    ], SortFlightComponent);
    return SortFlightComponent;
}());
exports.SortFlightComponent = SortFlightComponent;
