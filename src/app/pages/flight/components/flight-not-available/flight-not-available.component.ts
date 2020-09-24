import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-flight-not-available',
  templateUrl: './flight-not-available.component.html',
  styleUrls: ['./flight-not-available.component.scss']
})
export class FlightNotAvailableComponent implements OnInit {

  constructor(
    private cookieService:CookieService,
    private commanFunction:CommonFunction
  ) { }
  s3BucketUrl = environment.s3BucketUrl;
  url:string;
  queryParams={};

  ngOnInit() {
    let url = this.cookieService.get('_prev_search');
    let result =  this.commanFunction.decodeUrl(url)
    this.url = result.url;
    this.queryParams = result.params;
  }
}
