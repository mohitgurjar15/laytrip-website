import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { SearchAirportComponent } from './search-airport/search-airport.component';

@NgModule({
  declarations: [
    SearchAirportComponent
  ],
  imports: [
    CommonModule,
    AutocompleteLibModule
  ],
  exports:[
    SearchAirportComponent
  ]
})
export class ComponentsModule { }
