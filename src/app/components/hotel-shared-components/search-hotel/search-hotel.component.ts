import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { HotelService } from '../../../services/hotel.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-search-hotel',
  templateUrl: './search-hotel.component.html',
  styleUrls: ['./search-hotel.component.scss']
})
export class SearchHotelComponent implements OnInit, AfterViewChecked {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() label: string;
  @Input() tabIndex: number;
  @Input() placeHolder: string;
  @Input() defaultSelected;
  @Input() id;
  @Input() form: FormGroup;
  @Input() controlName: FormControl;
  @Output() changeValue = new EventEmitter<any>();
  @Input() defaultCity: string;
  defaultSelectedTemp;
  airportDefaultDestValue;
  departureAirport;
  selectedHotel: any = {};
  loading = false;
  data = [];
  itemIconArray = {
    hotel: `${this.s3BucketUrl}assets/images/icon/hotel.png`,
    city: `${this.s3BucketUrl}assets/images/icon/city.png`,
    airport: `${this.s3BucketUrl}assets/images/icon/airport.png`,
    region: `${this.s3BucketUrl}assets/images/icon/region.png`,
    poi: `${this.s3BucketUrl}assets/images/icon/poi.png`,
  };
  recentSearchInfo: any = {};

  constructor(
    private hotelService: HotelService,
    public cd: ChangeDetectorRef,
    public cookieService: CookieService,
  ) {
  }


  ngOnInit() {
    if (this.defaultSelected) {
      this.data.push({
        city: this.defaultSelected.city,
        country: this.defaultSelected.country,
        hotel_id: null,
        title: this.defaultSelected.title,
        type: this.defaultSelected.type,
        geo_codes: this.defaultSelected.geo_codes,
      });
    }
    // if (localStorage.getItem('_hotel_recent')) {
    //   console.log(JSON.parse(atob(localStorage.getItem('_hotel_recent'))));
    //   this.recentSearchInfo = JSON.parse(atob(localStorage.getItem('_hotel_recent')));
    // } else {
    //   console.log('no');
    // }
  }

  ngDocheck() {
  }

  ngAfterViewChecked() {

  }

  searchHotel(searchItem) {
    this.loading = true;
    const searchedData = { term: searchItem };
    this.hotelService.searchHotels(searchedData).subscribe((response: any) => {
      if (response && response.data && response.data.length) {
        this.data = response.data.map(res => {
          this.loading = false;
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
        this.loading = false;
      }
    );

  }

  onChangeSearch(event) {
    this.recentSearchInfo = {};
    if (event.term.length > 2) {
      this.searchHotel(event.term);
    }
  }

  selectEvent(event, index) {
    if (!event) {
      this.placeHolder = this.placeHolder;
      this.defaultSelected = this.defaultSelected;
    }
    //this.selectedHotel = event;
    this.defaultSelected = [];
    this.defaultSelected = event;
    if (event && index && index === 'fromSearch') {
      this.changeValue.emit({ key: 'fromSearch', value: event });
      // localStorage.setItem('_hotel_recent', btoa(JSON.stringify(event)));
    }
  }

  onRemove(event) {
    this.selectedHotel = {};
    this.defaultSelected = this.defaultSelectedTemp;
  }
}
