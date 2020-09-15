import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoAccountsComponent } from './co-accounts/co-accounts.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: './my-accounts/my-accounts.module#MyAccountsModule'
  },
  {
    path: 'co-accounts',
    component: CoAccountsComponent,
  },
 
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
