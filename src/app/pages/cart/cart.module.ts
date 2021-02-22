import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { SpreedlyService } from 'src/app/services/spreedly.service';
import { BookModule } from '../book/book.module';


@NgModule({
  declarations: [BookingComponent, CheckoutComponent, ConfirmComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    Ng5SliderModule,
    NgbModule,
    HelpersModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CookieModule.forRoot(),
    CalendarModule,
    HomeModule,
    BookModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [SpreedlyService]
})
export class CartModule { }
