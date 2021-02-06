import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceConfig, GoogleLoginProvider,SocialLoginModule } from 'angular-6-social-login';
// import { GoogleLoginProvider } from './social-login/google.login-provider';

// Configs 
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("154754991565-9lo2g91remkuefocr7q2sb92g24jntba.apps.googleusercontent.com")
        }
      ]
  )
  return config;
}
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UserRoutingModule, 
    NgbModule,
    SocialLoginModule
    
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  declarations: [],
})
export class UserModule { }
