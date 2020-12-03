import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelSearchWidgetRoutingModule } from './hotel-search-widget-routing.module';
import { Ng5SliderModule } from 'ng5-slider';
import { ComponentsModule } from '../../components/components.module';
import { ClickOutSideDirective } from '../../_helpers/clickOutSide.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CookieModule } from 'ngx-cookie';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    ClickOutSideDirective,
  ],
  imports: [
    CommonModule,
    HotelSearchWidgetRoutingModule,
    Ng5SliderModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CookieModule.forRoot(),
    CalendarModule
  ],
  exports: []
})
export class HotelSearchWidgetModule { }
