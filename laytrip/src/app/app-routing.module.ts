import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: './pages/pages.module#PagesModule' 
  },
  { 
    path: '**', 
    redirectTo: 'not-found' 
  },
  {
    path : 'not-found',
    component : NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
