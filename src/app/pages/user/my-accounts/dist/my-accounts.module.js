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
var my_bookings_component_1 = require("./my-bookings/my-bookings.component");
var co_accounts_component_1 = require("./co-accounts/co-accounts.component");
var MyAccountsModule = /** @class */ (function () {
    function MyAccountsModule() {
    }
    MyAccountsModule = __decorate([
        core_1.NgModule({
            declarations: [profile_component_1.ProfileComponent, my_accounts_nav_component_1.MyAccountsNavComponent, my_bookings_component_1.MyBookingsComponent, co_accounts_component_1.CoAccountsComponent],
            imports: [
                common_1.CommonModule,
                my_accounts_routing_module_1.MyAccountsRoutingModule,
                forms_1.ReactiveFormsModule,
                ng_select_1.NgSelectModule,
                ng_bootstrap_1.NgbModule
            ],
            providers: [common_1.DatePipe]
        })
    ], MyAccountsModule);
    return MyAccountsModule;
}());
exports.MyAccountsModule = MyAccountsModule;
