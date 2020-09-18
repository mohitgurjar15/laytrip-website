import { Component, EventEmitter,  Input,  OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-guest-card',
  templateUrl: './add-guest-card.component.html',
  styleUrls: ['./add-guest-card.component.scss']
})
export class AddGuestCardComponent implements OnInit {

  constructor() { }
  @Output() emitGuestCardDetails = new EventEmitter<{}>()
  @Input() validateCardDetails:Subject<any>;
  cardDetails:any={}
  expiryDate:any;
  locale = {
    format: 'MM/YYYY',
    displayFormat: 'MM/YYYY'
  };
  isValidFirstName:boolean=true;
  isValidLastName:boolean=true;
  isValidCardNumber:boolean=true;
  isValidCvv:boolean=true;
  isValidExpiry:boolean=true;

  ngOnInit() {
    this.validateCardDetails.subscribe(event => {
      this.validateCard(event);
    });
  }


  handleCardDetails(event){
    this.cardDetails[event.target.name]=event.target.value;
    this.emitGuestCardDetails.emit(this.cardDetails);
  }

  expiryDateUpdate(event){
    //console.log("event",this.expiryDate)
    this.cardDetails.expiry='10/2021';
    this.emitGuestCardDetails.emit(this.cardDetails);
  }
  validateCard(event){
    if(typeof event.first_name=='undefined' || event.first_name=='')
      this.isValidFirstName=false;
    else
      this.isValidFirstName=true;
    
    if(typeof event.last_name=='undefined' ||  event.last_name=='')
      this.isValidLastName=false;
    else
      this.isValidLastName=true;
      
    if(typeof event.card_number=='undefined' ||  event.card_number=='')
      this.isValidCardNumber=false;
    else
      this.isValidCardNumber=true;

    if(typeof event.expiry=='undefined' || event.expiry=='')
      this.isValidExpiry=false;
    else
      this.isValidExpiry=true;

    if(typeof event.card_cvv=='undefined' || event.card_cvv=='')
      this.isValidCvv=false;
    else
      this.isValidCvv=true;
  }
}
