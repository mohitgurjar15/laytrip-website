import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryFooterComponent } from './secondary-footer/secondary-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { PagesModule } from '../pages/pages.module';
import { SigninComponent } from 'laytrip/src/app/pages/user/signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginComponent } from 'laytrip/src/app/pages/user/social-login/social-login.component';



@NgModule({
  declarations: [SecondaryFooterComponent,SigninComponent,SocialLoginComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
  ],
  entryComponents:[SigninComponent,SocialLoginComponent]
})
export class ElementsModule { }
