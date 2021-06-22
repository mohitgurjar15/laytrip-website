import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookComponent } from './book/book.component';
import { FailureComponent } from './failure/failure.component';

const routes: Routes = [
  {
    path: 'charge/:uuid',
    component: BookComponent,
  },
  {
    path: 'failure',
    component: FailureComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
