import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  @Input() cartItem;
  @Input() travelers:[];
  totalTraveler={
    adult_count :0,
    child_count :0,
    infant_count:0
  };

  constructor() { }

  ngOnInit(): void {
    try{
      let _itinerary:any = sessionStorage.getItem("_itinerary");
      _itinerary = JSON.parse(_itinerary);
      this.totalTraveler.adult_count = Number(_itinerary.adult);
      this.totalTraveler.child_count = Number(_itinerary.child);
      this.totalTraveler.infant_count= Number(_itinerary.infant);
    }
    catch(e){
      console.log("Error",e)
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if(changes['cartItem']){
      this.cartItem = changes['cartItem'].currentValue;
    }
  }

}
