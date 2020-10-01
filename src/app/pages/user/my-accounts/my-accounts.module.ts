import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
    
  ],
  providers: [DatePipe,NgbActiveModal],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  entryComponents:[TravellerFormComponent]
})
export class MyAccountsModule { }
