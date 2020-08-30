import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightRoutingModule } from './flight-routing.module';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { SortFlightComponent } from './components/sort-flight/sort-flight.component';
import { FilterFlightComponent } from './components/filter-flight/filter-flight.component';
import { FlightPriceSliderComponent } from './components/flight-price-slider/flight-price-slider.component';
import { FlightItemWrapperComponent } from './components/flight-item-wrapper/flight-item-wrapper.component';
import { FlightSearchBarComponent } from './components/flight-search-bar/flight-search-bar.component';
import { Ng5SliderModule } from 'ng5-slider';
import { FlightLoaderComponent } from './components/flight-loader/flight-loader.component';
import { FlightNotFoundComponent } from './components/flight-not-found/flight-not-found.component';
import { FlightTravelerComponent } from './flight-traveler/flight-traveler.component';
import { ClickOutSideDirective } from 'src/app/_helpers/clickOutSide.directive';

@NgModule({
  declarations: [
    FlightSearchComponent,
    SortFlightComponent,
    FilterFlightComponent,
    FlightPriceSliderComponent,
    FlightItemWrapperComponent,
    FlightSearchBarComponent,
    FlightLoaderComponent,
    FlightNotFoundComponent,
    FlightTravelerComponent,
    ClickOutSideDirective
  ],
  imports: [
    CommonModule,
    FlightRoutingModule,
    Ng5SliderModule
  ]
})
export class FlightModule { }
