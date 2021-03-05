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
var about_us_component_1 = require("./about-us/about-us.component");
var cancellation_policy_component_1 = require("./cancellation-policy/cancellation-policy.component");
var ccpa_component_1 = require("./ccpa/ccpa.component");
var cms_pages_component_1 = require("./cms-pages/cms-pages.component");
var coming_soon_component_1 = require("./coming-soon/coming-soon.component");
var covid_page_component_1 = require("./covid-page/covid-page.component");
var download_app_component_1 = require("./download-app/download-app.component");
var faq_component_1 = require("./faq/faq.component");
var pages_component_1 = require("./pages.component");
var partial_payment_component_1 = require("./partial-payment/partial-payment.component");
var privacy_policy_component_1 = require("./privacy-policy/privacy-policy.component");
var sso_login_component_1 = require("./sso-login/sso-login.component");
var terms_component_1 = require("./terms/terms.component");
var why_laytrip_component_1 = require("./why-laytrip/why-laytrip.component");
var routes = [
    {
        path: '',
        component: pages_component_1.PagesComponent,
        children: [
            {
                path: '',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./home/home.module'); }).then(function (m) { return m.HomeModule; }); }
            },
            {
                path: 'flight',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./flight/flight.module'); }).then(function (m) { return m.FlightModule; }); }
            },
            {
                path: 'hotel',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./hotel/hotel.module'); }).then(function (m) { return m.HotelModule; }); }
            },
            {
                path: 'vacation-rental',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./vacation-rental/vacation-rental.module'); }).then(function (m) { return m.VacationRentalModule; }); }
            },
            {
                path: 'account',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./user/user.module'); }).then(function (m) { return m.UserModule; }); }
            },
            {
                path: 'cart',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./cart/cart.module'); }).then(function (m) { return m.CartModule; }); }
            },
            {
                path: 'book',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./book/book.module'); }).then(function (m) { return m.BookModule; }); }
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
            {
                path: 'covid-19',
                component: covid_page_component_1.CovidPageComponent
            },
            {
                path: 'about',
                component: about_us_component_1.AboutUsComponent
            },
            {
                path: 'terms',
                component: terms_component_1.TermsComponent
            },
            {
                path: 'pages',
                component: cms_pages_component_1.CmsPagesComponent
            },
            {
                path: 'book',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./book/book.module'); }).then(function (m) { return m.BookModule; }); }
            },
            {
                path: 'ccpa',
                component: ccpa_component_1.CcpaComponent
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
