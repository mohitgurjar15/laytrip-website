import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VacationRentalSearchComponent } from './vacation-rental-search/vacation-rental-search.component';
import { VacationDetailComponent } from './components/vacation-detail/vacation-detail.component';

const routes: Routes = [
  {
    path: 'search',
    component: VacationRentalSearchComponent,
  },
   {
    path: 'detail/:id',
    component: VacationDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationRentalRoutingModule { }
