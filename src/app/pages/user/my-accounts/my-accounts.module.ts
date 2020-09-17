import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MyAccountsRoutingModule } from './my-accounts-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MyAccountsNavComponent } from './my-accounts-nav/my-accounts-nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ListTravellerComponent } from './travellers/list-traveller.component';
import { CrudComponent } from './travellers/crud/crud.component';


@NgModule({
  declarations: [ProfileComponent,MyAccountsNavComponent, MyBookingsComponent, ListTravellerComponent, CrudComponent],
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
 