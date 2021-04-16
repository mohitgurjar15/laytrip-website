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
  filteredLabel : string = 'Price Low to High';

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

    let info = JSON.parse(atob(this.route.snapshot.queryParams['itenery']));
    let payload = {
      check_in: this.route.snapshot.queryParams['check_in'],
      check_out: this.route.snapshot.queryParams['check_out'],
      latitude: this.route.snapshot.queryParams['latitude'],
      longitude: this.route.snapshot.queryParams['longitude'],
      city_id: this.route.snapshot.queryParams['city_id'],
      rooms:info.rooms,
      adults: info.adults,
      children: info.child,
      filter: true,
    };
    this.getHotelSearchData(payload);
  }

  

  getHotelSearchData(payload) {
    this.loading = true;
    this.errorMessage = '';
    this.hotelService.getHotelSearchResult(payload).subscribe((res: any) => {
      this.hotelDetails = res.data.hotels;
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
    let { key, order } = event;
    if (key === 'total') {
      if (order === 'ASC') {
        this.filteredLabel = 'Price Lowest to Highest';
        this.hotelDetails = this.sortJSON(this.hotelDetails, key, order);
      } else if (order === 'DESC') {
        this.filteredLabel = 'Price Highest to Lowest';
        this.hotelDetails = this.sortJSON(this.hotelDetails, key, order);
      }
    } else if (key === 'rating') {
      
      if (order === 'ASC') {
        this.filteredLabel = 'Rating Lowest to Highest';
        this.hotelDetails = this.sortByRatings(this.hotelDetails, key, order);        
      } else if(order === 'DESC'){
        this.filteredLabel = 'Rating Highest to Lowest';
        this.hotelDetails = this.sortByRatings(this.hotelDetails, key, order);
      }
    } else if (key === 'name') {
      
      if (order === 'ASC') {
        this.filteredLabel = 'Alphabetical A to Z';
        this.hotelDetails = this.sortByHotelName(this.hotelDetails, key, order);
      }else if(order === 'DESC'){
        this.filteredLabel = 'Alphabetical Z to A';
        this.hotelDetails = this.sortByHotelName(this.hotelDetails, key, order);

      }
    }

    this.hotelService.setHotels(this.hotelDetails)
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
      this.hotelService.setHotels(this.hotelDetails)
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
