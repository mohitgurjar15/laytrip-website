import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchAirportComponent } from './search-airport/search-airport.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TravellerInfoComponent } from './traveller-info/traveller-info.component';
import { CheckoutProgressComponent } from './checkout-progress/checkout-progress.component';
import { AdultListComponent } from './adult-list/adult-list.component';
import { ChildListComponent } from './child-list/child-list.component';
import { InfantListComponent } from './infant-list/infant-list.component';
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
import { BookingEnquiryInfoComponent } from './booking-enquiry-info/booking-enquiry-info.component';
import { AddGuestCardComponent } from './add-guest-card/add-guest-card.component';
import { CalendarModule } from 'primeng/calendar';
import { RedeemLaycreditComponent } from './redeem-laycredit/redeem-laycredit.component';
import { BookingFeedbackComponent } from './booking-feedback/booking-feedback.component';
import { BookingAsLoginOrGuestPopupComponent } from './booking-as-login-or-guest-popup/booking-as-login-or-guest-popup.component';
import { LottieAnimationViewModule } from 'ng-lottie';
import { TextMaskModule } from 'angular2-text-mask';
import { PlanSummaryComponent } from './plan-summary/plan-summary.component';
import { AddPointsComponent } from './add-points/add-points.component';
import { RedeemLaycreditLoaderComponent } from './redeem-laycredit-loader/redeem-laycredit-loader.component';
import { ToasterComponent } from './toaster/toaster.component';
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
import { TravelerListComponent } from './traveler-list/traveler-list.component';
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
@NgModule({
  declarations: [
    SearchAirportComponent,
    TravellerInfoComponent,
    CheckoutProgressComponent,
    AdultListComponent,
    ChildListComponent,
    InfantListComponent,
    BookingTimerComponent,
    PaymentModeComponent,
    CardListComponent,
    AddCardComponent,
    TravelerFormComponent,
    FullPageOverlayLoaderComponent,
    BookingEnquiryInfoComponent,
    AddGuestCardComponent,
    RedeemLaycreditComponent,
    BookingFeedbackComponent,
    BookingAsLoginOrGuestPopupComponent,
    PlanSummaryComponent,
    AddPointsComponent,
    RedeemLaycreditLoaderComponent,
    ToasterComponent,
    ShareSocialMediaComponent,
    DeleteCartitemConfirmationPopupComponent,

    // HOTEL SHARED COMPONENT
    GuestInfoComponent,
    SearchHotelComponent,
    RentalInfoComponent,
    VacationSearchComponent,
    FlightClassComponent,
    CartItemComponent,
    TravelerListComponent,
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
    DiscountedBookingAlertComponent
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
    //NgxSpinnerModule,
    RouterModule,
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  exports: [
    SearchAirportComponent,
    TravellerInfoComponent,
    CheckoutProgressComponent,
    AdultListComponent,
    ChildListComponent,
    InfantListComponent,
    BookingTimerComponent,
    PaymentModeComponent,
    CardListComponent,
    AddCardComponent,
    FullPageOverlayLoaderComponent,
    BookingEnquiryInfoComponent,
    AddGuestCardComponent,
    RedeemLaycreditComponent,
    BookingFeedbackComponent,
    BookingAsLoginOrGuestPopupComponent,
    PlanSummaryComponent,
    AddPointsComponent,
    RedeemLaycreditLoaderComponent,
    ToasterComponent,
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
    TravelerListComponent,
    PriceSummaryComponent,
    PaymentModeLoaderComponent,
    TravelerFormComponent,
    CartComponent,
    CartLoaderComponent,
    LaytripLoaderComponent,
    //NgxSpinnerModule,
    EmptyCartComponent,
    LottieAnimationViewModule,
    DeleteCartitemConfirmationPopupComponent,
    BookingCompletionErrorPopupComponent,
    AirportSuggestionComponent,
    TextMaskModule,
    HotelSuggestionComponent,
    CarouselComponent
  ],
  providers: [DatePipe, //NgxSpinnerService, 
    NgbActiveModal],
  entryComponents: [DeleteCartitemConfirmationPopupComponent, EmptyCartComponent, BookingCompletionErrorPopupComponent, DiscountedBookingAlertComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ComponentsModule { }

