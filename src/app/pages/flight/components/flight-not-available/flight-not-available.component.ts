import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-flight-not-available',
  templateUrl: './flight-not-available.component.html',
  styleUrls: ['./flight-not-available.component.scss']
})
export class FlightNotAvailableComponent implements OnInit {

  constructor() { }
  s3BucketUrl = environment.s3BucketUrl;
  ngOnInit() {
  }
}
