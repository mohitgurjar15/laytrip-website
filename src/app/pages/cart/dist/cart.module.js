"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CartModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var cart_routing_module_1 = require("./cart-routing.module");
var booking_component_1 = require("./booking/booking.component");
var ng5_slider_1 = require("ng5-slider");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var _helpers_module_1 = require("../../_helpers/_helpers.module");
var components_module_1 = require("../../components/components.module");
var forms_1 = require("@angular/forms");
var ng_select_1 = require("@ng-select/ng-select");
var ngx_cookie_1 = require("ngx-cookie");
var calendar_1 = require("primeng/calendar");
var home_module_1 = require("../home/home.module");
var checkout_component_1 = require("./checkout/checkout.component");
var CartModule = /** @class */ (function () {
    function CartModule() {
    }
    CartModule = __decorate([
        core_1.NgModule({
            declarations: [booking_component_1.BookingComponent, checkout_component_1.CheckoutComponent],
            imports: [
                common_1.CommonModule,
                cart_routing_module_1.CartRoutingModule,
                ng5_slider_1.Ng5SliderModule,
                ng_bootstrap_1.NgbModule,
                _helpers_module_1.HelpersModule,
                components_module_1.ComponentsModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_select_1.NgSelectModule,
                ngx_cookie_1.CookieModule.forRoot(),
                calendar_1.CalendarModule,
                home_module_1.HomeModule
            ]
        })
    ], CartModule);
    return CartModule;
}());
exports.CartModule = CartModule;
