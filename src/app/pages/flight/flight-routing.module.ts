import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightTravelerComponent } from './flight-traveler/flight-traveler.component';
import { FlightCheckoutComponent } from './flight-checkout/flight-checkout.component';

const routes: Routes = [
  {
    path: 'search',
    component: FlightSearchComponent,
  },
  {
    path: 'traveler/:rc',
    component: FlightTravelerComponent,
  },
  {
    path: 'checkout/:rc',
    component: FlightCheckoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule { }
