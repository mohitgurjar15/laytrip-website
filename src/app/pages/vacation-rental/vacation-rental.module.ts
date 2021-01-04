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
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { VacationDetailComponent } from './components/vacation-detail/vacation-detail.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { VacationPopupLoaderComponent } from './components/vacation-popup-loader/vacation-popup-loader.component';
import { HomeModule } from '../home/home.module';

// HELPERS MODULE
import { HelpersModule } from '../../_helpers/_helpers.module';

@NgModule({
  declarations: [VacationRentalSearchComponent, VacationRentalSearchBarComponent, SortVacationRentalComponent, FilterVacationRentalComponent, VacationItemWrapperComponent, VacationLoaderComponent, VacationNotFoundComponent, VacationDetailComponent, VacationPopupLoaderComponent],
  imports: [
    CommonModule,
    VacationRentalRoutingModule,
    CalendarModule,
    FormsModule, 
    ReactiveFormsModule,
    NgSelectModule,
    Ng5SliderModule,
    ComponentsModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyB63siq6uISCHD-x3MkitGQogoz8n7jy7M',
      apiKey: 'AIzaSyB7Ws9zJ9ozVruSjF2N3pDVsqHF-h1QtBU',
      libraries: ['places']
    }),
    AgmJsMarkerClustererModule,
    NgxGalleryModule,
    HomeModule,
    HelpersModule
  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports : [
    HomeModule
  ]
})
export class VacationRentalModule { }
