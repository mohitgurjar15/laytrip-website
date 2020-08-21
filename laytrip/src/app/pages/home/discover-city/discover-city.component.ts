import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-discover-city',
  templateUrl: './discover-city.component.html',
  styleUrls: ['./discover-city.component.scss']
})
export class DiscoverCityComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
