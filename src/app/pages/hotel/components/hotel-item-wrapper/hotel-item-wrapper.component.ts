import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../services/generic.service';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';
declare const google: any;
import { NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { HotelService } from 'src/app/services/hotel.service';

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
  @Input() filteredLabel;
  @Input() filter;
  @Input() hotelToken;
  @Input() triggerChange;
  animationState = 'out';
  hotelsList;
  s3BucketUrl = environment.s3BucketUrl;
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
  hotelListArray = [];
  mapListArray=[];
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
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonFunction: CommonFunction,
    private genericService: GenericService,
    private hotelService:HotelService
  ) {
      this.galleryOptions = [
        { "thumbnails": false, previewRotate:true,preview:false,width: "270px", height: "100%", imageSwipe:true,imageBullets:false },
      ];
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
    /* this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
    for(let i=0; i < this.hotelListArray.length; i++){
      this.hotelDetails[i].galleryImages=[];
        for(let image of this.hotelDetails[i].images){
          this.hotelDetails[i].galleryImages.push({
            small: image,
            medium:image,
            big:image
          })
        }
    }

    this.mapListArray[0]=Object.assign({},this.hotelListArray[0]); */
    
    this.userInfo = getLoginUserInfo();
    this.defaultLat = parseFloat(this.route.snapshot.queryParams['latitude']);
    this.defaultLng = parseFloat(this.route.snapshot.queryParams['longitude']);

    this.hotelService.getHotels.subscribe(result=>{
      this.hotelDetails = result;
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
      }
    })
  }

  onScrollDown() {

    this.scrollLoading = true;
    setTimeout(() => {
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
    }, 1000);
  }

  ngAfterContentChecked() {
   /*  this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
    let hotelinfo = JSON.parse(atob(this.route.snapshot.queryParams['location']));
    if (hotelinfo) {
      this.hotelName = hotelinfo.city;
    } */
    
  }

  infoWindowAction(template, event, action) {

    if (action === 'open') {
      template.open();
    } else if (action === 'close') {
      template.close();
    } else if (action === 'click') {
      this.mapListArray[0]= this.hotelListArray.find(hotel=>hotel.id==template);
      //this.showMapInfo(template);
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
    if(!this.isMapView){
      this.mapListArray[0]=Object.assign({},this.hotelListArray[0]);
    }
  }

  showDetails(index, flag = null) {
    if (typeof this.showHotelDetails[index] === 'undefined') {
      this.showHotelDetails[index] = true;
    } else {
      this.showHotelDetails[index] = !this.showHotelDetails[index];
    }
    console.log("innnn")

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
    console.log("changes",changes)
    /* if(typeof changes.hotelDetails!='undefined' && changes.hotelDetails.currentValue.length){
      this.hotelListArray = changes.hotelDetails.currentValue.slice(0, this.noOfDataToShowInitially);;
      for(let i=0; i < this.hotelListArray.length; i++){
        this.hotelDetails[i].galleryImages=[];
        if(this.hotelDetails[i].images.length  > 0){
          for(let image of this.hotelDetails[i].images){
            this.hotelDetails[i].galleryImages.push({
              small: image,
              medium:image,
              big:image
            })
          }
        }       
      }

      this.mapListArray[0]=Object.assign({},this.hotelListArray[0]);
    } */
    if(typeof changes.hotelDetails!='undefined' && changes.hotelDetails.currentValue.length){
      this.hotelsList = changes.hotelDetails.currentValue;
    }
  }

  logAnimation(event) {
    // console.log(event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  
}
