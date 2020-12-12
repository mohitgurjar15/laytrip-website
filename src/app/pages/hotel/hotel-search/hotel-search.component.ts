import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Location } from '@angular/common';
import * as moment from 'moment';
import { CommonFunction } from '../../../_helpers/common-function';
import { HotelService } from '../../../services/hotel.service';

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
  hotelDetailsMain;
  filterHotelDetails;
  isResetFilter: string = 'no';

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
  ) {
    // document.getElementById('login_btn').style.background = '#FF00BC';
  }

  ngOnInit() {
    window.scroll(0, 0);

    let payload: any = {};
    const info = JSON.parse(localStorage.getItem('_hote'));
    this.route.queryParams.forEach(params => {
      payload = {
        check_in: params.check_in,
        check_out: params.check_out,
        latitude: params.latitude,
        longitude: params.longitude,
        occupancies: [],
        filter: true
      };
      info.forEach(element => {
        if (element && element.key === 'guest') {
          element.value.forEach(item => {
            payload.occupancies.push({ adults: item.adults, children: item.children });
          });
        }
      });
    });
    this.getHotelSearchData(payload);
  }

  getHotelSearchData(payload) {
    this.loading = true;
    this.errorMessage = '';
    this.hotelService.getHotelSearchResult(payload).subscribe((res: any) => {
      this.hotelDetails = res.data;
      this.hotelDetailsMain = res.data;
      this.loading = false;
      this.isNotFound = false;
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

  sortHotels(event) {
    let { key, order } = event;
    console.log("Before Key:", key, this.hotelDetails);
    if (key === 'total') {
      this.hotelDetails.hotels = this.sortJSON(this.hotelDetails.hotels, key, order);
    } else if (key === 'rating') {
      this.hotelDetails.hotels = this.sortByRatings(this.hotelDetails.hotels, key, order);
    } else if (key === 'name') {
      this.hotelDetails.hotels = this.sortByHotelName(this.hotelDetails.hotels, key, order);
    }
  }

  sortJSON(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    } else {
      return data.sort(function (a, b) {
        var x = a.selling[key];
        var y = b.selling[key];
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

  sortByRatings(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    } else {
      return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

  sortByHotelName(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    } else {
      return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

  filterHotel(event) {
    this.hotelDetails.hotels = event;
  }

  resetFilter() {
    this.isResetFilter = (new Date()).toString();
  }
}
