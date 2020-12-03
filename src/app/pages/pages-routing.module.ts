import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CovidPageComponent } from './covid-page/covid-page.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import { FaqComponent } from './faq/faq.component';
import { PagesComponent } from './pages.component';
import { PartialPaymentComponent } from './partial-payment/partial-payment.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SsoLoginComponent } from './sso-login/sso-login.component';
import { WhyLaytripComponent } from './why-laytrip/why-laytrip.component';

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
                loadChildren: './flight-search-widget/flight-search-widget.module#FlightSearchWidgetModule'
            },
            {
                path: 'hotel',
                loadChildren: './hotel-search-widget/hotel-search-widget.module#HotelSearchWidgetModule',
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
            },
            {
                path: 'why-laytrip',
                component: WhyLaytripComponent
            },
            {
                path: 'partial-payment',
                component: PartialPaymentComponent
            },
            {
                path: 'download-app',
                component: DownloadAppComponent
            },
            {
                path: 'coming-soon',
                component: ComingSoonComponent
            },
            {
                path: 'sson',
                component: SsoLoginComponent
            },
            {
                path: 'covid-19',
                component: CovidPageComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
