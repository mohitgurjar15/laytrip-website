import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { CommonFunction } from '../..../../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-flight-booking-failed',
  templateUrl: './flight-booking-failed.component.html',
  styleUrls: ['./flight-booking-failed.component.scss']
})
export class FlightBookingFailedComponent implements OnInit {

  constructor(
    private cookieService:CookieService,
    private commanFunction:CommonFunction
  ) { }
  url:string;
  queryParams={};
  s3BucketUrl=environment.s3BucketUrl;
  ngOnInit() {
    
    let url = this.cookieService.get('_prev_search');
    let result =  this.commanFunction.decodeUrl(url)
    this.url = result.url;
    this.queryParams = result.params;
  }

}
