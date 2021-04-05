import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HotelService } from '../../../services/hotel.service';
import { CommonFunction } from '../../../_helpers/common-function';
import * as moment from 'moment';
declare var $: any;

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
  hotelToken;
  isResetFilter: string = 'no';
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
    public commonFunction: CommonFunction,
    public router: Router,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2

  ) {
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.renderer.addClass(document.body, 'cms-bgColor');

    // if (document.getElementById('login_btn')) {
    //   setTimeout(() => {
    //     document.getElementById('login_btn').style.background = '#FF00BC';
    //   }, 1000);
    // }
    let payload: any = {};
    let info;
    this.route.queryParams.forEach(params => {
      info = JSON.parse(atob(this.route.snapshot.queryParams['itenery']));
      payload = {
        check_in: params.check_in,
        check_out: params.check_out,
        latitude: params.latitude,
        longitude: params.longitude,
        occupancies: [],
        filter: true,
      };
      info.forEach(item => {
        payload.occupancies.push({ adults: item.adults, children: item.children });
      });
      this.getHotelSearchData(payload);
    });
  }

  // ngAfterViewInit() {
  //   $("#search_large_btn1, #search_large_btn2, #search_large_btn3").hover(
  //     function () {
  //       $('.norm_btn').toggleClass("d-none");
  //       $('.hover_btn').toggleClass("show");
  //     }
  //   );
  // }

  getHotelSearchData(payload) {
    this.loading = true;
    this.errorMessage = '';
    this.hotelService.getHotelSearchResult(payload).subscribe((res: any) => {
      this.hotelDetails = res.data.hotels;
      this.hotelDetailsMain = res.data;
      this.hotelToken = res.data.details.token;
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
    setTimeout(() => {
      this.hotelDetails = event;
    }, 100);
  }

  resetFilter() {
    this.isResetFilter = (new Date()).toString();
  }

  getHotelSearchDataByModify(event) {
    let urlData = this.commonFunction.decodeUrl(this.router.url);
    let locations = { city: event.city, country: event.country };
    let queryParams: any = {};
    queryParams.check_in = moment(event.check_in).format('YYYY-MM-DD');
    queryParams.check_out = moment(event.check_out).format('YYYY-MM-DD');
    queryParams.latitude = parseFloat(event.latitude);
    queryParams.longitude = parseFloat(event.longitude);
    queryParams.itenery = btoa(JSON.stringify(event.occupancies));
    queryParams.location = btoa(JSON.stringify(locations));
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`${urlData.url}`], { queryParams: queryParams, queryParamsHandling: 'merge' });
    });
  }
}
