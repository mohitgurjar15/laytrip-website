import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  isResetFilter: string = 'no';
  subscriptions: Subscription[] = [];
  searchedValue = [];
  roomsGroup = [
    {
      adults: 2,
      child: [],
      children: []
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
  ) {
  }

  ngOnInit() {
    window.scroll(0, 0);
    setTimeout(() => {
      document.getElementById('login_btn').style.background = '#FF00BC';
    }, 1000);
    this.searchedValue.push({ key: 'guest', value: this.roomsGroup });

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
      this.hotelDetails = res.data.hotels;
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
    if (key === 'total') {
      this.hotelDetails = this.sortJSON(this.hotelDetails, key, order);
    } else if (key === 'rating') {
      this.hotelDetails = this.sortByRatings(this.hotelDetails, key, order);
    } else if (key === 'name') {
      this.hotelDetails = this.sortByHotelName(this.hotelDetails, key, order);
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
    this.hotelDetails = event;
  }

  resetFilter() {
    this.isResetFilter = (new Date()).toString();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    localStorage.setItem('_hote', JSON.stringify(this.searchedValue));
  }
}
