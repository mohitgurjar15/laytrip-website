import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';
import { PagesComponent } from './pages.component';
import { MainHeaderComponent } from '../elements/main-header/main-header.component';
import { MainFooterComponent } from '../elements/main-footer/main-footer.component';
import { SigninComponent } from './user/signin/signin.component';
import { SocialLoginComponent } from './user/social-login/social-login.component';

@NgModule({
  declarations: [ 
    PagesComponent,
    MainHeaderComponent,
    MainFooterComponent,
    SigninComponent,
    SocialLoginComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgbModule,
    AutocompleteLibModule,
    TranslateModule,
    ComponentsModule
  ]
})
export class PagesModule { }
