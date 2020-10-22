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
var account_card_list_component_1 = require("./account-card-list/account-card-list.component");
var list_bookings_component_1 = require("./bookings/list-bookings.component");
var change_password_component_1 = require("./change-password/change-password.component");
var flight_trip_detail_component_1 = require("./flight-trip-detail/flight-trip-detail.component");
var my_wallet_component_1 = require("./my-wallet/my-wallet.component");
var list_payment_history_component_1 = require("./payment-history/list-payment-history.component");
var profile_component_1 = require("./profile/profile.component");
var subscription_plan_component_1 = require("./subscription/subscription-plan.component");
var search_trip_component_1 = require("./search-trip/search-trip.component");
var list_traveller_component_1 = require("./travellers/list-traveller.component");
var plan_subscription_component_1 = require("./plan-subscription/plan-subscription.component");
var view_history_component_1 = require("./payment-history/view-history/view-history.component");
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
    {
        path: 'payment',
        component: list_payment_history_component_1.ListPaymentHistoryComponent
    },
    {
        path: 'payment/detail',
        component: view_history_component_1.ViewHistoryComponent
    },
    {
        path: 'settings/change-password',
        component: change_password_component_1.ChangePasswordComponent
    },
    {
        path: 'subscription',
        component: subscription_plan_component_1.SubscriptionPlanComponent
    },
    {
        path: 'subscription/:id',
        component: plan_subscription_component_1.PlanSubscriptionComponent
    },
    {
        path: 'account-card-list',
        component: account_card_list_component_1.AccountCardListComponent
    },
    {
        path: 'search-trip',
        component: search_trip_component_1.SearchTripComponent
    },
    {
        path: 'trip/:id',
        component: flight_trip_detail_component_1.FlightTripDetailComponent
    },
    {
        path: 'my-wallet',
        component: my_wallet_component_1.MyWalletComponent
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
