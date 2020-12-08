import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-search-widget',
  templateUrl: './hotel-search-widget.component.html',
  styleUrls: ['./hotel-search-widget.component.scss']
})
export class HotelSearchWidgetComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  countryCode: string;
  checkInDate = new Date(moment().format('MM/DD/YYYY'));
  checkOutDate = new Date(moment().add(38, 'days').format('MM/DD/YYYY'));
  checkInMinDate;
  checkOutMinDate;
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
  searchHotelInfo =
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
  totalPerson: number = 1;

  constructor(
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
  ) {
    this.checkInMinDate = new Date();
    this.hotelSearchForm = this.fb.group({
      fromDestination: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.countryCode = this.commonFunction.getUserCountry();
  }

  checkInDateUpdate(date) {
    this.checkInDate = new Date(date);
    this.checkInMinDate = new Date(date);
    this.searchHotelInfo.check_in = this.checkInDate;
  }

  checkOutDateUpdate(date) {
    this.checkOutDate = new Date(date);
    this.checkOutMinDate = new Date(date);
    this.searchHotelInfo.check_out = this.checkOutDate;
  }

  dateChange(type, direction) {

    if (type === 'checkIn') {
      if (direction === 'previous') {
        if (moment(this.checkInDate).isAfter(moment(new Date()))) {
          this.checkInDate = new Date(moment(this.checkInDate).subtract(1, 'days').format('MM/DD/YYYY'));
        }
      } else {
        this.checkInDate = new Date(moment(this.checkInDate).add(1, 'days').format('MM/DD/YYYY'));
        if (moment(this.checkInDate).isAfter(this.checkOutDate)) {
          this.checkOutDate = new Date(moment(this.checkOutDate).add(1, 'days').format('MM/DD/YYYY'));
        }
      }
      this.checkOutMinDate = new Date(this.checkInDate);
    }

    if (type === 'checkOut') {

      if (direction === 'previous') {
        if (moment(this.checkInDate).isBefore(this.checkOutDate)) {
          this.checkOutDate = new Date(moment(this.checkOutDate).subtract(1, 'days').format('MM/DD/YYYY'));
        }
      } else {
        this.checkOutDate = new Date(moment(this.checkOutDate).add(1, 'days').format('MM/DD/YYYY'));
      }
    }
  }

  changeGuestInfo(event) {
    // this.searchHotelInfo.adult = event.adult;
    // this.searchHotelInfo.child = event.child;
    this.totalPerson = event.totalPerson;
    this.searchedValue.push({ key: 'guest', value: event });
  }

  destinationChangedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.fromDestinationTitle = event.value.title;
      this.searchHotelInfo.latitude = event.value.geo_codes.lat;
      this.searchHotelInfo.longitude = event.value.geo_codes.long;
      this.searchedValue.push({ key: 'fromSearch', value: event.value });
    }
  }

  searchHotels() {
    this.hotelSearchFormSubmitted = true;
    let queryParams: any = {};
    queryParams.check_in = moment(this.searchHotelInfo.check_in).format('YYYY-MM-DD');
    queryParams.check_out = moment(this.searchHotelInfo.check_out).format('YYYY-MM-DD');
    queryParams.latitude = this.searchHotelInfo.latitude;
    queryParams.longitude = this.searchHotelInfo.longitude;
    console.log(queryParams);

    if (this.searchHotelInfo && this.totalPerson && this.searchHotelInfo.latitude && this.searchHotelInfo.longitude &&
      this.searchHotelInfo.check_in && this.searchHotelInfo.check_out) {
      localStorage.setItem('_hote', JSON.stringify(this.searchedValue));
      this.router.navigate(['hotel/search'], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
    }
  }

}
