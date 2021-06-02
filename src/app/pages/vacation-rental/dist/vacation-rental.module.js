"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VacationRentalModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var vacation_rental_routing_module_1 = require("./vacation-rental-routing.module");
var vacation_rental_search_component_1 = require("./vacation-rental-search/vacation-rental-search.component");
var vacation_rental_search_bar_component_1 = require("./components/vacation-rental-search-bar/vacation-rental-search-bar.component");
var sort_vacation_rental_component_1 = require("./components/sort-vacation-rental/sort-vacation-rental.component");
var filter_vacation_rental_component_1 = require("./components/filter-vacation-rental/filter-vacation-rental.component");
var vacation_item_wrapper_component_1 = require("./components/vacation-item-wrapper/vacation-item-wrapper.component");
var vacation_loader_component_1 = require("./components/vacation-loader/vacation-loader.component");
var calendar_1 = require("primeng/calendar");
var forms_1 = require("@angular/forms");
var ng_select_1 = require("@ng-select/ng-select");
var ng5_slider_1 = require("ng5-slider");
var vacation_not_found_component_1 = require("./components/vacation-not-found/vacation-not-found.component");
var components_module_1 = require("../../components/components.module");
var core_2 = require("@agm/core");
var js_marker_clusterer_1 = require("@agm/js-marker-clusterer");
var vacation_detail_component_1 = require("./components/vacation-detail/vacation-detail.component");
var ngx_gallery_1 = require("ngx-gallery");
var vacation_popup_loader_component_1 = require("./components/vacation-popup-loader/vacation-popup-loader.component");
var home_module_1 = require("../home/home.module");
// HELPERS MODULE
var _helpers_module_1 = require("../../_helpers/_helpers.module");
var VacationRentalModule = /** @class */ (function () {
    function VacationRentalModule() {
    }
    VacationRentalModule = __decorate([
        core_1.NgModule({
            declarations: [vacation_rental_search_component_1.VacationRentalSearchComponent, vacation_rental_search_bar_component_1.VacationRentalSearchBarComponent, sort_vacation_rental_component_1.SortVacationRentalComponent, filter_vacation_rental_component_1.FilterVacationRentalComponent, vacation_item_wrapper_component_1.VacationItemWrapperComponent, vacation_loader_component_1.VacationLoaderComponent, vacation_not_found_component_1.VacationNotFoundComponent, vacation_detail_component_1.VacationDetailComponent, vacation_popup_loader_component_1.VacationPopupLoaderComponent],
            imports: [
                common_1.CommonModule,
                vacation_rental_routing_module_1.VacationRentalRoutingModule,
                calendar_1.CalendarModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
                ng_select_1.NgSelectModule,
                ng5_slider_1.Ng5SliderModule,
                components_module_1.ComponentsModule,
                core_2.AgmCoreModule.forRoot({
                    // apiKey: 'AIzaSyB63siq6uISCHD-x3MkitGQogoz8n7jy7M',
                    apiKey: 'AIzaSyB7Ws9zJ9ozVruSjF2N3pDVsqHF-h1QtBU',
                    libraries: ['places']
                }),
                js_marker_clusterer_1.AgmJsMarkerClustererModule,
                ngx_gallery_1.NgxGalleryModule,
                home_module_1.HomeModule,
                _helpers_module_1.HelpersModule
            ],
            //schemas: [CUSTOM_ELEMENTS_SCHEMA],
            exports: [
                home_module_1.HomeModule
            ]
        })
    ], VacationRentalModule);
    return VacationRentalModule;
}());
exports.VacationRentalModule = VacationRentalModule;
