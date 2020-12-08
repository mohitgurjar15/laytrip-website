import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-hotel-error',
  templateUrl: './hotel-error.component.html',
  styleUrls: ['./hotel-error.component.scss']
})
export class HotelErrorComponent implements OnInit {

  @Input() errorMessage:string;
  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
