import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';
import { CommonFunction } from '../../../_helpers/common-function';
import * as moment from 'moment';
import { HomeService } from '../../../services/home.service';
import { TranslateService } from '@ngx-translate/core';
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
  filteredLabel: string = 'Price Low to High';

  roomsGroup = [
    {
      adults: 2,
      child: [],
      children: []
    }
  ];
  filterOpen: boolean = false;
  sortByOpen: boolean = false;
  hotelDealIcon = false;
  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    public commonFunction: CommonFunction,
    public router: Router,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private homeService: HomeService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.renderer.addClass(document.body, 'cms-bgColor');

    let info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['itenery'])));
    this.hotelDealIcon = this.route.snapshot.queryParams['dealsIcon']
    //this.hotelDealIcon = false;
    let refundable = 'no';
    if(this.hotelDealIcon === true){
      refundable = 'yes'
    }
    this.homeService.setDeaslToggle(this.hotelDealIcon)
    let payload = {
      check_in: this.route.snapshot.queryParams['check_in'],
      check_out: this.route.snapshot.queryParams['check_out'],
      latitude: this.route.snapshot.queryParams['x_coordinate'],
      longitude: this.route.snapshot.queryParams['y_coordinate'],
      city_id: this.route.snapshot.queryParams['city_id'],
      // city_name: this.route.snapshot.queryParams['city_name'],
      hotel_id: this.route.snapshot.queryParams['hotel_id'],
      // type: this.route.snapshot.queryParams['type'],
      rooms: info.rooms,
      adults: info.adults,
      children: info.child,
      filter: true,
      // is_refundable : refundable
    };
    this.getHotelSearchData(payload);
    this.setFilteredLabel('filter_1');
  }

  getHotelSearchData(payload) {
    this.loading = true;
    this.errorMessage = '';
    this.hotelService.getHotelSearchResult(payload).subscribe((res: any) => {
      this.hotelDetails = res.data.hotels;
      this.hotelDetails = this.sortPriceJSON(this.hotelDetails, 'total', 'ASC')
      this.hotelService.setHotels(this.hotelDetails)
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
    this.hotelService.setSortFilter(event);
    let { key, order } = event;
    if (key === 'total') {
      if (order === 'ASC') {
        //this.filteredLabel = 'Price Lowest to Highest';
        this.setFilteredLabel('filter_1');
        this.hotelDetails = this.sortPriceJSON(this.hotelDetails, key, order);
      } else if (order === 'DESC') {
        //this.filteredLabel = 'Price Highest to Lowest';
        this.setFilteredLabel('filter_2');
        this.hotelDetails = this.sortPriceJSON(this.hotelDetails, key, order);
      }
    } else if (key === 'rating') {
      if (order === 'ASC') {
        //this.filteredLabel = 'Rating Lowest to Highest';
        this.setFilteredLabel('filter_3');
        this.hotelDetails = this.sortByRatings(this.hotelDetails, key, order);
      } else if (order === 'DESC') {
        //this.filteredLabel = 'Rating Highest to Lowest';
        this.setFilteredLabel('filter_4');
        this.hotelDetails = this.sortByRatings(this.hotelDetails, key, order);
      }
    } else if (key === 'name') {

      if (order === 'ASC') {
        //this.filteredLabel = 'Alphabetical A to Z';
        this.setFilteredLabel('filter_5');
        this.hotelDetails = this.sortByHotelName(this.hotelDetails, key, order);
      } else if (order === 'DESC') {
        //this.filteredLabel = 'Alphabetical Z to A';
        this.setFilteredLabel('filter_6');
        this.hotelDetails = this.sortByHotelName(this.hotelDetails, key, order);

      }
    }

    this.hotelService.setHotels(this.hotelDetails)
  }

  sortPriceJSON(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    } else {
      return data.sort(function (a, b) {
        var x = a.secondary_start_price > 0 ? a.secondary_start_price : a.selling[key];
        var y = b.secondary_start_price > 0 ? b.secondary_start_price : b.selling[key];

        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        } else if (way === 'DESC') {
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
        var x = a[key].toLowerCase();
        var y = b[key].toLowerCase();
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }
  closeModal() {
    $('#filter_mob_modal').modal('hide');
  }

  filterHotel(event) {
    setTimeout(() => {
      this.hotelDetails = event;
      this.hotelService.setHotels(this.hotelDetails)
    }, 100);
  }

  resetFilter() {
    this.isResetFilter = (new Date()).toString();
  }

  filterDrawerOpen() {
    this.filterOpen = !this.filterOpen;
  }
  sortByDrawerOpen() {
    this.sortByOpen = !this.sortByOpen;
  }

  getHotelSearchDataByModify(event) {
    let urlData = this.commonFunction.decodeUrl(this.router.url);
    let locations = { city: event.city, country: event.country };
    let queryParams: any = {};
    queryParams.check_in = moment(event.check_in).format('YYYY-MM-DD');
    queryParams.check_out = moment(event.check_out).format('YYYY-MM-DD');
    queryParams.latitude = parseFloat(event.latitude);
    queryParams.longitude = parseFloat(event.longitude);
    queryParams.itenery = btoa(encodeURIComponent(JSON.stringify(event.occupancies)));
    queryParams.location = btoa(encodeURIComponent(JSON.stringify(locations))).replace(/\=+$/, '');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`${urlData.url}`], { queryParams: queryParams, queryParamsHandling: 'merge' });
    });
  }

  moduleTabClick(tabName) {
    if (tabName == 'flight') {
      this.homeService.setActiveTab(tabName);
      if (this.commonFunction.isRefferal()) {
        var parms = this.commonFunction.getRefferalParms();
        var queryParams: any = {};
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if (parms.utm_medium) {
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if (parms.utm_campaign) {
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate(['/'], { queryParams: queryParams });
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  // Author: xavier | 2021/7/27
  // Description: Update filtered label using the appropiate translation key
  setFilteredLabel(rscId: string) {
    this.translate.
      get(rscId).
      subscribe((res: string) => this.filteredLabel = res);
  }
}
