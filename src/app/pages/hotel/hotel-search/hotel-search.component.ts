import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Location } from '@angular/common';
import * as moment from 'moment';
import { CommonFunction } from '../../../_helpers/common-function';
import { HotelService } from 'src/app/services/hotel.service';

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.scss']
})
export class HotelSearchComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  calenderPrices: [] = [];
  loading = true;
  errorMessage: string = '';
  isNotFound = false;
  hotelDetails;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
  ) { }

  ngOnInit() {
    window.scroll(0, 0);

    let payload: any = {};
    this.route.queryParams.forEach(params => {
      console.log(params);
      payload = {
        check_in: params.check_in,
        check_out: params.check_out,
        latitude: params.latitude,
        longitude: params.longitude,
        occupancies: [
          {
            adults: 2,
            children: [2, 3],
          }
        ],
      };
    });
    this.getHotelSearchData(payload);
  }

  getHotelSearchData(payload) {
    this.loading = true;
    this.errorMessage = '';
    this.hotelService.getHotelSearchResult(payload).subscribe((res: any) => {
      console.log(res);
      this.loading = false;
      this.isNotFound = false;
      this.hotelDetails = res.data.hotels;
    }, err => {
      if (err && err.status === 404) {
        this.errorMessage = err.message;
      } else {
        this.isNotFound = true;
      }

      this.loading = false;
    });
  }

  getSearchItem(event) {
    console.log(event);
  }
}
