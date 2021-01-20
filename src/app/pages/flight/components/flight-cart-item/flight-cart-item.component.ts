import { Component, Input, OnInit } from '@angular/core';
import { environment } from '.././../../../../environments/environment';

@Component({
  selector: 'app-flight-cart-item',
  templateUrl: './flight-cart-item.component.html',
  styleUrls: ['./flight-cart-item.component.scss']
})
export class FlightCartItemComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }
  @Input() travelers:[];
  totalTraveler={
    adult_count :0,
    child_count :0,
    infant_count:0
  };

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

}
