import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightRoutingModule } from './flight-routing.module';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { SortFlightComponent } from './components/sort-flight/sort-flight.component';
import { FilterFlightComponent } from './components/filter-flight/filter-flight.component';
import { FlightPriceSliderComponent } from './components/flight-price-slider/flight-price-slider.component';
import { FlightItemWrapperComponent } from './components/flight-item-wrapper/flight-item-wrapper.component';
import { FlightSearchBarComponent } from './components/flight-search-bar/flight-search-bar.component';
import { Ng5SliderModule } from 'ng5-slider';
import { FlightNotFoundComponent } from './components/flight-not-found/flight-not-found.component';
import { FlightTravelerComponent } from './flight-traveler/flight-traveler.component';
import { FlightSummaryComponent } from './flight-summary/flight-summary.component';
import { ComponentsModule } from '../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlightCheckoutComponent } from './flight-checkout/flight-checkout.component';
import { BookingSummaryLoaderComponent } from './components/booking-summary-loader/booking-summary-loader.component';
import { FlightConfirmationComponent } from './components/flight-confirmation/flight-confirmation.component';
import { CookieModule } from 'ngx-cookie';
import { FlightBookingFailedComponent } from './components/flight-booking-failed/flight-booking-failed.component';
import { CalendarModule } from 'primeng/calendar';
import { FlightLoaderComponent } from './components/flight-loader/flight-loader.component';
import { FlightNotAvailableComponent } from './components/flight-not-available/flight-not-available.component';
import { FlightSessionTimeOutComponent } from './components/flight-session-time-out/flight-session-time-out.component';
import { BaggagePolicyPopupComponent } from './components/baggage-policy-popup/baggage-policy-popup.component';
import { CancellationPolicyPopupComponent } from './components/cancellation-policy-popup/cancellation-policy-popup.component';
import { FlightPaymentComponent } from './flight-payment/flight-payment.component';
import { FlightSummaryLoaderComponent } from './components/flight-summary-loader/flight-summary-loader.component';
import { FlightErrorComponent } from './components/flight-error/flight-error.component';
import { PopupTermConditionComponent } from './components/popup-term-condition/popup-term-condition.component';
import { PopupLoaderComponent } from './components/popup-loader/popup-loader.component';

// HELPERS MODULE
import { HelpersModule } from '../../_helpers/_helpers.module';
import { HomeModule } from '../home/home.module';
import { FlightCartItemComponent } from './components/flight-cart-item/flight-cart-item.component';

@NgModule({
  declarations: [
    FlightSearchComponent,
    SortFlightComponent,
    FilterFlightComponent,
    FlightPriceSliderComponent,
    FlightItemWrapperComponent,
    FlightSearchBarComponent,
    FlightNotFoundComponent,
    FlightTravelerComponent,
    FlightSummaryComponent,
    FlightCheckoutComponent,
    BookingSummaryLoaderComponent,
    FlightConfirmationComponent,
    FlightBookingFailedComponent,
    FlightLoaderComponent,
    FlightNotAvailableComponent,
    FlightSessionTimeOutComponent,
    BaggagePolicyPopupComponent,
    CancellationPolicyPopupComponent,
    FlightPaymentComponent,
    FlightSummaryLoaderComponent,
    FlightErrorComponent,
    PopupTermConditionComponent,
    PopupLoaderComponent
  ],
  imports: [
    CommonModule,
    FlightRoutingModule,
    Ng5SliderModule,
    HelpersModule,
    ComponentsModule,
    FormsModule, 
    ReactiveFormsModule,
    NgSelectModule,
    CookieModule.forRoot(),
    CalendarModule,
    HomeModule
  ],
  exports:[
    FlightLoaderComponent,
    FlightNotFoundComponent,
    FlightConfirmationComponent,
    FlightSummaryComponent
  ]
})
export class FlightModule { }
