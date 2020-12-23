import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges } from '@angular/core';
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
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
  hotelListArray = [];
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
    this.hotelListArray = this.hotelDetails;
    if (this.hotelListArray[0] && this.hotelListArray[0].address && this.hotelListArray[0].address.city_name) {
      this.hotelName = `${this.hotelListArray[0].address.city_name},${this.hotelListArray[0].address.country_name}`;
    }
    // this.geoCodes = collect(this.hotelDetails).pluck('geocodes').map((item: any) => {
    //   return {
    //     latitude: parseFloat(item.latitude),
    //     longitude: parseFloat(item.longitude)
    //   }
    // });
    // this.hotelListArray.forEach((i) => {
    //   this.geoCodes.push(i.geocodes);
    // });
    this.userInfo = getLoginUserInfo();
    // this.totalLaycredit();
    this.defaultLat = parseFloat(this.route.snapshot.queryParams['latitude']);
    this.defaultLng = parseFloat(this.route.snapshot.queryParams['longitude']);
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

  ngAfterContentChecked() {
    this.hotelListArray = this.hotelDetails;
    if (this.hotelListArray[0] && this.hotelListArray[0].address && this.hotelListArray[0].address.city_name) {
      this.hotelName = `${this.hotelListArray[0].address.city_name},${this.hotelListArray[0].address.country_name}`;
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


  ngOnChanges(changes: SimpleChanges) {
    this.hotelsList = changes.hotelDetails.currentValue;
  }

  logAnimation(event) {
    // console.log(event);
  }

  redirectToDetail(id) {
    this.router.navigate(['/hotel/detail', id, this.hotelToken]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
