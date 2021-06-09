import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmComponent } from './confirm/confirm.component';

const routes: Routes = [
 /*  {
    path: 'booking',
    component: BookingComponent,
  }, */
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'confirm/:id',
    component: ConfirmComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule {
  
 }
