import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { FeaturedCityComponent } from './home/featured-city/featured-city.component';
import { DiscoverCityComponent } from './home/discover-city/discover-city.component';
import { DealComponent } from './home/deal/deal.component';
import { UserBenefitComponent } from './home/user-benefit/user-benefit.component';
import { MobileAndSubscribeComponent } from './home/mobile-and-subscribe/mobile-and-subscribe.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [HomeComponent, FeaturedCityComponent, DiscoverCityComponent, DealComponent, UserBenefitComponent, MobileAndSubscribeComponent],
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
