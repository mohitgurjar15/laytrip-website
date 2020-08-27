import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MyAccountsRoutingModule } from './my-accounts-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MyAccountsNavComponent } from './my-accounts-nav/my-accounts-nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

@NgModule({
  declarations: [ProfileComponent,MyAccountsNavComponent, MyBookingsComponent],
  imports: [
    CommonModule,
    MyAccountsRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule
  ],
  providers:[DatePipe]
})
export class MyAccountsModule { }
