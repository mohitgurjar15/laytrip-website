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
  itemIcon = '';
  placeHolder1 = 'New York';
  // tslint:disable-next-line: quotemark
  totalPerson: number = 1;
  hotelDefaultDestValue;
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
    info.forEach(i => {
      if (i.key === 'fromSearch') {
        this.defaultCity = i.value.city;
        this.defaultCountry = i.value.country;
      }
      // this.checkInDate = new Date(this.route.snapshot.queryParams['check_in']);
      // this.checkOutDate = new Date(this.route.snapshot.queryParams['check_out']);

      this.data = [
        {
          city: i.value.city,
          country: i.value.country,
          hotel_id: i.value.hotel_id,
          title: i.value.title,
          type: i.value.type,
          geo_codes: { lat: this.route.snapshot.queryParams['latitude'], long: this.route.snapshot.queryParams['longitude'] },
          thumbnail: this.itemIcon
        }
      ];
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
    // const iconArray = {
    //   city: 'City',
    //   airport: 'Airport',
    //   region: 'Region',
    //   poi: 'Point of Interest',
    //   hotel: 'Hotel',
    // };
    this.hotelService.searchHotels(searchedData).subscribe((response: any) => {
      console.log(response);
      if (response && response.data && response.data.length) {
        this.data = response.data.map(res => {
          this.loadingDestination = false;
          // if (res && res.type === 'city') {
          //   this.itemIcon = 'city';
          // } else if (res && res.type === 'airport') {
          //   this.itemIcon = 'airport';
          // } else if (res && res.type === 'poi') {
          //   this.itemIcon = 'pointofinterest';
          // } else if (res && res.type === 'region') {
          //   this.itemIcon = 'region';
          // } else if (res && res.type === 'hotel') {
          //   this.itemIcon = 'hotel';
          // }
          return {
            city: res.city,
            country: res.country,
            hotel_id: res.hotel_id,
            title: res.title,
            type: res.type,
            geo_codes: res.geo_codes,
            thumbnail: this.itemIcon
          };
        });
      }
    },
      error => {
        this.loadingDestination = false;
      }
    );
  }

  selectEvent(event, data) {

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

  changeSearchDestination(event) {
    if (event.term.length > 2) {
      this.searchHotelDestination(event.term);
    }
  }

  changeGuestInfo(event) {
    this.totalPerson = event.totalPerson;
    this.searchedValue.push({ key: 'guest', value: event });
  }

  searchHotelDestination(searchItem) {
    this.loadingDestination = true;
    this.hotelService.searchHotels(searchItem).subscribe((response: any) => {
      this.data = response.map(res => {
        this.loadingDestination = false;
        return {
          id: res.id,
          name: res.name,
          code: res.code,
          city: res.city,
          country: res.country,
          display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
          parentId: res.parentId
        };
      });
    },
      error => {
        this.loadingDestination = false;
      }
    );
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
