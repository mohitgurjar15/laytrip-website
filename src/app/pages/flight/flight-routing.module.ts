import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightTravelerComponent } from './flight-traveler/flight-traveler.component';
import { FlightCheckoutComponent } from './flight-checkout/flight-checkout.component';
import { FlightPaymentComponent } from './flight-payment/flight-payment.component';
import { FlightNotFoundComponent } from './components/flight-not-found/flight-not-found.component';

const routes: Routes = [
  {
    path: 'search',
    component: FlightSearchComponent,
  },
  {
    path: 'travelers/:rc',
    component: FlightTravelerComponent,
  },
  {
    path: 'payment/:rc',
    component: FlightPaymentComponent,
  },
  {
    path: 'checkout/:rc',
    component: FlightCheckoutComponent,
  },
  {
    path: 'flight-not-found',
    component: FlightNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightRoutingModule { }
