import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../../services/flight.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../services/generic.service';
import * as moment from 'moment';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';
declare const google: any;
import { google } from 'google-maps';

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
export class HotelItemWrapperComponent implements OnInit, OnDestroy {

  @Input() hotelDetails;
  @Input() filter;

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

  subscriptions: Subscription[] = [];
  hotelDetailIdArray = [];
  geoCodes = [];
  mapCanvas;
  myLatLng;

  hideDiv = true;
  showHotelDetails = [];
  showDiv = false;
  routeCode = [];
  baggageDetails;
  cancellationPolicy;
  cancellationPolicyArray = [];
  loadMoreCancellationPolicy: boolean = false;
  errorMessage;
  loadBaggageDetails: boolean = true;
  loadCancellationPolicy: boolean = false;
  isInstalmentAvailable = false;
  userInfo;
  totalLaycreditPoints: number = 0;
  showFareDetails: number = 0;

  subcell = '$100';

  constructor(
    private flightService: FlightService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private commonFunction: CommonFunction,
    private genericService: GenericService,
  ) {
  }

  ngOnInit() {

    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.hotelsList = this.hotelDetails;
    this.userInfo = getLoginUserInfo();
    this.totalLaycredit();
    this.defaultLat = this.route.snapshot.queryParams['latitude'];
    this.defaultLng = this.route.snapshot.queryParams['longitude'];

    this.hotelListArray = this.hotelsList;
    this.hotelListArray.forEach(item => {
      this.hotelDetailIdArray.push(item.route_code);
    });
  }

  counter(i: any) {
    return new Array(i);
  }

  differentView(view) {
    if (view === 'listView') {
      this.isMapView = false;
    } else {
      this.isMapView = true;
      this.mapCanvas = document.getElementById('map');
      this.myLatLng = { lat: parseFloat(this.defaultLat), lng: parseFloat(this.defaultLng) };
      this.initMap();
    }
  }

  initMap() {
    // var mapCanvas = document.getElementById('map');
    // const myLatLng = { lat: parseFloat(this.defaultLat), lng: parseFloat(this.defaultLng) };
    let mapOptions = {
      zoom: 8,
      center: this.myLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: true,
    };
    var map = new google.maps.Map(this.mapCanvas, mapOptions);
    this.hotelListArray.forEach((i) => {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(i.geocodes.latitude), parseFloat(i.geocodes.longitude)),
        map: map,
        title: i.name,
        animation: google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      marker.setMap(map);
      let infowindow = new google.maps.InfoWindow({
        content: i.name
      });
      marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
    });
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

  checkInstalmentAvalability() {
    let instalmentRequest = {
      checkin_date: this.route.snapshot.queryParams['departure_date'],
      booking_date: moment().format("YYYY-MM-DD")
    }
    this.genericService.getInstalemntsAvailability(instalmentRequest).subscribe((res: any) => {
      if (res.instalment_availability) {
        this.isInstalmentAvailable = res.instalment_availability;
      }
    })
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
    console.log(event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
