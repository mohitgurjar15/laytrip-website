import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountCardListComponent } from './account-card-list/account-card-list.component';
import { ListBookingsComponent } from './bookings/list-bookings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FlightTripDetailComponent } from './flight-trip-detail/flight-trip-detail.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { ListPaymentHistoryComponent } from './payment-history/list-payment-history.component';
import { ProfileComponent } from './profile/profile.component';
import { SubscriptionPlanComponent } from './subscription/subscription-plan.component';
import { SearchTripComponent } from './search-trip/search-trip.component';
import { ListTravellerComponent } from './travellers/list-traveller.component';
import { PlanSubscriptionComponent } from './plan-subscription/plan-subscription.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'bookings',
    component: ListBookingsComponent
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
  {
    path: 'subscription',
    component: SubscriptionPlanComponent
  },
  {
    path: 'subscription/:id',
    component: PlanSubscriptionComponent
  },
  {
    path: 'account-card-list',
    component: AccountCardListComponent
  },
  {
    path: 'search-trip',
    component: SearchTripComponent,
  },
  {
    path: 'trip/:id',
    component: FlightTripDetailComponent,
  },
  {
    path: 'my-wallet',
    component: MyWalletComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MyAccountsRoutingModule { }
