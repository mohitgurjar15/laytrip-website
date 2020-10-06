"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FlightModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var flight_routing_module_1 = require("./flight-routing.module");
var flight_search_component_1 = require("./flight-search/flight-search.component");
var sort_flight_component_1 = require("./components/sort-flight/sort-flight.component");
var filter_flight_component_1 = require("./components/filter-flight/filter-flight.component");
var flight_price_slider_component_1 = require("./components/flight-price-slider/flight-price-slider.component");
var flight_item_wrapper_component_1 = require("./components/flight-item-wrapper/flight-item-wrapper.component");
var flight_search_bar_component_1 = require("./components/flight-search-bar/flight-search-bar.component");
var ng5_slider_1 = require("ng5-slider");
var flight_not_found_component_1 = require("./components/flight-not-found/flight-not-found.component");
var flight_traveler_component_1 = require("./flight-traveler/flight-traveler.component");
var flight_summary_component_1 = require("./flight-summary/flight-summary.component");
var components_module_1 = require("../../components/components.module");
var clickOutSide_directive_1 = require("../../_helpers/clickOutSide.directive");
var forms_1 = require("@angular/forms");
var ng_select_1 = require("@ng-select/ng-select");
var flight_checkout_component_1 = require("./flight-checkout/flight-checkout.component");
var booking_summary_loader_component_1 = require("./components/booking-summary-loader/booking-summary-loader.component");
var flight_confirmation_component_1 = require("./components/flight-confirmation/flight-confirmation.component");
var ngx_cookie_1 = require("ngx-cookie");
var flight_booking_failed_component_1 = require("./components/flight-booking-failed/flight-booking-failed.component");
var calendar_1 = require("primeng/calendar");
var flight_loader_component_1 = require("./components/flight-loader/flight-loader.component");
var flight_not_available_component_1 = require("./components/flight-not-available/flight-not-available.component");
var flight_session_time_out_component_1 = require("./components/flight-session-time-out/flight-session-time-out.component");
var baggage_policy_popup_component_1 = require("./components/baggage-policy-popup/baggage-policy-popup.component");
var cancellation_policy_popup_component_1 = require("./components/cancellation-policy-popup/cancellation-policy-popup.component");
var FlightModule = /** @class */ (function () {
    function FlightModule() {
    }
    FlightModule = __decorate([
        core_1.NgModule({
            declarations: [
                flight_search_component_1.FlightSearchComponent,
                sort_flight_component_1.SortFlightComponent,
                filter_flight_component_1.FilterFlightComponent,
                flight_price_slider_component_1.FlightPriceSliderComponent,
                flight_item_wrapper_component_1.FlightItemWrapperComponent,
                flight_search_bar_component_1.FlightSearchBarComponent,
                flight_not_found_component_1.FlightNotFoundComponent,
                flight_traveler_component_1.FlightTravelerComponent,
                flight_summary_component_1.FlightSummaryComponent,
                clickOutSide_directive_1.ClickOutSideDirective,
                flight_checkout_component_1.FlightCheckoutComponent,
                booking_summary_loader_component_1.BookingSummaryLoaderComponent,
                flight_confirmation_component_1.FlightConfirmationComponent,
                flight_booking_failed_component_1.FlightBookingFailedComponent,
                flight_loader_component_1.FlightLoaderComponent,
                flight_not_available_component_1.FlightNotAvailableComponent,
                flight_session_time_out_component_1.FlightSessionTimeOutComponent,
                baggage_policy_popup_component_1.BaggagePolicyPopupComponent,
                cancellation_policy_popup_component_1.CancellationPolicyPopupComponent
            ],
            imports: [
                common_1.CommonModule,
                flight_routing_module_1.FlightRoutingModule,
                ng5_slider_1.Ng5SliderModule,
                components_module_1.ComponentsModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_select_1.NgSelectModule,
                ngx_cookie_1.CookieModule.forRoot(),
                calendar_1.CalendarModule
            ],
            exports: [flight_loader_component_1.FlightLoaderComponent, flight_not_found_component_1.FlightNotFoundComponent, flight_confirmation_component_1.FlightConfirmationComponent, flight_summary_component_1.FlightSummaryComponent]
        })
    ], FlightModule);
    return FlightModule;
}());
exports.FlightModule = FlightModule;
