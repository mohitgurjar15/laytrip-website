"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PagesModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var pages_routing_module_1 = require("./pages-routing.module");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var core_2 = require("@ngx-translate/core");
var ng_select_1 = require("@ng-select/ng-select");
var components_module_1 = require("../components/components.module");
var pages_component_1 = require("./pages.component");
var main_header_component_1 = require("../elements/main-header/main-header.component");
var main_footer_component_1 = require("../elements/main-footer/main-footer.component");
var signin_component_1 = require("./user/signin/signin.component");
var social_login_component_1 = require("./user/social-login/social-login.component");
var signup_component_1 = require("./user/signup/signup.component");
var forgot_password_component_1 = require("./user/forgot-password/forgot-password.component");
var auth_component_1 = require("./user/auth/auth.component");
var forms_1 = require("@angular/forms");
var verify_otp_component_1 = require("./user/verify-otp/verify-otp.component");
var asterisk_mark_component_1 = require("../components/asterisk-mark/asterisk-mark.component");
// NG5 SLIDER
var ng5_slider_1 = require("ng5-slider");
var reset_password_component_1 = require("./user/reset-password/reset-password.component");
var contact_us_component_1 = require("./contact-us/contact-us.component");
var cancellation_policy_component_1 = require("./cancellation-policy/cancellation-policy.component");
var privacy_policy_component_1 = require("./privacy-policy/privacy-policy.component");
var faq_component_1 = require("./faq/faq.component");
var why_laytrip_component_1 = require("./why-laytrip/why-laytrip.component");
var partial_payment_component_1 = require("./partial-payment/partial-payment.component");
var download_app_component_1 = require("./download-app/download-app.component");
var coming_soon_component_1 = require("./coming-soon/coming-soon.component");
var sso_login_component_1 = require("./sso-login/sso-login.component");
var covid_page_component_1 = require("./covid-page/covid-page.component");
var about_us_component_1 = require("./about-us/about-us.component");
var cms_pages_component_1 = require("./cms-pages/cms-pages.component");
var ng_otp_input_1 = require("ng-otp-input");
var ngx_countdown_1 = require("ngx-countdown");
var PagesModule = /** @class */ (function () {
    function PagesModule() {
    }
    PagesModule = __decorate([
        core_1.NgModule({
            declarations: [
                pages_component_1.PagesComponent,
                main_header_component_1.MainHeaderComponent,
                main_footer_component_1.MainFooterComponent,
                signin_component_1.SigninComponent,
                social_login_component_1.SocialLoginComponent,
                signup_component_1.SignupComponent,
                forgot_password_component_1.ForgotPasswordComponent,
                verify_otp_component_1.VerifyOtpComponent,
                auth_component_1.AuthComponent,
                asterisk_mark_component_1.AsteriskMarkComponent,
                reset_password_component_1.ResetPasswordComponent,
                contact_us_component_1.ContactUsComponent,
                cancellation_policy_component_1.CancellationPolicyComponent,
                privacy_policy_component_1.PrivacyPolicyComponent,
                faq_component_1.FaqComponent,
                why_laytrip_component_1.WhyLaytripComponent,
                partial_payment_component_1.PartialPaymentComponent,
                download_app_component_1.DownloadAppComponent,
                coming_soon_component_1.ComingSoonComponent,
                sso_login_component_1.SsoLoginComponent,
                covid_page_component_1.CovidPageComponent,
                about_us_component_1.AboutUsComponent,
                cms_pages_component_1.CmsPagesComponent,
            ],
            imports: [
                common_1.CommonModule,
                pages_routing_module_1.PagesRoutingModule,
                ng_bootstrap_1.NgbModule,
                ng_select_1.NgSelectModule,
                core_2.TranslateModule,
                components_module_1.ComponentsModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                // NG5 SLIDER
                ng5_slider_1.Ng5SliderModule,
                ng_otp_input_1.NgOtpInputModule,
                ngx_countdown_1.CountdownModule
            ],
            entryComponents: [signup_component_1.SignupComponent, signin_component_1.SigninComponent, verify_otp_component_1.VerifyOtpComponent, asterisk_mark_component_1.AsteriskMarkComponent, auth_component_1.AuthComponent, forgot_password_component_1.ForgotPasswordComponent],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        })
    ], PagesModule);
    return PagesModule;
}());
exports.PagesModule = PagesModule;
