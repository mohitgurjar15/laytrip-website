import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MyAccountsRoutingModule } from './my-accounts-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MyAccountsNavComponent } from './my-accounts-nav/my-accounts-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListTravellerComponent } from './travellers/list-traveller.component';
import { CrudComponent } from './travellers/crud/crud.component';
import { ListBookingsComponent } from './bookings/list-bookings.component';
import { FlightsComponent } from './bookings/flights/flights.component';
import { HotelsComponent } from './bookings/hotels/hotels.component';
import { AccommodationsComponent } from './bookings/accommodations/accommodations.component';
import { CalendarModule } from 'primeng/calendar';
import { ListPaymentHistoryComponent } from './payment-history/list-payment-history.component';
import { HistoryListComponent } from './payment-history/history-list/history-list.component';
import { ViewHistoryComponent } from './payment-history/view-history/view-history.component';
import { FlightModule } from '../../flight/flight.module';


@NgModule({
  declarations: [
    ProfileComponent,
    MyAccountsNavComponent,
    ListBookingsComponent,
    ListTravellerComponent,
    CrudComponent,
    FlightsComponent,
    HotelsComponent,
    AccommodationsComponent,
    ListPaymentHistoryComponent,
    HistoryListComponent,
    ViewHistoryComponent,
  ],
  imports: [
    CommonModule,
    MyAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    CalendarModule,
    FlightModule  
  ],
  providers: [DatePipe],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MyAccountsModule { }
