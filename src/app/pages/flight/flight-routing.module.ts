import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightNotFoundComponent } from './components/flight-not-found/flight-not-found.component';

const routes: Routes = [
  {
    path: 'search',
    component: FlightSearchComponent,
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
