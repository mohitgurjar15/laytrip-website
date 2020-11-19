"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PagesRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var cancellation_policy_component_1 = require("./cancellation-policy/cancellation-policy.component");
var coming_soon_component_1 = require("./coming-soon/coming-soon.component");
var contact_us_component_1 = require("./contact-us/contact-us.component");
var download_app_component_1 = require("./download-app/download-app.component");
var faq_component_1 = require("./faq/faq.component");
var pages_component_1 = require("./pages.component");
var partial_payment_component_1 = require("./partial-payment/partial-payment.component");
var privacy_policy_component_1 = require("./privacy-policy/privacy-policy.component");
var sso_login_component_1 = require("./sso-login/sso-login.component");
var why_laytrip_component_1 = require("./why-laytrip/why-laytrip.component");
var routes = [
    {
        path: '',
        component: pages_component_1.PagesComponent,
        children: [
            {
                path: '',
                loadChildren: './home/home.module#HomeModule'
            },
            {
                path: 'flight',
                loadChildren: './flight/flight.module#FlightModule'
            },
            {
                path: 'account',
                loadChildren: './user/user.module#UserModule'
            },
            {
                path: 'contact-us',
                component: contact_us_component_1.ContactUsComponent
            },
            {
                path: 'cancellation-policy',
                component: cancellation_policy_component_1.CancellationPolicyComponent
            },
            {
                path: 'privacy-policy',
                component: privacy_policy_component_1.PrivacyPolicyComponent
            },
            {
                path: 'faq',
                component: faq_component_1.FaqComponent
            },
            {
                path: 'why-laytrip',
                component: why_laytrip_component_1.WhyLaytripComponent
            },
            {
                path: 'partial-payment',
                component: partial_payment_component_1.PartialPaymentComponent
            },
            {
                path: 'download-app',
                component: download_app_component_1.DownloadAppComponent
            },
            {
                path: 'coming-soon',
                component: coming_soon_component_1.ComingSoonComponent
            },
            {
                path: 'sson',
                component: sso_login_component_1.SsoLoginComponent
            },
        ]
    }
];
var PagesRoutingModule = /** @class */ (function () {
    function PagesRoutingModule() {
    }
    PagesRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], PagesRoutingModule);
    return PagesRoutingModule;
}());
exports.PagesRoutingModule = PagesRoutingModule;