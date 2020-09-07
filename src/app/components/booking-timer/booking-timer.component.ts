import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-booking-timer',
  templateUrl: './booking-timer.component.html',
  styleUrls: ['./booking-timer.component.scss']
})
export class BookingTimerComponent implements OnInit {

  constructor() { }
  s3BucketUrl = environment.s3BucketUrl;
  config={
    leftTime: 1200, format: 'm:s'
  }
  //@ViewChild('cd') 
  //private countdown: CountdownComponent;
  ngOnInit() {
    //this.countdown.begin();
  }

  handleEvent(event){
    console.log(event)
    if(event.action=="finished")
      alert("Booking time expired")
  }

}
