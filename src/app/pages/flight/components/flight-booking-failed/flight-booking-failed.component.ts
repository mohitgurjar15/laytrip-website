import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-flight-booking-failed',
  templateUrl: './flight-booking-failed.component.html',
  styleUrls: ['./flight-booking-failed.component.scss']
})
export class FlightBookingFailedComponent implements OnInit {

  constructor() { }
  s3BucketUrl=environment.s3BucketUrl;
  ngOnInit() {
  }

}
