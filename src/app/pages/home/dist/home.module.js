"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomeModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var home_routing_module_1 = require("./home-routing.module");
var home_component_1 = require("./home.component");
var core_2 = require("@ngx-translate/core");
var components_module_1 = require("../../components/components.module");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var deal_component_1 = require("./deal/deal.component");
var featured_city_component_1 = require("./featured-city/featured-city.component");
var discover_city_component_1 = require("./discover-city/discover-city.component");
var user_benefit_component_1 = require("./user-benefit/user-benefit.component");
var mobile_and_subscribe_component_1 = require("./mobile-and-subscribe/mobile-and-subscribe.component");
var partial_payment_component_1 = require("./partial-payment/partial-payment.component");
var forms_1 = require("@angular/forms");
var calendar_1 = require("primeng/calendar");
var HomeModule = /** @class */ (function () {
    function HomeModule() {
    }
    HomeModule = __decorate([
        core_1.NgModule({
            declarations: [
                home_component_1.HomeComponent,
                featured_city_component_1.FeaturedCityComponent,
                discover_city_component_1.DiscoverCityComponent,
                deal_component_1.DealComponent,
                user_benefit_component_1.UserBenefitComponent,
                mobile_and_subscribe_component_1.MobileAndSubscribeComponent,
                partial_payment_component_1.PartialPaymentComponent,
            ],
            imports: [
                common_1.CommonModule,
                home_routing_module_1.HomeRoutingModule,
                core_2.TranslateModule,
                components_module_1.ComponentsModule,
                ng_bootstrap_1.NgbModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                calendar_1.CalendarModule
            ]
        })
    ], HomeModule);
    return HomeModule;
}());
exports.HomeModule = HomeModule;
