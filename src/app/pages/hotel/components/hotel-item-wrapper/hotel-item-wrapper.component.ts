import { Component, OnInit, Input, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../services/generic.service';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';
declare const google: any;
import { NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { HotelService } from 'src/app/services/hotel.service';
import { AgmInfoWindow } from '@agm/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-hotel-item-wrapper',
  templateUrl: './hotel-item-wrapper.component.html',
  styleUrls: ['./hotel-item-wrapper.component.scss'],

})
export class HotelItemWrapperComponent implements OnInit {

  hotelDetails;
  @Input() filteredLabel;
  @Input() filter;
  @Input() hotelToken;
  s3BucketUrl = environment.s3BucketUrl;
  hotelListArray = [];
  hotelList = [];
  mapListArray = [];
  noOfDataToShowInitially = 25;
  dataToLoad = 25;
  isFullListDisplayed = false;
  currency;
  isMapView = false;
  hotelLatLng;
  defaultLat;
  defaultLng;
  hotelName;
  geoCodes;
  mapCanvas;
  myLatLng;
  map;
  currentPage: number = 1;
  bounds;
  infoWindowOpened = null
  previousInfoWindow: AgmInfoWindow = null;
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
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  check_in: string = ''
  check_out: string = ''
  latitude: string = ''
  longitude: string = ''
  itenery: string = '';
  location: string = '';
  city_id: string = '';
  city_name: string = '';
  hotelCount: number = 0;
  previousHotelIndex: number = -1;
  @ViewChildren(NgbCarousel) carousel: QueryList<any>;
  isMarkerClicked = false;
  clickedHotelIndex;

  constructor(
    private route: ActivatedRoute,
    private commonFunction: CommonFunction,
    private genericService: GenericService,
    private hotelService: HotelService,
    public cd: ChangeDetectorRef,
    private homeService:HomeService
  ) {

    this.galleryOptions = [
      { "thumbnails": false, previewRotate: true, preview: false, width: "270px", height: "100%", imageSwipe: true, imageBullets: false, lazyLoading: true },
    ];
    this.check_in = this.route.snapshot.queryParams['check_in']
    this.check_out = this.route.snapshot.queryParams['check_out']
    this.latitude = this.route.snapshot.queryParams['x_coordinate']
    this.longitude = this.route.snapshot.queryParams['y_coordinate']
    this.itenery = this.route.snapshot.queryParams['itenery']
    this.location = this.route.snapshot.queryParams['location']
    this.city_id = this.route.snapshot.queryParams['city_id']
    this.city_name = this.route.snapshot.queryParams['city_name']
  }

  

  ngAfterViewInit(): void {
    // this.gm.nativeElement;
    this.carousel.toArray().forEach(el => {
    });
  }

