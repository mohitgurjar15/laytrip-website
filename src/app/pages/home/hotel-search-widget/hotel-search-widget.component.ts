import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-search-widget',
  templateUrl: './hotel-search-widget.component.html',
  styleUrls: ['./hotel-search-widget.component.scss'],
})
export class HotelSearchWidgetComponent implements OnInit {

  @ViewChild('dateFilter', undefined) private dateFilter: any;
  s3BucketUrl = environment.s3BucketUrl;
  countryCode: string;
  checkInDate = new Date();
  checkOutDate = new Date();
  rangeDates: Date[];
  maxDate: any = {};
  minDate: any = {};
  checkInMinDate;
  checkOutMinDate;
  isPrevButton = false;
  hotelSearchForm: FormGroup;
  defaultCity = 'New York';
  defaultHotelCountry = 'NY, United States';
  fromDestinationTitle = 'New York, United States';
  fromDestinationInfo = {
    city: 'New York',
    country: 'United States',
    hotel_id: null,
    title: 'New York',
    type: 'city',
    geo_codes: { lat: 40.7681, long: -73.9819 },
  };
  searchedValue = [];
  hotelSearchFormSubmitted = false;
  searchHotelInfo = {
    latitude: null,
    longitude: null,
    check_in: null,
    check_out: null,
    occupancies: [
      {
        adults: null,
        children: []
      }
    ],
  };
  totalPerson: number = 1;

  selectedGuest = [
    {
      adults: 2,
      child: [],
      children: []
    }
  ];

  showCommingSoon: boolean = false;

  constructor(
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
  ) {
    this.hotelSearchForm = this.fb.group({
      fromDestination: ['', [Validators.required]],
    });
    this.checkInMinDate = new Date();
    this.checkOutMinDate = this.checkInDate;
    this.checkOutDate.setDate(this.checkInDate.getDate() + 2);
    this.rangeDates = [this.checkInDate, this.checkOutDate];

    this.searchHotelInfo =
    {
      latitude: null,
      longitude: null,
      check_in: this.checkInDate,
      check_out: this.checkOutDate,
      occupancies: [
        {
          adults: null,
          children: []
        }
      ],
    };

    let host = window.location.origin;
    if (host.includes("staging")) {
      this.showCommingSoon = true;
    }
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.hotelSearchFormSubmitted = false;
    this.countryCode = this.commonFunction.getUserCountry();
    if (this.fromDestinationInfo) {
      this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat;
      this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long;
      this.searchedValue.push({ key: 'fromSearch', value: this.fromDestinationInfo });
    }
    if (this.selectedGuest) {
      this.searchedValue.push({ key: 'guest', value: this.selectedGuest });
    }
  }

  checkInDateUpdate(date) {
    console.log(date);
    // this is only for closing date range picker, after selecting both dates
    if (this.rangeDates[1]) { // If second date is selected
      this.dateFilter.hideOverlay();
    };
    if (this.rangeDates[0] && this.rangeDates[1]) {
      this.checkInDate = this.rangeDates[0];
      this.checkInMinDate = this.rangeDates[0];
      this.checkOutDate = this.rangeDates[1];
      this.checkOutMinDate = this.rangeDates[1];
      this.searchHotelInfo.check_in = this.checkInDate;
      this.searchHotelInfo.check_out = this.checkOutDate;
    }
    console.log(this.searchHotelInfo);
  }

  checkOutDateUpdate(date) {
    // this.checkOutDate = new Date(date);
    // this.checkOutMinDate = new Date(date);
    // this.searchHotelInfo.check_out = this.checkOutDate;
  }

  // dateChange(type, direction) {
  //   if (type === 'checkIn') {
  //     if (direction === 'previous') {
  //       if (moment(this.checkInDate).isAfter(moment(new Date()))) {
  //         this.checkInDate = new Date(moment(this.checkInDate).subtract(1, 'days').format('MM/DD/YYYY'));
  //       }
  //     } else {
  //       this.checkInDate = new Date(moment(this.checkInDate).add(1, 'days').format('MM/DD/YYYY'));
  //       if (moment(this.checkInDate).isAfter(this.checkOutDate)) {
  //         this.checkOutDate = new Date(moment(this.checkOutDate).add(1, 'days').format('MM/DD/YYYY'));
  //       }
  //     }
  //     this.checkOutMinDate = new Date(this.checkInDate);
  //   }

  //   if (type === 'checkOut') {

  //     if (direction === 'previous') {
  //       if (moment(this.checkInDate).isBefore(this.checkOutDate)) {
  //         this.checkOutDate = new Date(moment(this.checkOutDate).subtract(1, 'days').format('MM/DD/YYYY'));
  //       }
  //     } else {
  //       this.checkOutDate = new Date(moment(this.checkOutDate).add(1, 'days').format('MM/DD/YYYY'));
  //     }
  //   }
  // }

  changeGuestInfo(event) {
    if (this.searchedValue && this.searchedValue.find(i => i.key === 'guest')) {
      this.searchedValue[1]['value'] = event;
    }
  }

  destinationChangedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.searchedValue[0]['value'] = event.value;
      this.fromDestinationTitle = event.value.title;
      this.searchHotelInfo.latitude = event.value.geo_codes.lat;
      this.searchHotelInfo.longitude = event.value.geo_codes.long;
    }
  }

  searchHotels() {
    this.hotelSearchFormSubmitted = true;
    let queryParams: any = {};
    queryParams.check_in = moment(this.searchHotelInfo.check_in).format('YYYY-MM-DD');
    queryParams.check_out = moment(this.searchHotelInfo.check_out).format('YYYY-MM-DD');
    queryParams.latitude = this.searchHotelInfo.latitude;
    queryParams.longitude = this.searchHotelInfo.longitude;
    queryParams.itenery = btoa(JSON.stringify(this.searchedValue[1]['value']));
    queryParams.location = btoa(JSON.stringify(this.searchedValue[0]['value']));

    if (this.searchHotelInfo && this.totalPerson && this.searchHotelInfo.latitude && this.searchHotelInfo.longitude &&
      this.searchHotelInfo.check_in && this.searchHotelInfo.check_out) {
      // localStorage.setItem('_hote', JSON.stringify(this.searchedValue));
      this.router.navigate(['hotel/search'], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
    }
  }

}
