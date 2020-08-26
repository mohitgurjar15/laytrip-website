import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
        { 
            path: '', 
            component:PagesComponent,
            children: [
                { 
                    path: '', 
                    loadChildren: './home/home.module#HomeModule'
                },
                { 
                    path: 'account', 
                    loadChildren: './user/user.module#UserModule'
                }
            ]
        }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
