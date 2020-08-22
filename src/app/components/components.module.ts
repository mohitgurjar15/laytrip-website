import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchAirportComponent } from './search-airport/search-airport.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ 
    SearchAirportComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule
  ],
  exports:[
    SearchAirportComponent
  ]
})
export class ComponentsModule { }
