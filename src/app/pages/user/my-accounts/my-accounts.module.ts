import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MyAccountsRoutingModule } from './my-accounts-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MyAccountsNavComponent } from './my-accounts-nav/my-accounts-nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ListTravellerComponent } from './travellers/list-traveller.component';
import { CrudComponent } from './travellers/crud/crud.component';
import { ListBookingsComponent } from './bookings/list-bookings.component';
import { FlightsComponent } from './bookings/flights/flights.component';
import { HotelsComponent } from './bookings/hotels/hotels.component';
import { AccommodationsComponent } from './bookings/accommodations/accommodations.component';
import { FlightLoaderComponent } from '../../flight/components/flight-loader/flight-loader.component';
import { FlightNotFoundComponent } from '../../flight/components/flight-not-found/flight-not-found.component';


@NgModule({
  declarations: [ProfileComponent,MyAccountsNavComponent, ListBookingsComponent, ListTravellerComponent, CrudComponent, FlightsComponent, HotelsComponent, AccommodationsComponent,FlightLoaderComponent,FlightNotFoundComponent],
  imports: [
    CommonModule,
    MyAccountsRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  providers:[DatePipe]
})
export class MyAccountsModule { }
 