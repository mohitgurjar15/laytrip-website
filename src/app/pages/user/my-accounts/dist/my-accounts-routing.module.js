"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MyAccountsRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var list_bookings_component_1 = require("./bookings/list-bookings.component");
var profile_component_1 = require("./profile/profile.component");
var list_traveller_component_1 = require("./travellers/list-traveller.component");
var routes = [
    {
        path: '',
        component: profile_component_1.ProfileComponent
    },
    {
        path: 'profile',
        component: profile_component_1.ProfileComponent
    },
    {
        path: 'bookings',
        component: list_bookings_component_1.ListBookingsComponent
    },
    {
        path: 'travellers',
        component: list_traveller_component_1.ListTravellerComponent
    },
];
var MyAccountsRoutingModule = /** @class */ (function () {
    function MyAccountsRoutingModule() {
    }
    MyAccountsRoutingModule = __decorate([
        core_1.NgModule({
            declarations: [],
            imports: [
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule]
        })
    ], MyAccountsRoutingModule);
    return MyAccountsRoutingModule;
}());
exports.MyAccountsRoutingModule = MyAccountsRoutingModule;
