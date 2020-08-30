import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchAirportComponent } from './search-airport/search-airport.component';
import { AsteriskMarkComponent } from './asterisk-mark/asterisk-mark.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TravellerInfoComponent } from './traveller-info/traveller-info.component';

@NgModule({
  declarations: [
    SearchAirportComponent, TravellerInfoComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SearchAirportComponent,
    TravellerInfoComponent
  ]
})
export class ComponentsModule { }
