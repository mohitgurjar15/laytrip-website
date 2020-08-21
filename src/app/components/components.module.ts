import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { SearchAirportComponent } from './search-airport/search-airport.component';
import { AsteriskMarkComponent } from './asterisk-mark/asterisk-mark.component';

@NgModule({
  declarations: [ 
    SearchAirportComponent, AsteriskMarkComponent
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
