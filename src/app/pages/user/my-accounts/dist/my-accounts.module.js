"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MyAccountsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var my_accounts_routing_module_1 = require("./my-accounts-routing.module");
var profile_component_1 = require("./profile/profile.component");
var my_accounts_nav_component_1 = require("./my-accounts-nav/my-accounts-nav.component");
var forms_1 = require("@angular/forms");
var ng_select_1 = require("@ng-select/ng-select");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var list_traveller_component_1 = require("./travellers/list-traveller.component");
var list_bookings_component_1 = require("./bookings/list-bookings.component");
var flights_component_1 = require("./bookings/flights/flights.component");
var hotels_component_1 = require("./bookings/hotels/hotels.component");
var calendar_1 = require("primeng/calendar");
var list_payment_history_component_1 = require("./payment-history/list-payment-history.component");
var history_list_component_1 = require("./payment-history/history-list/history-list.component");
var view_history_component_1 = require("./payment-history/view-history/view-history.component");
var flight_module_1 = require("../../flight/flight.module");
var change_password_component_1 = require("./change-password/change-password.component");
var traveller_form_component_1 = require("./travellers/traveller-form/traveller-form.component");
var subscription_plan_component_1 = require("./subscription/subscription-plan.component");
var account_card_list_component_1 = require("./account-card-list/account-card-list.component");
var card_action_form_component_1 = require("./account-card-list/card-action-form/card-action-form.component");
var my_wallet_component_1 = require("./my-wallet/my-wallet.component");
var search_trip_component_1 = require("./search-trip/search-trip.component");
var flight_trip_detail_component_1 = require("./flight-trip-detail/flight-trip-detail.component");
var trip_not_found_component_1 = require("./trip-not-found/trip-not-found.component");
var angular2_text_mask_1 = require("angular2-text-mask");
var confirmation_modal_component_1 = require("../../../components/confirmation-modal/confirmation-modal.component");
var home_rentals_component_1 = require("./bookings/home-rentals/home-rentals.component");
var plan_subscription_component_1 = require("./plan-subscription/plan-subscription.component");
var components_module_1 = require("../../../components/components.module");
var my_wallet_add_points_component_1 = require("./my-wallet-add-points/my-wallet-add-points.component");
var send_email_popup_component_1 = require("./bookings/send-email-popup/send-email-popup.component");
var account_component_1 = require("./account/account.component");
var preferances_component_1 = require("./preferances/preferances.component");
var booking_traveler_component_1 = require("./bookings/booking-traveler/booking-traveler.component");
var cart_price_summary_component_1 = require("./bookings/cart-price-summary/cart-price-summary.component");
var ngx_mask_1 = require("ngx-mask");
var MyAccountsModule = /** @class */ (function () {
    function MyAccountsModule() {
    }
    MyAccountsModule = __decorate([
        core_1.NgModule({
            declarations: [
                profile_component_1.ProfileComponent,
                my_accounts_nav_component_1.MyAccountsNavComponent,
                list_bookings_component_1.ListBookingsComponent,
                list_traveller_component_1.ListTravellerComponent,
                traveller_form_component_1.TravellerFormComponent,
                flights_component_1.FlightsComponent,
                hotels_component_1.HotelsComponent,
                home_rentals_component_1.HomeRentalsComponent,
                list_payment_history_component_1.ListPaymentHistoryComponent,
                history_list_component_1.HistoryListComponent,
                view_history_component_1.ViewHistoryComponent,
                change_password_component_1.ChangePasswordComponent,
                subscription_plan_component_1.SubscriptionPlanComponent,
                account_card_list_component_1.AccountCardListComponent,
                card_action_form_component_1.CardActionFormComponent,
                confirmation_modal_component_1.ConfirmationModalComponent,
                my_wallet_component_1.MyWalletComponent,
                search_trip_component_1.SearchTripComponent,
                flight_trip_detail_component_1.FlightTripDetailComponent,
                trip_not_found_component_1.TripNotFoundComponent,
                plan_subscription_component_1.PlanSubscriptionComponent,
                my_wallet_add_points_component_1.MyWalletAddPointsComponent,
                send_email_popup_component_1.SendEmailPopupComponent,
                account_component_1.AccountComponent,
                preferances_component_1.PreferancesComponent,
                booking_traveler_component_1.BookingTravelerComponent,
                cart_price_summary_component_1.CartPriceSummaryComponent,
            ],
            imports: [
                common_1.CommonModule,
                my_accounts_routing_module_1.MyAccountsRoutingModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_select_1.NgSelectModule,
                ng_bootstrap_1.NgbModule,
                calendar_1.CalendarModule,
                flight_module_1.FlightModule,
                angular2_text_mask_1.TextMaskModule,
                components_module_1.ComponentsModule,
                ngx_mask_1.NgxMaskModule.forRoot(),
            ],
            providers: [common_1.DatePipe, ng_bootstrap_1.NgbActiveModal],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            entryComponents: [traveller_form_component_1.TravellerFormComponent, card_action_form_component_1.CardActionFormComponent, confirmation_modal_component_1.ConfirmationModalComponent, send_email_popup_component_1.SendEmailPopupComponent]
        })
    ], MyAccountsModule);
    return MyAccountsModule;
}());
exports.MyAccountsModule = MyAccountsModule;
