import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VacationRentalSearchComponent } from './vacation-rental-search/vacation-rental-search.component';

const routes: Routes = [
  {
    path: 'search',
    component: VacationRentalSearchComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationRentalRoutingModule { }
