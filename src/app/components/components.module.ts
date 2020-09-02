import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchAirportComponent } from './search-airport/search-airport.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TravellerInfoComponent } from './traveller-info/traveller-info.component';
import { CheckoutProgressComponent } from './checkout-progress/checkout-progress.component';
import { AdultListComponent } from './adult-list/adult-list.component';
import { ChildListComponent } from './child-list/child-list.component';
import { InfantListComponent } from './infant-list/infant-list.component';
import { BookingTimerComponent } from './booking-timer/booking-timer.component';
import { PaymentModeComponent } from './payment-mode/payment-mode.component';
import { CardListComponent } from './card-list/card-list.component';
import { AddCardComponent } from './add-card/add-card.component';
import { TravelerFormComponent } from './traveler-form/traveler-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    SearchAirportComponent, TravellerInfoComponent, CheckoutProgressComponent, AdultListComponent, ChildListComponent, InfantListComponent, BookingTimerComponent, PaymentModeComponent, CardListComponent, AddCardComponent,TravelerFormComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    SearchAirportComponent,
    TravellerInfoComponent,
    CheckoutProgressComponent,
    AdultListComponent,
    ChildListComponent,
    InfantListComponent,
    BookingTimerComponent,
    PaymentModeComponent,
    CardListComponent,
    AddCardComponent
    
  ],
  providers: [DatePipe],

})
export class ComponentsModule { }
