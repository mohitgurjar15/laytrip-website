import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { environment } from '../../../../environments/environment';
import { timeStamp } from 'console';
import { airports } from '../../flight/airports';
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required components
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
} from "swiper/core";

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);
@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss']
})
export class DealComponent implements OnInit {
  SwiperComponent;
  s3BucketUrl = environment.s3BucketUrl;
  @Output() toString = new EventEmitter<string>();
  @Input()  dealList = [];
  list = [];
  breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 10 },
    520: { slidesPerView: 2, spaceBetween: 10 },
    768: { slidesPerView: 3, spaceBetween: 40 },
    1024: { slidesPerView: 3, spaceBetween: 40 }
  };
  constructor(
    private homeService : HomeService
  ) {}

  ngOnInit() {
  }
  
  
  ngAfterContentChecked(){
    //this.list = JSON.parse('[{"title":"Miami Beach, Florida, United States","city":"Miami Beach","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909@2x-2974.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Miami Beach, Florida, United States","city":"Miami Beach","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909@2x-2974.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Miami Beach, Florida, United States","city":"Miami Beach","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909@2x-2974.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"}]');//this.dealList;
    // console.log(this.dealList)
    this.list = this.dealList
    console.log(this.list.length)
  }

  btnDealClick(item){
  
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    this.toString.emit(item.title ? item :item.code  );  
  }


  thumbsSwiper: any;
  setThumbsSwiper(swiper) {
    this.thumbsSwiper = swiper;
  }
  breakPointsToggle: boolean;
  breakpointChange() {
    this.breakPointsToggle = !this.breakPointsToggle;
    this.breakpoints = {
      320: { slidesPerView: 1, spaceBetween: 10 },
      520: { slidesPerView: 2, spaceBetween: 10 },
      768: { slidesPerView: 3, spaceBetween: 40 },
      1024: { slidesPerView: this.breakPointsToggle ? 7 : 5, spaceBetween: 40 }
    };
  } 
}
