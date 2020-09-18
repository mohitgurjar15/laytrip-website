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
var ngx_daterangepicker_material_1 = require("ngx-daterangepicker-material");
var list_traveller_component_1 = require("./travellers/list-traveller.component");
var crud_component_1 = require("./travellers/crud/crud.component");
var list_bookings_component_1 = require("./bookings/list-bookings.component");
var flights_component_1 = require("./bookings/flights/flights.component");
var hotels_component_1 = require("./bookings/hotels/hotels.component");
var accommodations_component_1 = require("./bookings/accommodations/accommodations.component");
var flight_loader_component_1 = require("../../flight/components/flight-loader/flight-loader.component");
var flight_not_found_component_1 = require("../../flight/components/flight-not-found/flight-not-found.component");
var MyAccountsModule = /** @class */ (function () {
    function MyAccountsModule() {
    }
    MyAccountsModule = __decorate([
        core_1.NgModule({
            declarations: [profile_component_1.ProfileComponent, my_accounts_nav_component_1.MyAccountsNavComponent, list_bookings_component_1.ListBookingsComponent, list_traveller_component_1.ListTravellerComponent, crud_component_1.CrudComponent, flights_component_1.FlightsComponent, hotels_component_1.HotelsComponent, accommodations_component_1.AccommodationsComponent, flight_loader_component_1.FlightLoaderComponent, flight_not_found_component_1.FlightNotFoundComponent],
            imports: [
                common_1.CommonModule,
                my_accounts_routing_module_1.MyAccountsRoutingModule,
                forms_1.ReactiveFormsModule,
                ng_select_1.NgSelectModule,
                ng_bootstrap_1.NgbModule,
                ngx_daterangepicker_material_1.NgxDaterangepickerMd.forRoot(),
            ],
            providers: [common_1.DatePipe]
        })
    ], MyAccountsModule);
    return MyAccountsModule;
}());
exports.MyAccountsModule = MyAccountsModule;
