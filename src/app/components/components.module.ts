import { NgModule } from '@angular/core';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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

@NgModule({
  declarations: [
    SearchAirportComponent, TravellerInfoComponent, CheckoutProgressComponent, AdultListComponent, ChildListComponent, InfantListComponent, BookingTimerComponent, PaymentModeComponent, CardListComponent, AddCardComponent,TravelerFormComponent, FullPageOverlayLoaderComponent, BookingEnquiryInfoComponent, AddGuestCardComponent, RedeemLaycreditComponent, BookingFeedbackComponent, BookingAsLoginOrGuestPopupComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CountdownModule,
    Ng5SliderModule,
    CookieModule.forRoot(),
    CalendarModule,
    LottieAnimationViewModule.forRoot(),
    TextMaskModule
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
    BookingAsLoginOrGuestPopupComponent
  ],
  providers: [DatePipe],

})
export class ComponentsModule { }
