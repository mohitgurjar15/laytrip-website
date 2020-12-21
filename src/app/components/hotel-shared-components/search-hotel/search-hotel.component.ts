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
  recentSearchInfo = [];
  isShowRecentSearch = true;

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
      // this.recentSearchInfo = this.data;
    }
    if (localStorage.getItem('_hotel_recent')) {
      this.recentSearchInfo = JSON.parse(localStorage.getItem('_hotel_recent'));
      // this.data = this.recentSearchInfo;
      this.data = this.recentSearchInfo.map(item => {
        return {
          city: item.city,
          country: item.country,
          hotel_id: null,
          title: item.title,
          type: item.type,
          geo_codes: item.geo_codes,
          recentSearches: 'Recent Searches',
          isRecentSearch: true
        }
      });
    } else {
      console.log('no');
    }
  }

  ngDocheck() {
  }

  ngAfterViewChecked() {

  }

  searchHotel(searchItem) {
    this.loading = true;
    const searchedData = { term: searchItem };
    this.data = [];
    this.isShowRecentSearch = false;
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
      if (this.recentSearchInfo && this.recentSearchInfo.length < 3) {
        this.recentSearchInfo.push(event);
        localStorage.setItem('_hotel_recent', JSON.stringify(this.recentSearchInfo));
      }
    }
  }

  onRemove(event) {
    this.selectedHotel = {};
    this.defaultSelected = this.defaultSelectedTemp;
  }
}
