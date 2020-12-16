import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input, SimpleChanges, ViewChild } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonFunction } from '../../../../_helpers/common-function';
import { HotelService } from '../../../../services/hotel.service';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDatepicker, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../../../_helpers/ngbDateCustomParserFormatter';

@Component({
  selector: 'app-hotel-search-bar',
  templateUrl: './hotel-search-bar.component.html',
  styleUrls: ['./hotel-search-bar.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
})
export class HotelSearchBarComponent implements OnInit {

  @ViewChild('dateFilter', undefined) private dateFilter: any;
  @Output() searchBarInfo = new EventEmitter<any>();
  @Input() calenderPrices: any = [];
  s3BucketUrl = environment.s3BucketUrl;
  hotelSearchForm: FormGroup;
  loadingDestination = false;
  data = [];
  placeHolder1 = 'New York';
  // tslint:disable-next-line: quotemark
  totalPerson: number = 1;
  destinationHotel: any = {};
  checkInDate = new Date();
  checkOutDate = new Date();
  rangeDates: Date[];
  isPrevButton = false;
  checkInMinDate;
  checkOutMinDate;
  defaultCity;
  defaultCountry;
  searchedValue = [];
  itemIconArray = {
    hotel: `${this.s3BucketUrl}assets/images/icon/hotel.png`,
    city: `${this.s3BucketUrl}assets/images/icon/city.png`,
    airport: `${this.s3BucketUrl}assets/images/icon/airport.png`,
    region: `${this.s3BucketUrl}assets/images/icon/region.png`,
    poi: `${this.s3BucketUrl}assets/images/icon/poi.png`,
  };
  defaultHotel: any = {};
  searchHotelInfo = {
    latitude: null,
    longitude: null,
    check_in: null,
    check_out: null,
    occupancies: [
      {
        adults: null,
        child: [],
        children: []
      }
    ],
  };

  constructor(
    public fb: FormBuilder,
    private hotelService: HotelService,
    public commonFunction: CommonFunction,
    public cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
  ) {
    this.hotelSearchForm = this.fb.group({
      fromDestination: ['', Validators.required]
    });

    this.checkInDate = new Date(this.route.snapshot.queryParams['check_in']);
    this.checkInMinDate = this.checkInDate;
    this.checkOutDate = new Date(this.route.snapshot.queryParams['check_out']);
    this.checkOutMinDate = this.checkOutDate;
    this.rangeDates = [this.checkInDate, this.checkOutDate];

    this.searchHotelInfo =
    {
      latitude: this.route.snapshot.queryParams['latitude'],
      longitude: this.route.snapshot.queryParams['longitude'],
      check_in: moment(this.route.snapshot.queryParams['check_in']).format('MM/DD/YYYY'),
      check_out: moment(this.route.snapshot.queryParams['check_out']).format('MM/DD/YYYY'),
      occupancies: [
        {
          adults: null,
          child: [],
          children: []
        }
      ],
    };
  }

  ngOnInit() {
    if (this.route && this.route.snapshot && this.route.snapshot.queryParams && this.route.snapshot.queryParams['location']) {
      const info = JSON.parse(atob(this.route.snapshot.queryParams['location']));
      console.log(info);
      if (info) {
        this.defaultHotel.city = info.city;
        this.defaultHotel.country = info.country;
      }
    }
  }

  searchHotel(searchItem) {
    this.loadingDestination = true;
    const searchedData = { term: searchItem };
    this.hotelService.searchHotels(searchedData).subscribe((response: any) => {
      console.log(response);
      if (response && response.data && response.data.length) {
        this.data = response.data.map(res => {
          this.loadingDestination = false;
          return {
            city: res.city,
            country: res.country,
            hotel_id: res.hotel_id,
            title: res.title,
            type: res.type,
            geo_codes: res.geo_codes,
          };
        });
      }
    },
      error => {
        this.loadingDestination = false;
      }
    );
  }

  dateChange(type, direction) {
    console.log('date change');
  }

  modifySearch() {

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

  onChangeSearch(event) {
    if (event.term.length > 2) {
      this.searchHotel(event.term);
    }
  }

  changeGuestInfo(event) {
    this.totalPerson = event.totalPerson;
    this.searchedValue.push({ key: 'guest', value: event });
  }

  selectEvent(event, item) {
    if (!event) {
      this.placeHolder1 = this.placeHolder1;
      this.defaultHotel.city = this.defaultHotel.city;
      this.defaultHotel.country = this.defaultHotel.country;
    }
    if (event && item && item.key === 'fromSearch') {
      this.defaultHotel.city = event.city;
      this.defaultHotel.country = event.country;
      this.searchedValue.push({ key: 'fromSearch', value: event });
    }
  }

  onRemove(event, item) {
    if (item.key === 'fromSearch') {
      this.destinationHotel = Object.create(null);
    }
  }

  changeTravellerInfo(event) {
    console.log(event);
    // this.searchHotelInfo.adult = event.adult;
    // this.searchFlightInfo.child = event.child;
    // this.searchFlightInfo.infant = event.infant;
    // this.searchFlightInfo.class = event.class;
    // this.totalPerson = event.totalPerson;
  }

}
