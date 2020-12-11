import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationRentalRoutingModule } from './vacation-rental-routing.module';
import { VacationRentalSearchComponent } from './vacation-rental-search/vacation-rental-search.component';
import { VacationRentalSearchBarComponent } from './components/vacation-rental-search-bar/vacation-rental-search-bar.component';
import { SortVacationRentalComponent } from './components/sort-vacation-rental/sort-vacation-rental.component';
import { FilterVacationRentalComponent } from './components/filter-vacation-rental/filter-vacation-rental.component';
import { VacationItemWrapperComponent } from './components/vacation-item-wrapper/vacation-item-wrapper.component';
import { VacationLoaderComponent } from './components/vacation-loader/vacation-loader.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng5SliderModule } from 'ng5-slider';
import { VacationNotFoundComponent } from './components/vacation-not-found/vacation-not-found.component';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [VacationRentalSearchComponent, VacationRentalSearchBarComponent, SortVacationRentalComponent, FilterVacationRentalComponent, VacationItemWrapperComponent, VacationLoaderComponent, VacationNotFoundComponent],
  imports: [
    CommonModule,
    VacationRentalRoutingModule,
    CalendarModule,
    FormsModule, 
    ReactiveFormsModule,
    NgSelectModule,
    Ng5SliderModule,
    ComponentsModule
  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VacationRentalModule { }
