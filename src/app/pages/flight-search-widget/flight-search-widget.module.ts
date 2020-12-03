import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightSearchWidgetRoutingModule } from './flight-search-widget-routing.module';
import { FlightSearchComponent } from '../flight-search-widget/flight-search/flight-search.component';
import { SortFlightComponent } from '../flight-search-widget/components/sort-flight/sort-flight.component';
import { FilterFlightComponent } from '../flight-search-widget/components/filter-flight/filter-flight.component';
import { FlightPriceSliderComponent } from '../flight-search-widget/components/flight-price-slider/flight-price-slider.component';
import { FlightItemWrapperComponent } from '../flight-search-widget/components/flight-item-wrapper/flight-item-wrapper.component';
import { FlightSearchBarComponent } from '../flight-search-widget/components/flight-search-bar/flight-search-bar.component';
import { Ng5SliderModule } from 'ng5-slider';
import { FlightNotFoundComponent } from '../flight-search-widget/components/flight-not-found/flight-not-found.component';
import { FlightTravelerComponent } from '../flight-search-widget/flight-traveler/flight-traveler.component';
import { FlightSummaryComponent } from '../flight-search-widget/flight-summary/flight-summary.component';
import { ComponentsModule } from '../../components/components.module';
import { ClickOutSideDirective } from '../../_helpers/clickOutSide.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlightCheckoutComponent } from '../flight-search-widget/flight-checkout/flight-checkout.component';
import { BookingSummaryLoaderComponent } from '../flight-search-widget/components/booking-summary-loader/booking-summary-loader.component';
import { FlightConfirmationComponent } from '../flight-search-widget/components/flight-confirmation/flight-confirmation.component';
import { CookieModule } from 'ngx-cookie';
import { FlightBookingFailedComponent } from '../flight-search-widget/components/flight-booking-failed/flight-booking-failed.component';
import { CalendarModule } from 'primeng/calendar';
import { FlightLoaderComponent } from '../flight-search-widget/components/flight-loader/flight-loader.component';
import { FlightNotAvailableComponent } from '../flight-search-widget/components/flight-not-available/flight-not-available.component';
import { FlightSessionTimeOutComponent } from '../flight-search-widget/components/flight-session-time-out/flight-session-time-out.component';
import { BaggagePolicyPopupComponent } from '../flight-search-widget/components/baggage-policy-popup/baggage-policy-popup.component';
import { CancellationPolicyPopupComponent } from '../flight-search-widget/components/cancellation-policy-popup/cancellation-policy-popup.component';
import { FlightPaymentComponent } from '../flight-search-widget/flight-payment/flight-payment.component';
import { FlightSummaryLoaderComponent } from '../flight-search-widget/components/flight-summary-loader/flight-summary-loader.component';
import { FlightErrorComponent } from '../flight-search-widget/components/flight-error/flight-error.component';
import { PopupTermConditionComponent } from '../flight-search-widget/components/popup-term-condition/popup-term-condition.component';

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
    ClickOutSideDirective,
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
    PopupTermConditionComponent
  ],
  imports: [
    CommonModule,
    FlightSearchWidgetRoutingModule,
    Ng5SliderModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CookieModule.forRoot(),
    CalendarModule
  ],
  exports: [FlightLoaderComponent, FlightNotFoundComponent, FlightConfirmationComponent, FlightSummaryComponent]
})
export class FlightSearchWidgetModule { }
