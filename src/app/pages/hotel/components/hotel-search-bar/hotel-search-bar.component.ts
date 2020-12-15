import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input, SimpleChanges } from '@angular/core';
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
  // checkInDate = new Date(moment().format('MM/DD/YYYY'));
  // checkOutDate = new Date(moment().add(38, 'days').format('MM/DD/YYYY'));
  checkInDate: NgbDate;
  checkOutDate: NgbDate | null = null;
  hoveredDate: NgbDate | null = null;
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

    this.checkInDate = calendar.getToday();
    this.checkOutDate = calendar.getNext(calendar.getToday(), 'd', 7);
  }

  ngOnInit() {
    const info = JSON.parse(localStorage.getItem('_hote'));
    console.log(info);
    info.forEach(i => {
      if (i.key === 'fromSearch') {
        this.data = [{
          city: i.value.city,
          country: i.value.country,
          hotel_id: i.value.hotel_id,
          title: i.value.title,
          type: i.value.type,
          geo_codes: { lat: i.value.geo_codes.lat, long: i.value.geo_codes.long },
        }
        ];
        this.defaultHotel.city = i.value.city;
        this.defaultHotel.country = i.value.country;
      }
      // this.checkInDate = new Date(this.route.snapshot.queryParams['check_in']);
      // this.checkOutDate = new Date(this.route.snapshot.queryParams['check_out']);
    });

    let current = new Date();
    this.checkInMinDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
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

  }

  modifySearch() {

  }

  // checkInDateUpdate(date) {
  //   this.checkInDate = new Date(date);
  //   this.checkInMinDate = new Date(date);
  // }

  // checkOutDateUpdate(date) {
  //   this.checkOutDate = new Date(date);
  //   this.checkOutMinDate = new Date(date);
  // }

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
      // this.searchHotelInfo.check_in = `${selectedDate.checkInDate.year}-${selectedDate.checkInDate.month}-${selectedDate.checkInDate.day}`;
      // this.searchHotelInfo.check_out = `${selectedDate.checkOutDate.year}-${selectedDate.checkOutDate.month}-${selectedDate.checkOutDate.day}`;
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
}
