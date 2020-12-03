import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightSearchComponent } from '../flight-search-widget/flight-search/flight-search.component';
import { FlightTravelerComponent } from '../flight-search-widget/flight-traveler/flight-traveler.component';
import { FlightCheckoutComponent } from '../flight-search-widget/flight-checkout/flight-checkout.component';
import { FlightPaymentComponent } from '../flight-search-widget/flight-payment/flight-payment.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightSearchWidgetRoutingModule { }
