import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { ListTravellerComponent } from './travellers/list-traveller.component';

const routes: Routes = [
  {
    path:'',
    component:ProfileComponent
  },
  {
    path:'profile',
    component:ProfileComponent
  },
  {
    path:'bookings',
    component:MyBookingsComponent
  },
  {
    path: 'travellers',
    component: ListTravellerComponent,
  },
 
];

@NgModule({
  declarations:[],
  imports: [
    RouterModule.forChild(routes)   
  ],
  exports: [RouterModule]
})
export class MyAccountsRoutingModule { }
