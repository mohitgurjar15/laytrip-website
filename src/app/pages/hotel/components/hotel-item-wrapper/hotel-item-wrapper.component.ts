import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import {  ActivatedRoute } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../services/generic.service';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';
declare const google: any;
import { NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { HotelService } from 'src/app/services/hotel.service';
import { AgmInfoWindow } from '@agm/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

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
  mapListArray=[];
  noOfDataToShowInitially = 20000;
  dataToLoad = 20;
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
  currentPage:number=1;
  bounds;
  infoWindowOpened = null
  previousInfoWindow : AgmInfoWindow = null;
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
  check_in:string=''
  check_out:string=''
  latitude:string=''
  longitude:string=''
  itenery:string='';
  location:string='';
  city_id:string='';
  @ViewChildren(NgbCarousel) carousel: QueryList<any>;
 
  constructor(
    private route: ActivatedRoute,
    private commonFunction: CommonFunction,
    private genericService: GenericService,
    private hotelService:HotelService
  ) {
    
      this.galleryOptions = [
        { "thumbnails": false, previewRotate:true,preview:false,width: "270px", height: "100%", imageSwipe:true,imageBullets:false,lazyLoading:true },
      ];
      this.check_in = this.route.snapshot.queryParams['check_in']
      this.check_out = this.route.snapshot.queryParams['check_out']
      this.latitude = this.route.snapshot.queryParams['latitude']
      this.longitude = this.route.snapshot.queryParams['longitude']
      this.itenery = this.route.snapshot.queryParams['itenery']
      this.location = this.route.snapshot.queryParams['location']
      this.city_id = this.route.snapshot.queryParams['city_id']
  }

  ngAfterViewInit(): void {
    this.carousel.toArray().forEach(el => {
    });
  }

  onSlide(event,roomNumber){
    
    if(event.direction=='left'){
      if(this.hotelDetails[roomNumber].activeSlide<this.hotelDetails[roomNumber].dots){
        this.hotelDetails[roomNumber].activeSlide+=1;
      }
    }
    else{
      console.log(this.hotelDetails[roomNumber].activeSlide,"---")
      if(this.hotelDetails[roomNumber].activeSlide>1){
        this.hotelDetails[roomNumber].activeSlide-=1;
      }
    }
    console.log("Event",this.hotelDetails[roomNumber].activeSlide)
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
    
    
    this.userInfo = getLoginUserInfo();
    this.defaultLat = parseFloat(this.route.snapshot.queryParams['latitude']);
    this.defaultLng = parseFloat(this.route.snapshot.queryParams['longitude']);

    this.hotelService.getHotels.subscribe(result=>{
      this.hotelDetails = result;
      this.currentPage=1;
      this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
      for(let i=0; i < this.hotelListArray.length; i++){
        this.hotelDetails[i].galleryImages=[];
          for(let image of this.hotelDetails[i].images){
            this.hotelDetails[i].galleryImages.push({
              small: image,
              medium:image,
              big:image
            });
          }
          this.hotelDetails[i].dots = this.hotelDetails[i].galleryImages.length>5 ? 5 :this.hotelDetails[i].galleryImages.length;
          this.hotelDetails[i].activeSlide = 1;
      }
      this.hotelList = [...this.hotelListArray];
      if(this.bounds){
        this.checkMarkersInBounds(this.bounds)
      }

      /* if(this.hotelListArray.length > 0){
        this.mapListArray[0] =  Object.assign({},this.hotelListArray[0]);
      } else {
        this.mapListArray = [];
      } */
    });
  }

  onScrollDown() {

    this.scrollLoading = true;
    console.log('scrolled!!');

    /* setTimeout(() => {
      if (this.noOfDataToShowInitially <= this.hotelListArray.length) {
        this.noOfDataToShowInitially += this.dataToLoad;
        this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
        for(let i=0; i < this.hotelListArray.length; i++){
          this.hotelDetails[i].galleryImages=[];
          for(let image of this.hotelDetails[i].images)
          this.hotelDetails[i].galleryImages.push({
            small: image,
            medium:image,
            big:image
          })
        }
        this.scrollLoading = false;
      } else {
        this.isFullListDisplayed = true;
        this.scrollLoading = false;
      }
    }, 1000); */

    
  }

  closeWindow(){
    if (this.previousInfoWindow != null ) {
      this.previousInfoWindow.close()
      this.previousInfoWindow=null;
    }    
  }
  
  displayHotelDetails(hotelId, infoWindow) {
    
    infoWindow.open();
    if (this.previousInfoWindow == null)
      this.previousInfoWindow = infoWindow;
    else{
      this.infoWindowOpened = infoWindow;
      if (this.previousInfoWindow != null ) {
        this.previousInfoWindow.close();
      }
    }
    this.previousInfoWindow = infoWindow
    
    let hotelIndex= this.hotelListArray.findIndex(hotel=>hotel.id==hotelId);
    this.hotelListArray.unshift(this.hotelListArray.splice(hotelIndex, 1)[0]);
    
  }

  showInfoWindow(infoWindow,event,action) {
    
    if (this.previousInfoWindow == null)
      this.previousInfoWindow = infoWindow;
    else{
      this.infoWindowOpened = infoWindow
      this.previousInfoWindow.close()
    }
    this.previousInfoWindow = infoWindow

    /* if (this.previousInfoWindow) {
      console.log("this.previousInfoWindow",this.previousInfoWindow)
      this.previousInfoWindow.close();
      this.previousInfoWindow = null;
    }
    this.previousInfoWindow = infoWindow; */
    

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
    this.isMapView = (view !== 'listView');
    if(this.isMapView){
      if(this.bounds){
        this.checkMarkersInBounds(this.bounds)
      }
    }
    else{
      this.hotelListArray=[...this.hotelList];
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

  pageChanged(page){
    this.currentPage=page;
    window.scroll(0, 0);
  }
  
  getMapPrice(hotel){
    return `$${Math.floor(hotel.secondary_start_price)}`
  }

  checkMarkersInBounds(bounds){
    this.bounds=bounds;
    if(this.isMapView){
      this.hotelListArray = [];
      for(let hotel of this.hotelList){
        let hotelPosition = {lat: parseFloat(hotel.geocodes.latitude), lng: parseFloat(hotel.geocodes.longitude)};
        if (this.bounds.contains(hotelPosition)){
          this.hotelListArray.push(hotel)
          //this.hotelDetails=[...this.hotelListArray]
        }
      }
    }
    
  }

}
