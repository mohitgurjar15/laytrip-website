import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchAirportComponent } from './search-airport/search-airport.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TravellerInfoComponent } from './traveller-info/traveller-info.component';
import { CheckoutProgressComponent } from './checkout-progress/checkout-progress.component';
import { AdultListComponent } from './adult-list/adult-list.component';
import { ChildListComponent } from './child-list/child-list.component';
import { InfantListComponent } from './infant-list/infant-list.component';

@NgModule({
  declarations: [
    SearchAirportComponent, TravellerInfoComponent, CheckoutProgressComponent, AdultListComponent, ChildListComponent, InfantListComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SearchAirportComponent,
    TravellerInfoComponent,
    CheckoutProgressComponent,
    AdultListComponent,
    ChildListComponent,
    InfantListComponent
    
  ]
})
export class ComponentsModule { }
