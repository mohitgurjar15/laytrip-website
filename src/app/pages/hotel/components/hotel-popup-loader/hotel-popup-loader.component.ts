import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-hotel-popup-loader',
  templateUrl: './hotel-popup-loader.component.html',
  styleUrls: ['./hotel-popup-loader.component.scss']
})
export class HotelPopupLoaderComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
