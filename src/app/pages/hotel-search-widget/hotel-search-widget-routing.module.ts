import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'search',
  //   component: FlightSearchComponent,
  // },
  // {
  //   path: 'travelers/:rc',
  //   component: FlightTravelerComponent,
  // },
  // {
  //   path: 'payment/:rc',
  //   component: FlightPaymentComponent,
  // },
  // {
  //   path: 'checkout/:rc',
  //   component: FlightCheckoutComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelSearchWidgetRoutingModule { }
