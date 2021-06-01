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
    320: { slidesPerView: 1, spaceBetween: 10 ,slidesPerGroup: 10},
    520: { slidesPerView: 2, spaceBetween: 10,slidesPerGroup: 2 },
    768: { slidesPerView: 3, spaceBetween: 40,slidesPerGroup: 4 },
    1024: { slidesPerView: 3, spaceBetween: 40 ,slidesPerGroup: 4}
  };
  slidesPerGroup=3;
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
  breakPointsToggle: boolean;
  breakpointChange() {
    this.breakPointsToggle = !this.breakPointsToggle;
    this.breakpoints = {
      320: { slidesPerView: 1, spaceBetween: 10,slidesPerGroup: 9 },
      520: { slidesPerView: 2, spaceBetween: 10,slidesPerGroup: 5 },
      768: {slidesPerView: 3, spaceBetween: 40, slidesPerGroup: 3 },
      1024: { slidesPerView: this.breakPointsToggle ? 3 : 5, spaceBetween: 40,slidesPerGroup: 3 }
    };
  } 

}
