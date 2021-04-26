import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { HotelService } from '../../../../services/hotel.service';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { collect } from 'collect.js';
import { CommonFunction } from '../../../../_helpers/common-function';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotelPolicyPopupComponent } from '../hotel-policy-popup/hotel-policy-popup.component';
import { CartService } from '../../../../services/cart.service';
declare var $: any;


@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  hotelId;
  hotelToken;
  hotelDetails;
  hotelRoomArray = [];
  imageTemp=[];
  loading:boolean = false;
  roomLoading:boolean=false;
  currency;
  showFareDetails: number = 0;
  showMoreAmenties:boolean=false;
  roomSummary: any = {
    hotelInfo: {},
    roomDetail: {
      totalRoom: null,
      totalAdults: null,
      totalChildren: null,
      checkIn: '',
      checkOut: ''
    }
  };
  dataLoading = false;
  @ViewChild('maincarousel',null) maincarousel: NgbCarousel;
  @ViewChildren(NgbCarousel) carousel: QueryList<any>;
  galleryOptions: NgxGalleryOptions[];
  galleryOptionsMain: NgxGalleryOptions[];
  galleryImages;
  activeSlide=1;
  dots=5;
  cartItems = [];
  addCartLoading:boolean=false;
  isNotFound:boolean=false;
  isCartFull:boolean=false;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private toastr: ToastrService,
    private router: Router,
    private commonFunction: CommonFunction,
    private modalService: NgbModal,
    private cartService:CartService
  ) { }

  ngOnInit() {
    this.loading = true;
    $('body').addClass('cms-bgColor');
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    let occupancies;

    this.route.params.subscribe(params => {
      if (params) {
        this.hotelId = params.id;
        this.hotelToken = params.token;
      }
    });
    this.cartService.getCartItems.subscribe(cartItems => {
      this.cartItems = cartItems;
    })

    this.hotelService.getHotelDetail(`${this.hotelId}`, this.hotelToken).subscribe((res: any) => {
      this.loading = false;
      if (res && res.data && res.data.hotel) {
        this.hotelDetails = {
          name: res.data.hotel.name,
          city_name: res.data.hotel.address.city_name,
          address: res.data.hotel.full_address,
          state_code: res.data.hotel.address.state_code,
          country_name: res.data.hotel.address.country_name,
          rating: res.data.hotel.rating,
          review_rating: res.data.hotel.review_rating,
          description: res.data.hotel.description,
          amenities: res.data.hotel.amenities,
          hotelLocations: res.data.hotel.geocodes,
          hotelReviews: res.data.hotel.reviews,
          thumbnail: res.data.hotel.thumbnail
        };
        if (res.data.hotel.images) {

          res.data.hotel.images.forEach(imageUrl => {
            this.imageTemp.push({
              small: `${imageUrl}`,
              medium: `${imageUrl}`,
              big: `${imageUrl}`,
              description: `${this.hotelDetails.name}`
            });
            this.galleryImages = this.imageTemp;
          });

        }
        occupancies = collect(res.data.details.occupancies);
        this.roomSummary.roomDetail.checkIn = res.data.details.check_in;
        this.roomSummary.roomDetail.checkOut = res.data.details.check_out;
        if (res.data.details && res.data.details.occupancies && res.data.details.occupancies.length) {
          this.roomSummary.roomDetail.totalRoom = occupancies.count();
          this.roomSummary.roomDetail.totalAdults = occupancies.sum('adults');
          this.roomSummary.roomDetail.totalChildren = occupancies.flatMap((value) => value['children']).count();
        }
      }
      else{
        this.isNotFound=true;  
      }
    }, error => {
      this.isNotFound=true;
      this.loading = false;
    });
    this.roomLoading=true;
    this.hotelService.getRoomDetails(`${this.hotelId}`, this.hotelToken).subscribe((res: any) => {
      this.roomLoading=false;
      if (res) {
        this.hotelRoomArray = res.data;
        this.roomSummary.hotelInfo = res.data[0];
      }
    }, error => {
      this.roomLoading=false;
      //this.toastr.error('Search session is expired', 'Error');
      //this.router.navigate(['/']);
    });
  }

  counter(i: any) {
    i = Math.ceil(i);
    return new Array(i);
  }

  selectRoom(roomInfo) {
    
     if (this.cartItems && this.cartItems.length >= 10) {
      this.addCartLoading=false;
      this.isCartFull=true;
      //this.maxCartValidation.emit(true)
    } else {
      this.addCartLoading=true;
      
      let payload = {
        module_id: 3,
        route_code: roomInfo.bundle
      };
      this.cartService.addCartItem(payload).subscribe((res: any) => {
        this.addCartLoading=false;
        if (res) {
          let newItem = { id: res.data.id, module_Info: res.data.moduleInfo[0] }
          this.cartItems = [...this.cartItems, newItem]
          this.cartService.setCartItems(this.cartItems);

          localStorage.setItem('$crt', JSON.stringify(this.cartItems.length));
          this.router.navigate([`cart/booking`]);
        }
      }, error => {
        this.addCartLoading=false;
      });

    }
  }

  openPolicyPopup(policyInfo, type) {
    const payload = {
      policyInfo,
      type,
      title: '',
    }
    if (type === 'cancellation_policies') {
      payload.title = 'Room Cancellation Policy';
    } else if (type === 'policies') {
      payload.title = 'Room Policy';
    }
    const modalRef = this.modalService.open(HotelPolicyPopupComponent, {
      windowClass: 'custom-z-index',
      centered: true,
      size: 'lg',
    });
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    (<HotelPolicyPopupComponent>modalRef.componentInstance).data = payload;
  }

  logAnimation(event) {
    // console.log(event);
  }

  removeCartFullError(){
    this.isCartFull=false;
  }

  toggleAmenities(target:HTMLElement,type){

    this.showMoreAmenties=!this.showMoreAmenties;
    if(type=='less'){
      target.scrollIntoView({behavior: 'smooth', block: "start",inline: 'nearest'});
    }
    //document.getElementsByClassName('#target').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  ngAfterViewInit(): void {
    this.carousel.toArray().forEach(el => {
    });
  }

  onMainSlide(event){
    
    if(event.direction=='left'){
      if(this.activeSlide<this.dots){
        this.activeSlide+=1;
      }
    }
    else{
      if(this.activeSlide>1){
        this.activeSlide-=1;
      }
    }
  }
}
