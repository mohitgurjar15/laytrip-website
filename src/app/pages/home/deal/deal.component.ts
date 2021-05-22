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
  constructor(
    private homeService : HomeService
  ) {}

  ngOnInit() {
  }
  
  
  ngAfterContentChecked(){
    this.list = this.dealList;
  }

  btnDealClick(item){
  
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    this.toString.emit(item.title ? item :item.code  );  
  }


  thumbsSwiper: any;
  setThumbsSwiper(swiper) {
    this.thumbsSwiper = swiper;
  }
}
