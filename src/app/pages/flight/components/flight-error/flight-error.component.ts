import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-flight-error',
  templateUrl: './flight-error.component.html',
  styleUrls: ['./flight-error.component.scss']
})
export class FlightErrorComponent implements OnInit {

  @Input() errorMessage:string;
  @Input() statusCode;
  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
