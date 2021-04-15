import { Component, OnInit, Output,EventEmitter, Input, SimpleChanges, HostListener } from '@angular/core';
import { HotelService } from 'src/app/services/hotel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hotel-suggestion',
  templateUrl: './hotel-suggestion.component.html',
  styleUrls: ['./hotel-suggestion.component.scss']
})
export class HotelSuggestionComponent implements OnInit {

  @Output() selectedHotel=new EventEmitter();
  @Output() validateSearch=new EventEmitter();
  isValidSearch:boolean=true;
  s3BucketUrl = environment.s3BucketUrl;
  loading:boolean=false;
  data=[];
  @Input() searchItem:string;
  @Input() isFormSubmitted:boolean;
  isShowDropDown:boolean=false;
  thisElementClicked: boolean = false;
  constructor(
    private hotelService:HotelService
  ) { }

  ngOnInit(): void {
  }

  searchLocation(event){
    this.isFormSubmitted = false;
    let notAllowedKey=[40,38,9];
    if(!notAllowedKey.includes(event.keyCode)){
      this.isShowDropDown = this.selectHotelItem.length>0?true:false;
      this.isValidSearch = this.selectHotelItem.length>0?true:false;
      this.data = [];
      this.searchHotel(this.searchItem)
      this.validateSearch.emit(false);
    }
  }

  searchHotel(searchItem) {
    this.loading = true;
    const searchedData = { term: searchItem };
    
    this.hotelService.searchHotels(searchedData).subscribe((response: any) => {
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
          };
        });
      }
    },
      error => {
        this.loading = false;
        this.isShowDropDown=false;
      }
    );

  }

  selectHotelItem(item){
    this.isShowDropDown=false;
    this.searchItem=item.title;
    this.selectedHotel.emit(item)
    this.validateSearch.emit(true);
    this.isValidSearch=true;
  }

  @HostListener('document:click')
  clickOutside() {
    if (!this.thisElementClicked) {
      this.isShowDropDown=false;
    }
    this.thisElementClicked=false;
  }

  @HostListener('click')
  clickInside() {
    this.isShowDropDown=true;
  }
}
