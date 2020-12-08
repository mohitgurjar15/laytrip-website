import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationRentalRoutingModule } from './vacation-rental-routing.module';
import { VacationRentalSearchComponent } from './vacation-rental-search/vacation-rental-search.component';
import { VacationRentalSearchBarComponent } from './components/vacation-rental-search-bar/vacation-rental-search-bar.component';
import { SortVacationRentalComponent } from './components/sort-vacation-rental/sort-vacation-rental.component';
import { FilterVacationRentalComponent } from './components/filter-vacation-rental/filter-vacation-rental.component';
import { VacationItemWrapperComponent } from './components/vacation-item-wrapper/vacation-item-wrapper.component';

@NgModule({
  declarations: [VacationRentalSearchComponent, VacationRentalSearchBarComponent, SortVacationRentalComponent, FilterVacationRentalComponent, VacationItemWrapperComponent],
  imports: [
    CommonModule,
    VacationRentalRoutingModule
  ]
})
export class VacationRentalModule { }
