import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { GoogleLoginProvider } from './social-login/google.login-provider';
import { SocialAuthServiceConfig ,GoogleLoginProvider} from 'angularx-social-login';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UserRoutingModule, 
    NgbModule
    
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [       
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '154754991565-9lo2g91remkuefocr7q2sb92g24jntba.apps.googleusercontent.com'
            ),
          }
        ] 
      } as SocialAuthServiceConfig,
    }
  ],
  declarations: [],
})
export class UserModule { }
