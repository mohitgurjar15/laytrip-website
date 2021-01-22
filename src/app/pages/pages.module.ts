import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComponentsModule } from '../components/components.module';
import { PagesComponent } from './pages.component';
import { MainHeaderComponent } from '../elements/main-header/main-header.component';
import { MainFooterComponent } from '../elements/main-footer/main-footer.component';
import { SigninComponent } from './user/signin/signin.component';
import { SocialLoginComponent } from './user/social-login/social-login.component';
import { SignupComponent } from './user/signup/signup.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { AuthComponent } from './user/auth/auth.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VerifyOtpComponent } from './user/verify-otp/verify-otp.component';
import { AsteriskMarkComponent } from '../components/asterisk-mark/asterisk-mark.component';
// NG5 SLIDER
import { Ng5SliderModule } from 'ng5-slider';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FaqComponent } from './faq/faq.component';
import { WhyLaytripComponent } from './why-laytrip/why-laytrip.component';
import { PartialPaymentComponent } from './partial-payment/partial-payment.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { SsoLoginComponent } from './sso-login/sso-login.component';
import { CovidPageComponent } from './covid-page/covid-page.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CmsPagesComponent } from './cms-pages/cms-pages.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [
    PagesComponent,
    MainHeaderComponent,
    MainFooterComponent,
    SigninComponent,
    SocialLoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    VerifyOtpComponent,
    AuthComponent,
    AsteriskMarkComponent,
    ResetPasswordComponent,
    ContactUsComponent,
    CancellationPolicyComponent,
    PrivacyPolicyComponent,
    FaqComponent,
    WhyLaytripComponent,
    PartialPaymentComponent,
    DownloadAppComponent,
    ComingSoonComponent,
    SsoLoginComponent,
    CovidPageComponent,
    AboutUsComponent,
    CmsPagesComponent,
    
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgbModule,
    NgSelectModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    // NG5 SLIDER
    Ng5SliderModule,
    NgOtpInputModule,
    CountdownModule
  ],
  entryComponents: [SignupComponent, SigninComponent, VerifyOtpComponent, AsteriskMarkComponent, AuthComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule { }
