import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-flight-not-found',
  templateUrl: './flight-not-found.component.html',
  styleUrls: ['./flight-not-found.component.scss']
})
export class FlightNotFoundComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;

  constructor() { }

  ngOnInit() {
  }

}
