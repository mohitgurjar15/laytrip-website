import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

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
  }
];

@NgModule({
  declarations:[],
  imports: [
    RouterModule.forChild(routes)   
  ],
  exports: [RouterModule]
})
export class MyAccountsRoutingModule { }
