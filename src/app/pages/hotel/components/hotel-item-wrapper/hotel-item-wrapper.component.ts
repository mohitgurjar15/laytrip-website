import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../services/generic.service';
import * as moment from 'moment';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';
declare const google: any;
import { google } from 'google-maps';
import { collect } from 'collect.js';

@Component({
  selector: 'app-hotel-item-wrapper',
  templateUrl: './hotel-item-wrapper.component.html',
  styleUrls: ['./hotel-item-wrapper.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(10, [
            animate('0.001s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(50, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ],
})
export class HotelItemWrapperComponent implements OnInit, OnDestroy, AfterContentChecked {

  @Input() hotelDetails;
  @Input() filter;
  @Input() hotelToken;
  animationState = 'out';
  hotelsList;
  s3BucketUrl = environment.s3BucketUrl;
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
  hotelListArray = [];
  noOfDataToShowInitially = 20;
  dataToLoad = 20;
  isFullListDisplayed = false;
  currency;
  isMapView = false;
  hotelLatLng;
  defaultLat;
  defaultLng;
  hotelName;

  subscriptions: Subscription[] = [];
  geoCodes;
  mapCanvas;
  myLatLng;
  map;

  showHotelDetails = [];
  errorMessage;
  userInfo;
  totalLaycreditPoints: number = 0;
  showFareDetails: number = 0;
  hotelInfo;
  amenitiesObject = {
    breakfast: `${this.s3BucketUrl}assets/images/hotels/breakfast.svg`,
    wifi: `${this.s3BucketUrl}assets/images/hotels/wifi.svg`,
    no_smoking: `${this.s3BucketUrl}assets/images/hotels/no_smoking.svg`,
    tv: `${this.s3BucketUrl}assets/images/hotels/tv.svg`,
    ac: `${this.s3BucketUrl}assets/images/hotels/ac.svg`,
  }
  showMapDetails = [];
  scrollDistance = 2;
  throttle = 50;
  scrollLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private commonFunction: CommonFunction,
    private genericService: GenericService,
  ) {

  }

  ngOnInit() {
    window.scroll(0, 0);
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    const info = JSON.parse(localStorage.getItem('_hote'));
    if (info) {
      info.forEach(element => {
        if (element.key === 'guest') {
          this.hotelInfo = element.value;
        }
      });
    }
    let hotelinfo = JSON.parse(atob(this.route.snapshot.queryParams['location']));
    if (hotelinfo) {
      this.hotelName = hotelinfo.city;
    }
    // this.hotelListArray = this.hotelDetails;
    this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
    if (this.hotelListArray[0] && this.hotelListArray[0].address && this.hotelListArray[0].address.city_name) {
      // this.hotelName = `${this.hotelListArray[0].address.city_name},${this.hotelListArray[0].address.country_name}`;
    }
    this.userInfo = getLoginUserInfo();
    // this.totalLaycredit();
    this.defaultLat = parseFloat(this.route.snapshot.queryParams['latitude']);
    this.defaultLng = parseFloat(this.route.snapshot.queryParams['longitude']);
  }

  onScrollDown() {
    this.scrollLoading = true;
    setTimeout(() => {
      if (this.noOfDataToShowInitially <= this.hotelListArray.length) {
        this.noOfDataToShowInitially += this.dataToLoad;
        this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
        this.scrollLoading = false;
      } else {
        this.isFullListDisplayed = true;
        this.scrollLoading = false;
      }
    }, 1000);
  }

  ngAfterContentChecked() {
    // this.hotelListArray = this.hotelDetails;
    this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
    let hotelinfo = JSON.parse(atob(this.route.snapshot.queryParams['location']));
    if (hotelinfo) {
      this.hotelName = hotelinfo.city;
    }
    // if (this.hotelListArray[0] && this.hotelListArray[0].address && this.hotelListArray[0].address.city_name) {
    //   this.hotelName = `${this.hotelListArray[0].address.city_name},${this.hotelListArray[0].address.country_name}`;
    // }
  }

  infoWindowAction(template, event, action) {


    if (action === 'open') {
      template.open();
    } else if (action === 'close') {
      template.close();
    } else if (action === 'click') {
      this.showMapInfo(template);
    }
  }

  showMapInfo(index) {
    if (typeof this.showMapDetails[index] === 'undefined') {
      this.showMapDetails[index] = true;
      document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    else {
      this.showMapDetails[index] = !this.showMapDetails[index];
      document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  counter(i: any) {
    return new Array(i);
  }

  differentView(view) {
    this.isMapView = (view !== 'listView');
  }

  showDetails(index, flag = null) {
    if (typeof this.showHotelDetails[index] === 'undefined') {
      this.showHotelDetails[index] = true;
    } else {
      this.showHotelDetails[index] = !this.showHotelDetails[index];
    }

    if (flag == 'true') {
      this.showFareDetails = 1;
    }
    else {

      this.showFareDetails = 0;
    }

    this.showHotelDetails = this.showHotelDetails.map((item, i) => {
      return ((index === i) && this.showHotelDetails[index] === true) ? true : false;
    });
  }

  closeHotelDetail() {
    this.showFareDetails = 0;
    this.showHotelDetails = this.showHotelDetails.map(item => {
      return false;
    });
  }

  totalLaycredit() {
    this.genericService.getAvailableLaycredit().subscribe((res: any) => {
      this.totalLaycreditPoints = res.total_available_points;
    }, (error => {
    }));
  }
  loadJquery() {
  //   $('#carousel-example-generic').on('slid.bs.carousel', function () {
  //     $('#slidenum').val($('.carousel-inner .active').index());
  //  })
   
  //  $('#slidenum').on('change',function(){
  //    var sn = parseInt($('#slidenum').val());
  //    $('#carousel-example-generic').carousel(sn);
  //  })
  $(document).ready(function(){
  
    // SLIDER
    //$('.slider').slick({});
      
    $('.slider').slick({
      dots: true,
      speed: 1000,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 3000,
      nextArrow: '<div class="slick-custom-arrow slick-custom-arrow-right"><i class="fas fa-angle-right"></i></div>',
      prevArrow: '<div class="slick-custom-arrow slick-custom-arrow-left"><i class="fa fa-angle-left"></i></div>',
    });
  
  });
  }


  ngOnChanges(changes: SimpleChanges) {
    this.hotelsList = changes.hotelDetails.currentValue;
  }

  logAnimation(event) {
    // console.log(event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
