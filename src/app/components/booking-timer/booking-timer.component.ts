import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-booking-timer',
  templateUrl: './booking-timer.component.html',
  styleUrls: ['./booking-timer.component.scss']
})
export class BookingTimerComponent implements OnInit {

  constructor() { }
  s3BucketUrl = environment.s3BucketUrl;
  @Input() config;
  
  //@ViewChild('cd') 
  //private countdown: CountdownComponent;
  ngOnInit() {
    //this.countdown.begin();
    console.log(this.config)
  }

  handleEvent(event){
    console.log(event)
    if(event.action=="finished"){

      //alert("Booking time expired")
    }
  }

}
