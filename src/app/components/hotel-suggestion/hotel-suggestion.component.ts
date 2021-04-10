import { Component, OnInit, Output,EventEmitter, Input, SimpleChanges } from '@angular/core';
import { HotelService } from 'src/app/services/hotel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hotel-suggestion',
  templateUrl: './hotel-suggestion.component.html',
  styleUrls: ['./hotel-suggestion.component.scss']
})
export class HotelSuggestionComponent implements OnInit {

  @Output() closeHotelDropDown=new EventEmitter();
  @Input() serachItem:string;
  s3BucketUrl = environment.s3BucketUrl;
  loading:boolean=false;
  data=[];
  constructor(
    private hotelService:HotelService
  ) { }

  ngOnInit(): void {

    console.log("this.serachItem1223",this.serachItem)
  }

  closeHotelSuggestion(){
    this.closeHotelDropDown.emit(false);
  }

  ngOnChanges(change:SimpleChanges){
    console.log("this.serachItem",this.serachItem,change)
  }

  searchHotel(searchItem) {
    this.loading = true;
    const searchedData = { term: searchItem };
    this.data = [];
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

}
