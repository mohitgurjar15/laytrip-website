import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';

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
  Controller,
  Swiper
} from "swiper/core";
import { HomeService } from 'src/app/services/home.service';

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
  @Input() moduleId = 3;
  @HostListener('contextmenu', ['$event'])
  param={value : 30}

  list = [];
  breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 10,slidesPerGroup:1 },
    520: { slidesPerView: 1, spaceBetween: 10 ,slidesPerGroup:2},
    768: { slidesPerView: 2, spaceBetween: 15 ,slidesPerGroup:2},
    992: { slidesPerView: 3, spaceBetween: 20 ,slidesPerGroup:3},
    1024: { slidesPerView: 3, spaceBetween: 30 ,slidesPerGroup:3}
  };

  constructor(
    public commonFunction : CommonFunction,
    public homeService : HomeService
  ) {}

  ngOnInit() {
    this.homeService.getLandingPageData.subscribe(data => {
      try {
        
        this.param.value = data.promotional.min_promotional_day-1
      } catch (e) {
      }
    });
    if(window.innerWidth > 360 && this.dealList.length >3){
      let carousel = new Swiper('.deal_sec_wrapper', {
        navigation: {
          nextEl: '.swiper-button-next-unique',
          prevEl: '.swiper-button-prev-unique'
        }
      });
    }
   
  }
  
  
  ngAfterContentChecked(){    
    this.list = this.dealList;
    // console.log('list',this.list)
  }

  btnDealClick(item){
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    this.toString.emit(item);  
  }


  thumbsSwiper: any;
  setThumbsSwiper(swiper) {
    this.thumbsSwiper = swiper;
  }

  

}
