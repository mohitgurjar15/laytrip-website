import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchAirportComponent } from './search-airport/search-airport.component';
import { AsteriskMarkComponent } from './asterisk-mark/asterisk-mark.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ 
    SearchAirportComponent, AsteriskMarkComponent
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
