import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
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
       
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgbModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    
    
  ],
  entryComponents:[SignupComponent,SigninComponent,VerifyOtpComponent,AsteriskMarkComponent]

})
export class PagesModule { }
