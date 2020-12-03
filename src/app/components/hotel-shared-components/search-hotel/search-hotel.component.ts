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
  @Input() defaultSelected: string;
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
    // this.defaultSelectedTemp = this.defaultSelected;
    // this.setDefaultAirport();
    // this.data[0] = this.airport;
  }

  ngDocheck() {
  }

  ngAfterViewChecked() {

  }

  searchHotel(searchItem) {
    this.loading = true;
    const searchedData = { term: searchItem };
    this.hotelService.searchHotels(searchedData).subscribe((response: any) => {
      console.log(response);
      if (response && response.data && response.data.length) {
        this.data = response.data.map(res => {
          this.loading = false;
          if (res && res.type === 'city') {
            this.itemIcon = 'city';
          } else if (res && res.type === 'airport') {
            this.itemIcon = 'airport';
          } else if (res && res.type === 'pointOfInterestIcon') {
            this.itemIcon = 'pointofinterest';
          } else if (res && res.type === 'region') {
            this.itemIcon = 'region';
          } else if (res && res.type === 'hotel') {
            this.itemIcon = 'hotel';
          }
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
      // this.data = response.map(res => {
      //   this.loading = false;
      //   return {
      //     id: res.id,
      //     name: res.name,
      //     code: res.code,
      //     city: res.city,
      //     country: res.country,
      //     display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
      //     parentId: res.parentId
      //   };
      // });
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
    } else if (event && index && index === 'toSearch') {
      this.changeValue.emit({ key: 'toSearch', value: event });
    }
  }

  onRemove(event) {
    this.selectedHotel = {};
    this.defaultSelected = this.defaultSelectedTemp;
  }

  setDefaultAirport() {
    try {
      let location: any = this.cookieService.get('__loc');
      location = JSON.parse(location);
      if (typeof location.airport !== 'undefined') {
        /* location.airport.display_name = `${location.city},${location.country},(${location.code}),${location.name}`,
        this.data[0] = location.airport;
        this.airportDefaultDestValue = this.data[0].city;
        this.defaultSelected='';
        this.selectedHotel = this.data[0]; */
      }
    }
    catch (error) {

    }
  }
}
