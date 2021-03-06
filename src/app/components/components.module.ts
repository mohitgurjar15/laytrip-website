import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { SearchAirportComponent } from './search-airport/search-airport.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TravellerInfoComponent } from './traveller-info/traveller-info.component';
import { CheckoutProgressComponent } from './checkout-progress/checkout-progress.component';
import { BookingTimerComponent } from './booking-timer/booking-timer.component';
import { PaymentModeComponent } from './payment-mode/payment-mode.component';
import { CardListComponent } from './card-list/card-list.component';
import { AddCardComponent } from './add-card/add-card.component';
import { TravelerFormComponent } from './traveler-form/traveler-form.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CountdownModule } from 'ngx-countdown';
import { Ng5SliderModule } from 'ng5-slider';
import { FullPageOverlayLoaderComponent } from './full-page-overlay-loader/full-page-overlay-loader.component';
import { CookieModule } from 'ngx-cookie';
import { CalendarModule } from 'primeng/calendar';
import { RedeemLaycreditComponent } from './redeem-laycredit/redeem-laycredit.component';
import { BookingFeedbackComponent } from './booking-feedback/booking-feedback.component';
import { LottieAnimationViewModule } from 'ng-lottie';
import { TextMaskModule } from 'angular2-text-mask';
import { PlanSummaryComponent } from './plan-summary/plan-summary.component';
import { RedeemLaycreditLoaderComponent } from './redeem-laycredit-loader/redeem-laycredit-loader.component';
import { ShareSocialMediaComponent } from './share-social-media/share-social-media.component';
import { RentalInfoComponent } from './rental-shared-components/rental-info/rental-info.component';

// HOTEL SHARED COMPONENTS
import { GuestInfoComponent } from './hotel-shared-components/guest-info/guest-info.component';
import { SearchHotelComponent } from './hotel-shared-components/search-hotel/search-hotel.component';
import { TranslateModule } from '@ngx-translate/core';
import { VacationSearchComponent } from './rental-shared-components/vacation-search/vacation-search.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FlightClassComponent } from './flight-class/flight-class.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CartItemComponent } from './cart-item/cart-item.component';
import { PriceSummaryComponent } from './price-summary/price-summary.component';
import { PaymentModeLoaderComponent } from './payment-mode-loader/payment-mode-loader.component';
import { CartComponent } from './cart/cart.component';
import { FlightCartItemComponent } from '../pages/flight/components/flight-cart-item/flight-cart-item.component';
import { CartLoaderComponent } from './cart-loader/cart-loader.component';
import { LaytripLoaderComponent } from './laytrip-loader/laytrip-loader.component';
//import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { EmptyCartComponent } from './empty-cart/empty-cart.component';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DeleteCartitemConfirmationPopupComponent } from './delete-cartitem-confirmation-popup/delete-cartitem-confirmation-popup.component';
import { NgxMaskModule } from 'ngx-mask';
import { BookingCompletionErrorPopupComponent } from './booking-completion-error-popup/booking-completion-error-popup.component';
import { AirportSuggestionComponent } from './airport-suggestion/airport-suggestion.component';
import { HotelCartItemComponent } from '../pages/hotel/components/hotel-cart-item/hotel-cart-item.component';
import { HotelSuggestionComponent } from './hotel-suggestion/hotel-suggestion.component';
import { CarouselComponent } from './carousel/carousel.component';
import { DiscountedBookingAlertComponent } from './discounted-booking-alert/discounted-booking-alert.component';
import { CartInventoryNotmatchErrorPopupComponent } from './cart-inventory-notmatch-error-popup/cart-inventory-notmatch-error-popup.component';
@NgModule({
  declarations: [
    SearchAirportComponent,
    TravellerInfoComponent,
    CheckoutProgressComponent,
    BookingTimerComponent,
    PaymentModeComponent,
    CardListComponent,
    AddCardComponent,
    TravelerFormComponent,
    FullPageOverlayLoaderComponent,
    RedeemLaycreditComponent,
    BookingFeedbackComponent,
    PlanSummaryComponent,
    RedeemLaycreditLoaderComponent,
    ShareSocialMediaComponent,
    DeleteCartitemConfirmationPopupComponent,

    // HOTEL SHARED COMPONENT
    GuestInfoComponent,
    SearchHotelComponent,
    RentalInfoComponent,
    VacationSearchComponent,
    FlightClassComponent,
    CartItemComponent,
    PriceSummaryComponent,
    PaymentModeLoaderComponent,
    CartComponent,
    FlightCartItemComponent,
    CartLoaderComponent,
    LaytripLoaderComponent,
    EmptyCartComponent,
    BookingCompletionErrorPopupComponent,
    AirportSuggestionComponent,
    HotelCartItemComponent,
    HotelSuggestionComponent,
    CarouselComponent,
    DiscountedBookingAlertComponent,
    CartInventoryNotmatchErrorPopupComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgbModule,
    CountdownModule,
    Ng5SliderModule,
    CookieModule.forRoot(),
    CalendarModule,
    LottieAnimationViewModule.forRoot(),
    TextMaskModule,
    TranslateModule,
    NgScrollbarModule,
    InfiniteScrollModule,
    RouterModule,
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  exports: [
    SearchAirportComponent,
    TravellerInfoComponent,
    CheckoutProgressComponent,
    BookingTimerComponent,
    PaymentModeComponent,
    CardListComponent,
    AddCardComponent,
    FullPageOverlayLoaderComponent,
    RedeemLaycreditComponent,
    BookingFeedbackComponent,
    PlanSummaryComponent,
    RedeemLaycreditLoaderComponent,
    ShareSocialMediaComponent,
    GuestInfoComponent,
    SearchHotelComponent,
    RentalInfoComponent,
    TranslateModule,
    VacationSearchComponent,
    NgScrollbarModule,
    FlightClassComponent,
    InfiniteScrollModule,
    CartItemComponent,
    PriceSummaryComponent,
    PaymentModeLoaderComponent,
    TravelerFormComponent,
    CartComponent,
    CartLoaderComponent,
    LaytripLoaderComponent,
    EmptyCartComponent,
    LottieAnimationViewModule,
    DeleteCartitemConfirmationPopupComponent,
    BookingCompletionErrorPopupComponent,
    AirportSuggestionComponent,
    TextMaskModule,
    HotelSuggestionComponent,
    CarouselComponent
  ],
  providers: [DatePipe, 
    NgbActiveModal,DecimalPipe],
  entryComponents: [DeleteCartitemConfirmationPopupComponent, EmptyCartComponent, BookingCompletionErrorPopupComponent, DiscountedBookingAlertComponent, CartInventoryNotmatchErrorPopupComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ComponentsModule { }

