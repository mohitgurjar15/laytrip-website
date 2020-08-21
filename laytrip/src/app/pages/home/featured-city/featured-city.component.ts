import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-featured-city',
  templateUrl: './featured-city.component.html',
  styleUrls: ['./featured-city.component.scss']
})
export class FeaturedCityComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
