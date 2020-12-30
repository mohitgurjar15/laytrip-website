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
var ngx_cookie_1 = require("ngx-cookie");
var booking_enquiry_info_component_1 = require("./booking-enquiry-info/booking-enquiry-info.component");
var add_guest_card_component_1 = require("./add-guest-card/add-guest-card.component");
var calendar_1 = require("primeng/calendar");
var redeem_laycredit_component_1 = require("./redeem-laycredit/redeem-laycredit.component");
var booking_feedback_component_1 = require("./booking-feedback/booking-feedback.component");
var booking_as_login_or_guest_popup_component_1 = require("./booking-as-login-or-guest-popup/booking-as-login-or-guest-popup.component");
var ng_lottie_1 = require("ng-lottie");
var angular2_text_mask_1 = require("angular2-text-mask");
var plan_summary_component_1 = require("./plan-summary/plan-summary.component");
var add_points_component_1 = require("./add-points/add-points.component");
var redeem_laycredit_loader_component_1 = require("./redeem-laycredit-loader/redeem-laycredit-loader.component");
var toaster_component_1 = require("./toaster/toaster.component");
var share_social_media_component_1 = require("./share-social-media/share-social-media.component");
var rental_info_component_1 = require("./rental-shared-components/rental-info/rental-info.component");
// HOTEL SHARED COMPONENTS
var guest_info_component_1 = require("./hotel-shared-components/guest-info/guest-info.component");
var search_hotel_component_1 = require("./hotel-shared-components/search-hotel/search-hotel.component");
var core_2 = require("@ngx-translate/core");
var vacation_search_component_1 = require("./rental-shared-components/vacation-search/vacation-search.component");
var ngx_scrollbar_1 = require("ngx-scrollbar");
var flight_class_component_1 = require("./flight-class/flight-class.component");
var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        core_1.NgModule({
            declarations: [
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
                traveler_form_component_1.TravelerFormComponent,
                full_page_overlay_loader_component_1.FullPageOverlayLoaderComponent,
                booking_enquiry_info_component_1.BookingEnquiryInfoComponent,
                add_guest_card_component_1.AddGuestCardComponent,
                redeem_laycredit_component_1.RedeemLaycreditComponent,
                booking_feedback_component_1.BookingFeedbackComponent,
                booking_as_login_or_guest_popup_component_1.BookingAsLoginOrGuestPopupComponent,
                plan_summary_component_1.PlanSummaryComponent,
                add_points_component_1.AddPointsComponent,
                redeem_laycredit_loader_component_1.RedeemLaycreditLoaderComponent,
                toaster_component_1.ToasterComponent,
                share_social_media_component_1.ShareSocialMediaComponent,
                // HOTEL SHARED COMPONENT
                guest_info_component_1.GuestInfoComponent,
                search_hotel_component_1.SearchHotelComponent,
                rental_info_component_1.RentalInfoComponent,
                vacation_search_component_1.VacationSearchComponent,
                flight_class_component_1.FlightClassComponent
            ],
            imports: [
                common_1.CommonModule,
                ng_select_1.NgSelectModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_bootstrap_1.NgbModule,
                ngx_countdown_1.CountdownModule,
                ng5_slider_1.Ng5SliderModule,
                ngx_cookie_1.CookieModule.forRoot(),
                calendar_1.CalendarModule,
                ng_lottie_1.LottieAnimationViewModule.forRoot(),
                angular2_text_mask_1.TextMaskModule,
                core_2.TranslateModule,
                ngx_scrollbar_1.NgScrollbarModule
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
                booking_enquiry_info_component_1.BookingEnquiryInfoComponent,
                add_guest_card_component_1.AddGuestCardComponent,
                redeem_laycredit_component_1.RedeemLaycreditComponent,
                booking_feedback_component_1.BookingFeedbackComponent,
                booking_as_login_or_guest_popup_component_1.BookingAsLoginOrGuestPopupComponent,
                plan_summary_component_1.PlanSummaryComponent,
                add_points_component_1.AddPointsComponent,
                redeem_laycredit_loader_component_1.RedeemLaycreditLoaderComponent,
                toaster_component_1.ToasterComponent,
                share_social_media_component_1.ShareSocialMediaComponent,
                guest_info_component_1.GuestInfoComponent,
                search_hotel_component_1.SearchHotelComponent,
                rental_info_component_1.RentalInfoComponent,
                core_2.TranslateModule,
                vacation_search_component_1.VacationSearchComponent,
                ngx_scrollbar_1.NgScrollbarModule,
                flight_class_component_1.FlightClassComponent
            ],
            providers: [common_1.DatePipe]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());
exports.ComponentsModule = ComponentsModule;
