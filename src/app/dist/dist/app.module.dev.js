"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.HttpLoaderFactory = exports.AppModule = void 0;

var platform_browser_1 = require("@angular/platform-browser");

var core_1 = require("@angular/core");

var app_routing_module_1 = require("./app-routing.module");

var app_component_1 = require("./app.component");

var core_2 = require("@ngx-translate/core");

var http_loader_1 = require("@ngx-translate/http-loader");

var http_1 = require("@angular/common/http");

var not_found_component_1 = require("./pages/not-found/not-found.component");

var forms_1 = require("@angular/forms");

var elements_module_1 = require("./elements/elements.module");

var components_module_1 = require("./components/components.module");

var animations_1 = require("@angular/platform-browser/animations");

var ngx_toastr_1 = require("ngx-toastr");

var angularx_social_login_1 = require("angularx-social-login");

var apple_provider_1 = require("./pages/user/social-login/apple.provider");

var auth_guard_1 = require("./guard/auth.guard");

var AppModule =
/** @class */
function () {
  function AppModule() {}

  AppModule = __decorate([core_1.NgModule({
    declarations: [app_component_1.AppComponent, not_found_component_1.NotFoundComponent],
    imports: [platform_browser_1.BrowserModule.withServerTransition({
      appId: 'serverApp'
    }), app_routing_module_1.AppRoutingModule, http_1.HttpClientModule, elements_module_1.ElementsModule, forms_1.FormsModule, components_module_1.ComponentsModule, forms_1.ReactiveFormsModule, core_2.TranslateModule.forRoot({
      loader: {
        provide: core_2.TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [http_1.HttpClient]
      }
    }), animations_1.BrowserAnimationsModule, ngx_toastr_1.ToastrModule.forRoot(), angularx_social_login_1.SocialLoginModule],
    providers: [{
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [{
          id: apple_provider_1.AppleLoginProvider.PROVIDER_ID,
          provider: new apple_provider_1.AppleLoginProvider('com.laytrip.laytrips')
        }]
      }
    }, auth_guard_1.AuthGuard],
    bootstrap: [app_component_1.AppComponent]
  })], AppModule);
  return AppModule;
}();

exports.AppModule = AppModule; // required for AOT compilation

function HttpLoaderFactory(http) {
  return new http_loader_1.TranslateHttpLoader(http);
}

exports.HttpLoaderFactory = HttpLoaderFactory;