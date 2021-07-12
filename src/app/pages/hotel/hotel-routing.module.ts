import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelDetailComponent } from './components/hotel-detail/hotel-detail.component';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';

const routes: Routes = [
  {
    path: 'search',
    component: HotelSearchComponent,
  },
  {
    path: 'detail/:id/:token',
    component: HotelDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule { }
