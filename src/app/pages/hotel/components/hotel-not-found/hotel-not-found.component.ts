import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-hotel-not-found',
  templateUrl: './hotel-not-found.component.html',
  styleUrls: ['./hotel-not-found.component.scss']
})
export class HotelNotFoundComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;

  constructor() { }

  ngOnInit() {
    console.log(this.s3BucketUrl)
  }

}
