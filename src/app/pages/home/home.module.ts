import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DealComponent } from './deal/deal.component';
import { FeaturedCityComponent } from './featured-city/featured-city.component';
import { DiscoverCityComponent } from './discover-city/discover-city.component';
import { UserBenefitComponent } from './user-benefit/user-benefit.component';
import { MobileAndSubscribeComponent } from './mobile-and-subscribe/mobile-and-subscribe.component';
import { PartialPaymentComponent } from './partial-payment/partial-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { LastMinHotelDealComponent } from './last-min-hotel-deal/last-min-hotel-deal.component';
import { DrAdventureComponent } from './dr-adventure/dr-adventure.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { FlightSearchWidgetComponent } from './flight-search-widget/flight-search-widget.component';
import { HotelSearchWidgetComponent } from './hotel-search-widget/hotel-search-widget.component';
import { VacationSearchWidgetComponent } from './vacation-search-widget/vacation-search-widget.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CookiePolicyComponent } from '../cookie-policy/cookie-policy.component';
import { SwiperModule } from "swiper/angular";

@NgModule({
  declarations: [
    HomeComponent,
    FeaturedCityComponent,
    DiscoverCityComponent,
    DealComponent,
    UserBenefitComponent,
    MobileAndSubscribeComponent,
    PartialPaymentComponent,
    LastMinHotelDealComponent,
    DrAdventureComponent,
    FlightSearchWidgetComponent,
    HotelSearchWidgetComponent,
    VacationSearchWidgetComponent,
    CookiePolicyComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    CalendarModule,
    NgxGalleryModule,
    NgSelectModule,
    SwiperModule
  ],
  exports: [
    FlightSearchWidgetComponent,
    HotelSearchWidgetComponent,
    VacationSearchWidgetComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ], entryComponents: [CookiePolicyComponent]
})
export class HomeModule { }
