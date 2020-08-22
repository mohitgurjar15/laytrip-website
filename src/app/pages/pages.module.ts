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

@NgModule({
  declarations: [ 
    PagesComponent,
    MainHeaderComponent,
    MainFooterComponent,
    SigninComponent,
    SocialLoginComponent,
    SignupComponent, 
    ForgotPasswordComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgbModule,
    TranslateModule,
    ComponentsModule
  ],
  entryComponents:[SignupComponent,SigninComponent]

})
export class PagesModule { }
