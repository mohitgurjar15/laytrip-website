import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBookingsComponent } from './bookings/list-bookings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ListPaymentHistoryComponent } from './payment-history/list-payment-history.component';
import { ProfileComponent } from './profile/profile.component';
import { ListTravellerComponent } from './travellers/list-traveller.component';

const routes: Routes = [
  {
    path:'',
    component:ProfileComponent
  },
  {
    path:'profile',
    component:ProfileComponent
  },
  {
    path:'bookings',
    component:ListBookingsComponent
  },
  {
    path: 'travellers',
    component: ListTravellerComponent,
  },
  {
    path: 'payment',
    component: ListPaymentHistoryComponent,
  },
  {
    path: 'settings/change-password',
    component: ChangePasswordComponent,
  },
 
];

@NgModule({
  declarations:[],
  imports: [
    RouterModule.forChild(routes)   
  ],
  exports: [RouterModule]
})
export class MyAccountsRoutingModule { }
