import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { BookingComponent } from './booking/booking.component';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HelpersModule } from '../../_helpers/_helpers.module';
import { ComponentsModule } from '../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CookieModule } from 'ngx-cookie';
import { CalendarModule } from 'primeng/calendar';
import { HomeModule } from '../home/home.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { SpreedlyService } from '../../services/spreedly.service';
import { BookModule } from '../book/book.module';
import { SessionExpiredComponent } from './session-expired/session-expired.component';


@NgModule({
  declarations: [BookingComponent, CheckoutComponent, ConfirmComponent, SessionExpiredComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    Ng5SliderModule,
    NgbModule,
    HelpersModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgSelectModule,
    CookieModule.forRoot(),
    CalendarModule,
    HomeModule,
    BookModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [SpreedlyService,DecimalPipe],
  entryComponents: [SessionExpiredComponent]
})
export class CartModule { }
