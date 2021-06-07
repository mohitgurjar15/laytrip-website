import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, HostListener, ViewChild } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { HotelService } from '../../services/hotel.service';
import { environment } from '../../../environments/environment';
import { CommonFunction } from '../../_helpers/common-function';

@Component({
  selector: 'app-hotel-suggestion',
  templateUrl: './hotel-suggestion.component.html',
  styleUrls: ['./hotel-suggestion.component.scss']
})
export class HotelSuggestionComponent implements OnInit {

  @Output() selectedHotel = new EventEmitter();
  @Output() validateSearch = new EventEmitter();
  @Output() currentChangeCounter = new EventEmitter();
  isValidSearch: boolean = true;
  s3BucketUrl = environment.s3BucketUrl;
  loading: boolean = false;
  data = [];
  @Input() searchItem: string;
  @Input() defaultItem;
  defaultTempData = [];
  isShowDropDown: boolean = false;
  thisElementClicked: boolean = false;
  $autoComplete;
  isInputFocus : boolean = false;
  progressInterval;
  counterChangeVal=0;

  constructor(
    private hotelService: HotelService,
    private homeService: HomeService,
    private commonFunction: CommonFunction,

  ) { }

  ngOnInit(): void {
    this.defaultTempData[0] = this.defaultItem;
  }
  
  ngOnChanges(changes: SimpleChanges) {    
    
    this.homeService.getLocationForHotelDeal.subscribe(hotelInfo => {
      if (typeof hotelInfo != 'undefined' && Object.keys(hotelInfo).length > 0) {        
        this.searchItem = hotelInfo.title;
      }
    });
    
  }

  searchLocation(event) {
    let notAllowedKey = [40, 38, 9, 37, 39];
    if ((this.searchItem.length == 0 && event.keyCode == 8)) {
      this.data = [];
      this.loading = false;
      this.isShowDropDown = this.searchItem.length > 0 ? true : false;
      this.isValidSearch = this.searchItem.length > 0 ? true : false;
      //this.selectedHotel.emit({})
      this.validateSearch.emit(false);
      return;
    } 

    if (!notAllowedKey.includes(event.keyCode)) {
      this.isShowDropDown = this.searchItem.length > 0 ? true : false;
      this.isValidSearch = this.searchItem.length > 0 ? true : false;
      this.data = [];
      if (this.loading) {
        this.$autoComplete.unsubscribe();
      }
      if (event.keyCode == 8) {
        let item = this.searchItem.split(',');
        this.searchHotel(item[0]);
      } else {
        this.searchHotel(this.searchItem);
        this.validateSearch.emit(false);
      }
    }
    else {
      this.loading = false;
    }
  }

  searchHotel(searchItem) {
    this.loading = true;
    const searchedData = { term: searchItem.replace(/(^\s+|\s+$)/g, "") };
    this.$autoComplete = this.hotelService.searchHotels(searchedData).subscribe((response: any) => {
      this.loading = false;

      if (response && response.data && response.data.length) {
        this.data = response.data.map(res => {
          return {
            city: res.city,
            country: res.country,
            hotel_id: res.hotel_id,
            title: res.title,
            type: res.type,
            geo_codes: res.geo_codes,
            city_id: res.city_id
          };
        });
        this.selectedHotel.emit(this.data[0])
        this.validateSearch.emit(true);
      } else {
        this.isShowDropDown = false;
      }
    },
      error => {
        this.validateSearch.emit(false);
        this.loading = false;
        this.isShowDropDown = false;
      }
    );
  }

  selectHotelItem(item) {
    this.isShowDropDown = false;
    this.searchItem = item.title;
    this.selectedHotel.emit(item);
    this.validateSearch.emit(true);
    this.isValidSearch = true;
  }

  @HostListener('document:click')
  clickOutside() {
    if (!this.thisElementClicked) {
      this.isShowDropDown = false;
    }
    this.thisElementClicked = false;
  }
  counter =0;
  @HostListener('click')
  clickInside() {   
    this.counter+=1;
    this.currentChangeCounter.emit(this.counter);
    this.isShowDropDown = true;
  }
  
  onFocus(){
    this.isInputFocus = true;
    if(this.commonFunction.isRefferal()){
      this.progressInterval = setInterval(() => {
        if(this.isInputFocus){
          this.currentChangeCounter.emit(this.counterChangeVal += 1);
        } else {
          clearInterval(this.progressInterval);
        }
      }, 1000);
    }
  }

  focusOut(){
    this.isInputFocus = false;
  }
  


}
