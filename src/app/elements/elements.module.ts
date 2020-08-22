import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryFooterComponent } from './secondary-footer/secondary-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { PagesModule } from '../pages/pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from '../pages/user/signin/signin.component';
import { SocialLoginComponent } from '../pages/user/social-login/social-login.component';



@NgModule({
  declarations: [SecondaryFooterComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
  ],
  entryComponents:[]
})
export class ElementsModule { }
