import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepicker, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../../_helpers/ngbDateCustomParserFormatter';

@Component({
  selector: 'app-hotel-search-widget',
  templateUrl: './hotel-search-widget.component.html',
  styleUrls: ['./hotel-search-widget.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
})
export class HotelSearchWidgetComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  countryCode: string;
  // checkInDate = new Date(moment().format('MM/DD/YYYY'));
  // checkOutDate = new Date(moment().add(38, 'days').format('MM/DD/YYYY'));
  // maxDate: any = {};
  // minDate: any = {};
  checkInDate: NgbDate;
  checkOutDate: NgbDate | null = null;
  hoveredDate: NgbDate | null = null;
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

  constructor(
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private config: NgbDatepickerConfig,
  ) {
    this.checkInMinDate = new Date();
    this.hotelSearchForm = this.fb.group({
      fromDestination: ['', [Validators.required]],
    });
    this.checkInDate = calendar.getToday();
    this.checkOutDate = calendar.getNext(calendar.getToday(), 'd', 7);

    let current = new Date();
    this.checkInMinDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.searchHotelInfo =
    {
      latitude: null,
      longitude: null,
      check_in: `${this.checkInDate.year}-${this.checkInDate.month}-${this.checkInDate.day}`,
      check_out: `${this.checkOutDate.year}-${this.checkOutDate.month}-${this.checkOutDate.day}`,
      occupancies: [
        {
          adults: null,
          children: []
        }
      ],
    };
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
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

  // checkInDateUpdate(date) {
  //   this.checkInDate = new Date(date);
  //   this.checkInMinDate = new Date(date);
  //   this.searchHotelInfo.check_in = this.checkInDate;
  // }

  // checkOutDateUpdate(date) {
  //   this.checkOutDate = new Date(date);
  //   this.checkOutMinDate = new Date(date);
  //   this.searchHotelInfo.check_out = this.checkOutDate;
  // }

  dateChange(type, direction) {
    const checkindate = `${this.searchHotelInfo.check_in.year}/${this.searchHotelInfo.check_in.month}/${this.searchHotelInfo.check_in.day}`;
    const checkoutdate = `${this.searchHotelInfo.check_out.year}/${this.searchHotelInfo.check_out.month}/${this.searchHotelInfo.check_out.day}`;
    if (type === 'checkIn') {
      if (direction === 'previous') {
        this.checkInDate = this.calendar.getPrev(this.checkInDate, 'd', 1);
      } else {
        this.checkInDate = this.calendar.getNext(this.checkInDate, 'd', 1);
      }
    }
    if (type === 'checkOut') {
      if (direction === 'previous') {
        this.checkOutDate = this.calendar.getPrev(this.checkOutDate, 'd', 1);
        this.isPrevButton = false;
      } else {
        this.checkOutDate = this.calendar.getNext(this.checkOutDate, 'd', 1);
        this.isPrevButton = true;
      }
    }
    // if (type === 'checkIn') {
    //   if (direction === 'previous') {
    //     if (moment(this.checkInDate).isAfter(moment(new Date()))) {
    //       this.checkInDate = new Date(moment(this.checkInDate).subtract(1, 'days').format('MM/DD/YYYY'));
    //     }
    //   } else {
    //     this.checkInDate = new Date(moment(this.checkInDate).add(1, 'days').format('MM/DD/YYYY'));
    //     if (moment(this.checkInDate).isAfter(this.checkOutDate)) {
    //       this.checkOutDate = new Date(moment(this.checkOutDate).add(1, 'days').format('MM/DD/YYYY'));
    //     }
    //   }
    //   this.checkOutMinDate = new Date(this.checkInDate);
    // }

    // if (type === 'checkOut') {

    //   if (direction === 'previous') {
    //     if (moment(this.checkInDate).isBefore(this.checkOutDate)) {
    //       this.checkOutDate = new Date(moment(this.checkOutDate).subtract(1, 'days').format('MM/DD/YYYY'));
    //     }
    //   } else {
    //     this.checkOutDate = new Date(moment(this.checkOutDate).add(1, 'days').format('MM/DD/YYYY'));
    //   }
    // }
  }

  onDateSelection(date: NgbDate) {
    if (!this.checkInDate && !this.checkOutDate) {
      this.checkInDate = date;
    } else if (this.checkInDate && !this.checkOutDate && date.after(this.checkInDate)) {
      this.checkOutDate = date;
    } else {
      this.checkOutDate = null;
      this.checkInDate = date;
    }
    const selectedDate = {
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate
    };
    if (selectedDate.checkInDate && selectedDate.checkOutDate) {
      this.searchHotelInfo.check_in = `${selectedDate.checkInDate.year}-${selectedDate.checkInDate.month}-${selectedDate.checkInDate.day}`;
      this.searchHotelInfo.check_out = `${selectedDate.checkOutDate.year}-${selectedDate.checkOutDate.month}-${selectedDate.checkOutDate.day}`;
    }
  }

  isRange(date: NgbDate) {
    return date.equals(this.checkInDate) || (this.checkOutDate && date.equals(this.checkOutDate)) || this.isInside(date) || this.isHovered(date);
  }

  isHovered(date: NgbDate) {
    return this.checkInDate && !this.checkOutDate && this.hoveredDate && date.after(this.checkInDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.checkOutDate && date.after(this.checkInDate) && date.before(this.checkOutDate);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

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
    queryParams.check_in = this.searchHotelInfo.check_in;
    queryParams.check_out = this.searchHotelInfo.check_out;
    queryParams.latitude = this.searchHotelInfo.latitude;
    queryParams.longitude = this.searchHotelInfo.longitude;

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
