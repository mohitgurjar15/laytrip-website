import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-flight-checkout',
  templateUrl: './flight-checkout.component.html',
  styleUrls: ['./flight-checkout.component.scss']
})
export class FlightCheckoutComponent implements OnInit {

  constructor() { }
  s3BucketUrl = environment.s3BucketUrl;
  showAddCardForm:boolean=false;

  ngOnInit() {
  }

  toggleAddcardForm(){
    
    this.showAddCardForm=!this.showAddCardForm;
  }
}
