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
  filterHotelDetails;
  temp = [];

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
        occupancies: []
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
      this.hotelDetails = res.data.hotels;
      this.temp = res.data.hotels;
      if (res && res.data) {
        const payload = { token: res.data.details.token };
        this.hotelService.getFilterObjectsHotel(payload).subscribe((response: any) => {
          if (response && response.data) {
            this.filterHotelDetails = response.data;
          }
        });
      }
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
    // if (key === 'total_duration') {
    //   this.hotelDetails = this.sortByDuration(this.filterHotelDetails.items, key, order);
    // }
    // else if (key === 'arrival') {
    //   this.hotelDetails = this.sortByArrival(this.filterHotelDetails.items, key, order);
    // }
    // else if (key === 'departure') {
    //   this.hotelDetails = this.sortByDeparture(this.filterHotelDetails.items, key, order);
    // }
    // else {
    //   this.hotelDetails = this.sortJSON(this.filterHotelDetails.items, key, order);
    // }
    // console.log("After Key:", key, this.hotelDetails)
  }

  // sortJSON(data, key, way) {
  //   if (typeof data === "undefined") {
  //     return data;
  //   } else {
  //     return data.sort(function (a, b) {
  //       var x = a[key];
  //       var y = b[key];
  //       if (way === 'ASC') {
  //         return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  //       }
  //       if (way === 'DESC') {
  //         return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  //       }
  //     });
  //   }
  // }

  // sortByDuration(data, key, way) {
  //   if (typeof data === "undefined") {
  //     return data;
  //   }
  //   else {
  //     return data.sort(function (a, b) {
  //       let x = moment(`${a.arrival_date} ${a.arrival_time}`, 'DD/MM/YYYY hh:mm A').diff(moment(`${a.departure_date} ${a.departure_time}`, 'DD/MM/YYYY hh:mm A'), 'seconds')
  //       let y = moment(`${b.arrival_date} ${b.arrival_time}`, 'DD/MM/YYYY hh:mm A').diff(moment(`${b.departure_date} ${b.departure_time}`, 'DD/MM/YYYY hh:mm A'), 'seconds')
  //       console.log(`${a.arrival_date} ${a.arrival_time}`, `${a.departure_date} ${a.departure_time}`, x, y, way)
  //       if (way === 'ASC') {
  //         return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  //       }
  //       if (way === 'DESC') {
  //         return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  //       }
  //     });
  //   }
  // }

  filterHotel(event) {
    if (event && event.key && event.key === 'rating') {
      
    }
  }
}
