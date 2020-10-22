import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { PagesComponent } from './pages.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: '',
                loadChildren: './home/home.module#HomeModule'
            },
            {
                path: 'flight',
                loadChildren: './flight/flight.module#FlightModule'
            },
            {
                path: 'account',
                loadChildren: './user/user.module#UserModule'
            },
            {
                path: 'contact-us',
                component: ContactUsComponent
            },
            {
                path: 'cancellation-policy',
                component: CancellationPolicyComponent
            },
            {
                path: 'privacy-policy',
                component: PrivacyPolicyComponent
            },
            {
                path: 'faq',
                component: FaqComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
