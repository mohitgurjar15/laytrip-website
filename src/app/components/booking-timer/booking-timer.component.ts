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

  ngOnInit() {
  }

}
