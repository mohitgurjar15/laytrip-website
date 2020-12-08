import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';

const routes: Routes = [
  {
    path: 'search',
    component: HotelSearchComponent,
  },
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
export class HotelRoutingModule { }
