"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var hotel_routing_module_1 = require("./hotel-routing.module");
var hotel_search_component_1 = require("./hotel-search/hotel-search.component");
var hotel_loader_component_1 = require("./components/hotel-loader/hotel-loader.component");
var hotel_popup_loader_component_1 = require("./components/hotel-popup-loader/hotel-popup-loader.component");
var hotel_not_found_component_1 = require("./components/hotel-not-found/hotel-not-found.component");
var hotel_error_component_1 = require("./components/hotel-error/hotel-error.component");
var sort_hotel_component_1 = require("./components/sort-hotel/sort-hotel.component");
var filter_hotel_component_1 = require("./components/filter-hotel/filter-hotel.component");
var hotel_item_wrapper_component_1 = require("./components/hotel-item-wrapper/hotel-item-wrapper.component");
var hotel_search_bar_component_1 = require("./components/hotel-search-bar/hotel-search-bar.component");
var hotel_detail_component_1 = require("./components/hotel-detail/hotel-detail.component");
var ng5_slider_1 = require("ng5-slider");
var components_module_1 = require("../../components/components.module");
// import { ClickOutSideDirective } from '../../_helpers/clickOutSide.directive';
var forms_1 = require("@angular/forms");
var ng_select_1 = require("@ng-select/ng-select");
var ngx_cookie_1 = require("ngx-cookie");
var calendar_1 = require("primeng/calendar");
// // AGM (ANGULAR GOOGLE MAP)
var core_2 = require("@agm/core");
// NGX-GALLERY
var ngx_gallery_1 = require("ngx-gallery");
// HELPERS MODULE
var _helpers_module_1 = require("../../_helpers/_helpers.module");
var js_marker_clusterer_1 = require("@agm/js-marker-clusterer");
var hotel_payment_component_1 = require("./hotel-payment/hotel-payment.component");
var hotel_policy_popup_component_1 = require("./components/hotel-policy-popup/hotel-policy-popup.component");
var home_module_1 = require("../home/home.module");
var ngx_slider_1 = require("@angular-slider/ngx-slider");
var HotelModule = /** @class */ (function () {
    function HotelModule() {
    }
    HotelModule = __decorate([
        core_1.NgModule({
            declarations: [
                hotel_search_component_1.HotelSearchComponent,
                hotel_loader_component_1.HotelLoaderComponent,
                hotel_popup_loader_component_1.HotelPopupLoaderComponent,
                hotel_not_found_component_1.HotelNotFoundComponent,
                hotel_error_component_1.HotelErrorComponent,
                sort_hotel_component_1.SortHotelComponent,
                filter_hotel_component_1.FilterHotelComponent,
                hotel_item_wrapper_component_1.HotelItemWrapperComponent,
                hotel_search_bar_component_1.HotelSearchBarComponent,
                // ClickOutSideDirective,
                hotel_detail_component_1.HotelDetailComponent,
                hotel_payment_component_1.HotelPaymentComponent,
                hotel_policy_popup_component_1.HotelPolicyPopupComponent
            ],
            imports: [
                common_1.CommonModule,
                hotel_routing_module_1.HotelRoutingModule,
                ng5_slider_1.Ng5SliderModule,
                _helpers_module_1.HelpersModule,
                components_module_1.ComponentsModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_bootstrap_1.NgbModule,
                ng_select_1.NgSelectModule,
                ngx_slider_1.NgxSliderModule,
                ngx_cookie_1.CookieModule.forRoot(),
                calendar_1.CalendarModule,
                core_2.AgmCoreModule.forRoot({
                    // apiKey: 'AIzaSyB63siq6uISCHD-x3MkitGQogoz8n7jy7M',
                    apiKey: 'AIzaSyB7Ws9zJ9ozVruSjF2N3pDVsqHF-h1QtBU',
                    libraries: ['places']
                }),
                js_marker_clusterer_1.AgmJsMarkerClustererModule,
                ngx_gallery_1.NgxGalleryModule,
                home_module_1.HomeModule
            ],
            exports: [
                hotel_loader_component_1.HotelLoaderComponent,
                hotel_popup_loader_component_1.HotelPopupLoaderComponent,
                hotel_not_found_component_1.HotelNotFoundComponent,
                home_module_1.HomeModule
            ],
            entryComponents: [hotel_policy_popup_component_1.HotelPolicyPopupComponent]
        })
    ], HotelModule);
    return HotelModule;
}());
exports.HotelModule = HotelModule;
