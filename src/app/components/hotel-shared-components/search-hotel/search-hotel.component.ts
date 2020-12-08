import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { HotelService } from '../../../services/hotel.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
// import { data } from './airport';


@Component({
  selector: 'app-search-hotel',
  templateUrl: './search-hotel.component.html',
  styleUrls: ['./search-hotel.component.scss']
})
export class SearchHotelComponent implements OnInit, AfterViewChecked {

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
  itemIcon = '';

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
        thumbnail: this.itemIcon
      });
    }
  }

  ngDocheck() {
  }

  ngAfterViewChecked() {

  }

  searchHotel(searchItem) {
    this.loading = true;
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
          this.loading = false;
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
    this.defaultSelected = event;
    if (event && index && index === 'fromSearch') {
      this.changeValue.emit({ key: 'fromSearch', value: event });
    }
  }

  onRemove(event) {
    this.selectedHotel = {};
    this.defaultSelected = this.defaultSelectedTemp;
  }
}
