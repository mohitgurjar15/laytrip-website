import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { AboutUsComponent } from './about-us/about-us.component';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';
import { CcpaComponent } from './ccpa/ccpa.component';
import { CmsPagesComponent } from './cms-pages/cms-pages.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CovidPageComponent } from './covid-page/covid-page.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import { FaqComponent } from './faq/faq.component';
import { PagesComponent } from './pages.component';
import { PartialPaymentComponent } from './partial-payment/partial-payment.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SsoLoginComponent } from './sso-login/sso-login.component';
import { TermsComponent } from './terms/terms.component';
import { WhyLaytripComponent } from './why-laytrip/why-laytrip.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
            },
            {
                path: 'flight',
                loadChildren: () => import('./flight/flight.module').then(m => m.FlightModule)
            },
            {
                path: 'hotel',
                loadChildren: () => import('./hotel/hotel.module').then(m => m.HotelModule)
            },
            {
                path: 'vacation-rental',
                loadChildren: () => import('./vacation-rental/vacation-rental.module').then(m => m.VacationRentalModule)
            },
            {
                path: 'account',
                canActivate: [AuthGuard],
                loadChildren: () => import('./user/user.module').then(m => m.UserModule)
            },
            {
                path: 'cart',
                loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
            },
            {
                path: 'book',
                loadChildren: () => import('./book/book.module').then(m => m.BookModule)
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
            {
                path: 'about',
                component: AboutUsComponent
            },
            {
                path: 'terms',
                component: TermsComponent
            },
            {
                path: 'pages',
                component: CmsPagesComponent
            },
            {
                path: 'book',
                loadChildren: () => import('./book/book.module').then(m => m.BookModule)
            },
            {
                path: 'ccpa',
                component: CcpaComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
