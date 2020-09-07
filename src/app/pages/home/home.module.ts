import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DealComponent } from './deal/deal.component';
import { FeaturedCityComponent } from './featured-city/featured-city.component';
import { DiscoverCityComponent } from './discover-city/discover-city.component';
import { UserBenefitComponent } from './user-benefit/user-benefit.component';
import { MobileAndSubscribeComponent } from './mobile-and-subscribe/mobile-and-subscribe.component';
import { PartialPaymentComponent } from './partial-payment/partial-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    FeaturedCityComponent,
    DiscoverCityComponent,
    DealComponent,
    UserBenefitComponent,
    MobileAndSubscribeComponent,
    PartialPaymentComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslateModule,
    ComponentsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HomeModule { }
