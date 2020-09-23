import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() sessionTimeout= new EventEmitter();
  
  ngOnInit() {
  }

  handleEvent(event){
    if(event.action=="finished"){
      this.sessionTimeout.emit(true)
    }
  }

}
