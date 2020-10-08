import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MyAccountsRoutingModule } from './my-accounts-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MyAccountsNavComponent } from './my-accounts-nav/my-accounts-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListTravellerComponent } from './travellers/list-traveller.component';
import { ListBookingsComponent } from './bookings/list-bookings.component';
import { FlightsComponent } from './bookings/flights/flights.component';
import { HotelsComponent } from './bookings/hotels/hotels.component';
import { AccommodationsComponent } from './bookings/accommodations/accommodations.component';
import { CalendarModule } from 'primeng/calendar';
import { ListPaymentHistoryComponent } from './payment-history/list-payment-history.component';
import { HistoryListComponent } from './payment-history/history-list/history-list.component';
import { ViewHistoryComponent } from './payment-history/view-history/view-history.component';
import { FlightModule } from '../../flight/flight.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TravellerFormComponent } from './travellers/traveller-form/traveller-form.component';
import { SubscriptionPlanComponent } from './subscription/subscription-plan.component';
import { AccountCardListComponent } from './account-card-list/account-card-list.component';
import { CardActionFormComponent } from './account-card-list/card-action-form/card-action-form.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { SearchTripComponent } from './search-trip/search-trip.component';
import { FlightTripDetailComponent } from './flight-trip-detail/flight-trip-detail.component';
import { TripNotFoundComponent } from './trip-not-found/trip-not-found.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ConfirmationModalComponent } from '../../../components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    ProfileComponent,
    MyAccountsNavComponent,
    ListBookingsComponent,
    ListTravellerComponent,
    TravellerFormComponent,
    FlightsComponent,
    HotelsComponent,
    AccommodationsComponent,
    ListPaymentHistoryComponent,
    HistoryListComponent,
    ViewHistoryComponent,
    ChangePasswordComponent,
    SubscriptionPlanComponent,
    AccountCardListComponent,
    CardActionFormComponent,
    ConfirmationModalComponent,
    MyWalletComponent,
    SearchTripComponent,
    FlightTripDetailComponent,
    TripNotFoundComponent,
  ],
  imports: [
    CommonModule,
    MyAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    CalendarModule,
    FlightModule,
    TextMaskModule
  ],
  providers: [DatePipe, NgbActiveModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [TravellerFormComponent, CardActionFormComponent, ConfirmationModalComponent]
})
export class MyAccountsModule { }
