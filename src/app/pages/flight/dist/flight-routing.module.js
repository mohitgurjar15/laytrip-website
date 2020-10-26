"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var flight_search_component_1 = require("./flight-search/flight-search.component");
var flight_traveler_component_1 = require("./flight-traveler/flight-traveler.component");
var flight_checkout_component_1 = require("./flight-checkout/flight-checkout.component");
var flight_payment_component_1 = require("./flight-payment/flight-payment.component");
var routes = [
    {
        path: 'search',
        component: flight_search_component_1.FlightSearchComponent
    },
    {
        path: 'traveler/:rc',
        component: flight_traveler_component_1.FlightTravelerComponent
    },
    {
        path: 'payment/:rc',
        component: flight_payment_component_1.FlightPaymentComponent
    },
    {
        path: 'checkout/:rc',
        component: flight_checkout_component_1.FlightCheckoutComponent
    }
];
var FlightRoutingModule = /** @class */ (function () {
    function FlightRoutingModule() {
    }
    FlightRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], FlightRoutingModule);
    return FlightRoutingModule;
}());
exports.FlightRoutingModule = FlightRoutingModule;
