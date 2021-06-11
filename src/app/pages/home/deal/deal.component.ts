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
  @HostListener('contextmenu', ['$event'])

  list = [];
  list2 = [];
  breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 10,slidesPerGroup:1 },
    520: { slidesPerView: 2, spaceBetween: 10 ,slidesPerGroup:2},
    640: { slidesPerView: 2, spaceBetween: 20 ,slidesPerGroup:2},
    768: { slidesPerView: 2, spaceBetween: 40 ,slidesPerGroup:2},
    1024: { slidesPerView: 2, spaceBetween: 30 ,slidesPerGroup:2}
  };

  constructor(
    public commonFunction : CommonFunction
  ) {}

  ngOnInit() {
  }
  
  
  ngAfterContentChecked(){    
    this.list = this.dealList;
  }

  btnDealClick(item){
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    this.toString.emit(item.title ? item : item.code  );  
  }


  thumbsSwiper: any;
  setThumbsSwiper(swiper) {
    this.thumbsSwiper = swiper;
  }


}
