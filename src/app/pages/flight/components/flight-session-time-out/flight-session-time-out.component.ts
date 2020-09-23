import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-flight-session-time-out',
  templateUrl: './flight-session-time-out.component.html',
  styleUrls: ['./flight-session-time-out.component.scss']
})
export class FlightSessionTimeOutComponent implements OnInit {

  constructor() { }
  s3BucketUrl = environment.s3BucketUrl;
  ngOnInit() {
  }

}
