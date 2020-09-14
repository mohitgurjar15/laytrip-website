"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ComponentsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var search_airport_component_1 = require("./search-airport/search-airport.component");
var ng_select_1 = require("@ng-select/ng-select");
var forms_1 = require("@angular/forms");
var traveller_info_component_1 = require("./traveller-info/traveller-info.component");
var checkout_progress_component_1 = require("./checkout-progress/checkout-progress.component");
var adult_list_component_1 = require("./adult-list/adult-list.component");
var child_list_component_1 = require("./child-list/child-list.component");
var infant_list_component_1 = require("./infant-list/infant-list.component");
var booking_timer_component_1 = require("./booking-timer/booking-timer.component");
var payment_mode_component_1 = require("./payment-mode/payment-mode.component");
var card_list_component_1 = require("./card-list/card-list.component");
var add_card_component_1 = require("./add-card/add-card.component");
var traveler_form_component_1 = require("./traveler-form/traveler-form.component");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngx_countdown_1 = require("ngx-countdown");
var ng5_slider_1 = require("ng5-slider");
var full_page_overlay_loader_component_1 = require("./full-page-overlay-loader/full-page-overlay-loader.component");
var ngx_daterangepicker_material_1 = require("ngx-daterangepicker-material");
var ngx_cookie_1 = require("ngx-cookie");
var booking_enquiry_info_component_1 = require("./booking-enquiry-info/booking-enquiry-info.component");
var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        core_1.NgModule({
            declarations: [
                search_airport_component_1.SearchAirportComponent, traveller_info_component_1.TravellerInfoComponent, checkout_progress_component_1.CheckoutProgressComponent, adult_list_component_1.AdultListComponent, child_list_component_1.ChildListComponent, infant_list_component_1.InfantListComponent, booking_timer_component_1.BookingTimerComponent, payment_mode_component_1.PaymentModeComponent, card_list_component_1.CardListComponent, add_card_component_1.AddCardComponent, traveler_form_component_1.TravelerFormComponent, full_page_overlay_loader_component_1.FullPageOverlayLoaderComponent, booking_enquiry_info_component_1.BookingEnquiryInfoComponent
            ],
            imports: [
                common_1.CommonModule,
                ng_select_1.NgSelectModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_bootstrap_1.NgbModule,
                ngx_countdown_1.CountdownModule,
                ng5_slider_1.Ng5SliderModule,
                ngx_daterangepicker_material_1.NgxDaterangepickerMd.forRoot(),
                ngx_cookie_1.CookieModule.forRoot()
            ],
            exports: [
                search_airport_component_1.SearchAirportComponent,
                traveller_info_component_1.TravellerInfoComponent,
                checkout_progress_component_1.CheckoutProgressComponent,
                adult_list_component_1.AdultListComponent,
                child_list_component_1.ChildListComponent,
                infant_list_component_1.InfantListComponent,
                booking_timer_component_1.BookingTimerComponent,
                payment_mode_component_1.PaymentModeComponent,
                card_list_component_1.CardListComponent,
                add_card_component_1.AddCardComponent,
                full_page_overlay_loader_component_1.FullPageOverlayLoaderComponent,
                booking_enquiry_info_component_1.BookingEnquiryInfoComponent
            ],
            providers: [common_1.DatePipe]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());
exports.ComponentsModule = ComponentsModule;