  onSlide(event, roomNumber) {

    let sliderNumber = ".ngb-slide-" + event.current + '-' + roomNumber;
    $(sliderNumber).attr('src', $(sliderNumber).attr('data'))
    $(sliderNumber).removeAttr('data')
    if (event.direction == 'left') {
      if (this.hotelDetails[roomNumber].activeSlide < this.hotelDetails[roomNumber].dots) {
        this.hotelDetails[roomNumber].activeSlide += 1;
      }
    }
    else {
      if (this.hotelDetails[roomNumber].activeSlide > 1) {
        this.hotelDetails[roomNumber].activeSlide -= 1;
      }
    }
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
    let hotelinfo = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['location'])));
    if (hotelinfo) {
      this.hotelName = hotelinfo.city;
    }


    this.userInfo = getLoginUserInfo();
    this.defaultLat = parseFloat(this.route.snapshot.queryParams['x_coordinate']);
    this.defaultLng = parseFloat(this.route.snapshot.queryParams['y_coordinate']);

    this.hotelService.getHotels.subscribe(result => {
      this.hotelDetails = result;
      for (let i = 0; i < this.hotelDetails.length; i++) {
        this.hotelDetails[i].galleryImages = [];
        for (let image of this.hotelDetails[i].images) {
          if (this.hotelDetails[i].images) {
            this.hotelDetails[i].galleryImages.push({
              small: image,
              medium: image,
              big: image
            });
          }
        }
        this.hotelDetails[i].dots = this.hotelDetails[i].galleryImages.length > 5 ? 5 : this.hotelDetails[i].galleryImages.length;
        this.hotelDetails[i].activeSlide = 1;
      }
      this.hotelCount = this.hotelDetails.length;
      this.currentPage = 1;
      this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
      this.hotelList = [...this.hotelListArray];
      if (this.bounds) {
        this.checkMarkersInBounds(this.bounds)
      }
    });
  }

  changeSlide(slideId) {
    // console.log(slideId);
  }

  checkOnError(brokenImage) {
    for (let i = 0; i < this.hotelDetails.length; i++) {
      this.hotelDetails[i].galleryImages = [];
      for (let image of this.hotelDetails[i].images) {
        if (this.hotelDetails[i].images) {
          if (image !== brokenImage.small) {
            this.hotelDetails[i].galleryImages.push({
              small: image,
              medium: image,
              big: image
            });
            this.hotelDetails[i].galleryImages = this.hotelDetails[i].galleryImages;
          }
        }
      }
      this.hotelDetails[i].dots = this.hotelDetails[i].galleryImages.length > 5 ? 5 : this.hotelDetails[i].galleryImages.length;
      this.hotelDetails[i].activeSlide = 1;
    }
  }

  onScrollDown() {
    if (this.isMapView) {
      return false;
    }

    this.scrollLoading = (this.hotelDetails.length != this.hotelListArray.length) ? true : false;
    setTimeout(() => {
      if (this.noOfDataToShowInitially <= this.hotelDetails.length) {
        this.noOfDataToShowInitially += this.dataToLoad;
        this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
        this.hotelList = [...this.hotelListArray];
        this.hotelCount = this.hotelListArray.length;
        this.scrollLoading = false;
      } else {
        this.isFullListDisplayed = true;
        this.scrollLoading = false;
      }
    }, 1000);
  }

  closeWindow() {
    if (this.previousInfoWindow != null) {
      this.previousInfoWindow.close()
      this.previousInfoWindow = null;
    }
  }

  openInfoWindow(infoWindow) {
    infoWindow._openInfoWindow();
  }

  closeInfoWindow(infoWindow) {
    infoWindow._closeInfoWindow();
  }

  displayHotelDetails(hotelId, infoWindow, type) {
    this.isMarkerClicked = false;
    this.clickedHotelIndex = '';
    if (type === 'click') {
      this.isMarkerClicked = true;
      if (this.previousHotelIndex > -1) {
        let previousHotel = this.hotelListArray[0];
        this.hotelListArray = this.move(this.hotelListArray, 0, this.previousHotelIndex)
      }

      let hotelIndex = this.hotelListArray.findIndex(hotel => hotel.id == hotelId);
      if (hotelIndex >= 0) {
        this.hotelListArray.unshift(this.hotelListArray.splice(hotelIndex, 1)[0]);
        this.previousHotelIndex = hotelIndex;
        this.clickedHotelIndex = hotelIndex;
      }
    }

  }

  move(input, from, to) {
    let numberOfDeletedElm = 1;

    const elm = input.splice(from, numberOfDeletedElm)[0];

    numberOfDeletedElm = 0;

    input.splice(to, numberOfDeletedElm, elm);

    return input;
  }

  showInfoWindow(infoWindow, event, action) {

    if (this.previousInfoWindow == null)
      this.previousInfoWindow = infoWindow;
    else {
      this.infoWindowOpened = infoWindow
      this.previousInfoWindow.close()
    }
    this.previousInfoWindow = infoWindow

    if (action === 'open') {
      infoWindow.open();
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
    this.isMarkerClicked = false;
    this.clickedHotelIndex = '';
    this.isMapView = (view !== 'listView');
    if (this.isMapView) {
      if (this.bounds) {
        this.checkMarkersInBounds(this.bounds)
      }
    }
    else {
      this.hotelListArray = [...this.hotelList];
      this.hotelCount = this.hotelDetails.length;
    }
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

  pageChanged(page) {
    this.currentPage = page;
    window.scroll(0, 0);
    this.isMarkerClicked = false;
    this.clickedHotelIndex = '';
  }

  getMapPrice(hotel) {
    if (hotel.offer_data.applicable) {
      return `$${Math.floor(hotel.discounted_secondary_start_price)}`
    } else {
      return hotel.is_installment_available ? `$${Math.floor(hotel.secondary_start_price)}` : `$${Math.floor(hotel.selling.total)}`;
    }
  }

  checkMarkersInBounds(bounds) {
    if (this.isMarkerClicked && this.clickedHotelIndex) {
      let hotelIndex = this.hotelListArray.findIndex(hotel => hotel.id == this.clickedHotelIndex);
      if (hotelIndex >= 0) {
        this.hotelListArray.unshift(this.hotelListArray.splice(hotelIndex, 1)[0]);
        this.previousHotelIndex = hotelIndex;
        this.clickedHotelIndex = hotelIndex;
      }
    } else {
      this.isMarkerClicked = false;
      this.clickedHotelIndex = '';
      this.bounds = bounds;
      if (this.isMapView) {
        this.hotelListArray = [];
        for (let hotel of this.hotelList) {
          let hotelPosition = { lat: parseFloat(hotel.geocodes.latitude), lng: parseFloat(hotel.geocodes.longitude) };
          if (this.bounds.contains(hotelPosition)) {
            this.hotelListArray.push(hotel)
          }
        }

        this.hotelCount = this.hotelListArray.length;
      }
    }
  }
  
  showDownPayment(offerData, downPaymentOption) {

    if (typeof offerData != 'undefined' && offerData.applicable) {

      if (typeof offerData.down_payment_options != 'undefined' && offerData.down_payment_options[downPaymentOption].applicable) {
        return true;
      }
      return false;
    }
    return true;
  }
}
