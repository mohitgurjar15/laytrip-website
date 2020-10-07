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
var accommodations_component_1 = require("./bookings/accommodations/accommodations.component");
var calendar_1 = require("primeng/calendar");
var list_payment_history_component_1 = require("./payment-history/list-payment-history.component");
var history_list_component_1 = require("./payment-history/history-list/history-list.component");
var view_history_component_1 = require("./payment-history/view-history/view-history.component");
var flight_module_1 = require("../../flight/flight.module");
var change_password_component_1 = require("./change-password/change-password.component");
var traveller_form_component_1 = require("./travellers/traveller-form/traveller-form.component");
var my_wallet_component_1 = require("./my-wallet/my-wallet.component");
var search_trip_component_1 = require("./search-trip/search-trip.component");
var flight_trip_detail_component_1 = require("./flight-trip-detail/flight-trip-detail.component");
var trip_not_found_component_1 = require("./trip-not-found/trip-not-found.component");
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
                accommodations_component_1.AccommodationsComponent,
                list_payment_history_component_1.ListPaymentHistoryComponent,
                history_list_component_1.HistoryListComponent,
                view_history_component_1.ViewHistoryComponent,
                change_password_component_1.ChangePasswordComponent,
                my_wallet_component_1.MyWalletComponent,
                search_trip_component_1.SearchTripComponent,
                flight_trip_detail_component_1.FlightTripDetailComponent,
                trip_not_found_component_1.TripNotFoundComponent,
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
            ],
            providers: [common_1.DatePipe, ng_bootstrap_1.NgbActiveModal],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            entryComponents: [traveller_form_component_1.TravellerFormComponent]
        })
    ], MyAccountsModule);
    return MyAccountsModule;
}());
exports.MyAccountsModule = MyAccountsModule;
