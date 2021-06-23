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
var last_min_hotel_deal_component_1 = require("./last-min-hotel-deal/last-min-hotel-deal.component");
var dr_adventure_component_1 = require("./dr-adventure/dr-adventure.component");
var ngx_gallery_1 = require("ngx-gallery");
var flight_search_widget_component_1 = require("./flight-search-widget/flight-search-widget.component");
var hotel_search_widget_component_1 = require("./hotel-search-widget/hotel-search-widget.component");
var vacation_search_widget_component_1 = require("./vacation-search-widget/vacation-search-widget.component");
var ng_select_1 = require("@ng-select/ng-select");
var cookie_policy_component_1 = require("../cookie-policy/cookie-policy.component");
var angular_1 = require("swiper/angular");
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
                last_min_hotel_deal_component_1.LastMinHotelDealComponent,
                dr_adventure_component_1.DrAdventureComponent,
                flight_search_widget_component_1.FlightSearchWidgetComponent,
                hotel_search_widget_component_1.HotelSearchWidgetComponent,
                vacation_search_widget_component_1.VacationSearchWidgetComponent,
                cookie_policy_component_1.CookiePolicyComponent
            ],
            imports: [
                common_1.CommonModule,
                home_routing_module_1.HomeRoutingModule,
                components_module_1.ComponentsModule,
                ng_bootstrap_1.NgbModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
                calendar_1.CalendarModule,
                ngx_gallery_1.NgxGalleryModule,
                ng_select_1.NgSelectModule,
                angular_1.SwiperModule
            ],
            exports: [
                flight_search_widget_component_1.FlightSearchWidgetComponent,
                hotel_search_widget_component_1.HotelSearchWidgetComponent,
                vacation_search_widget_component_1.VacationSearchWidgetComponent
            ],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA
            ], entryComponents: [cookie_policy_component_1.CookiePolicyComponent]
        })
    ], HomeModule);
    return HomeModule;
}());
exports.HomeModule = HomeModule;
