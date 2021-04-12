import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { HotelService } from '../../../../services/hotel.service';
import { environment } from '../../../../../environments/environment';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { collect } from 'collect.js';
import { CommonFunction } from '../../../../_helpers/common-function';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotelPolicyPopupComponent } from '../hotel-policy-popup/hotel-policy-popup.component';
import { CartService } from '../../../../services/cart.service';
import { EventEmitter } from 'events';
declare var $: any;


@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss'],
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
export class HotelDetailComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  hotelId;
  hotelToken;
  hotelDetails;
  hotelRoomArray = [];
  imageTemp = [];
  loading = false;
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

  galleryOptions: NgxGalleryOptions[];
  galleryOptionsMain: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
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
    this.galleryOptions = [
      {
        width: '270px',
        height: '100%',
        thumbnails: false,
        imageAnimation: NgxGalleryAnimation.Slide,
        spinnerIcon: 'fa fa-spinner fa-pulse fa-3x fa-fw',
        imageSwipe:true,
        previewRotate:true,
        preview:false,
      }
    ];

    this.galleryOptionsMain = [
      {
        width: '100%',
        height: '400px',
        thumbnails: false,
        imageAnimation: NgxGalleryAnimation.Slide,
        spinnerIcon: 'fa fa-spinner fa-pulse fa-3x fa-fw',
        imageSwipe:true,
        previewRotate:true,
        preview:false,
      }
    ];

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
      if (res && res.data && res.data.hotel) {
        this.loading = false;
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
    }, error => {
      //this.toastr.error('Search session is expired', 'Error');
      this.isNotFound=true;
      //this.router.navigate(['/']);
    });
    this.hotelService.getRoomDetails(`${this.hotelId}`, this.hotelToken).subscribe((res: any) => {
      if (res) {
        this.hotelRoomArray = res.data;
        this.roomSummary.hotelInfo = res.data[0];
      }
    }, error => {
      this.loading = false;
      //this.toastr.error('Search session is expired', 'Error');
      //this.router.navigate(['/']);
    });
  }

  counter(i: any) {
    i = Math.ceil(i);
    return new Array(i);
  }

  showRoomDetails(roomInfo) {
    
    if (this.cartItems && this.cartItems.length >= 5) {
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

  toggleAmenities(){
    this.showMoreAmenties=!this.showMoreAmenties;
  }
}
