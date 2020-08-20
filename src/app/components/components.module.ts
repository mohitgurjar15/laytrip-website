import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { SearchAirportComponent } from './search-airport/search-airport.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ 
    SearchAirportComponent
  ],
  imports: [
    CommonModule,
    AutocompleteLibModule,
    NgSelectModule,
    FormsModule
  ],
  exports:[
    SearchAirportComponent
  ]
})
export class ComponentsModule { }
