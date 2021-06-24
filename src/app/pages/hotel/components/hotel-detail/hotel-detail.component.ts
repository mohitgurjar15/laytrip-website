import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../../../../services/hotel.service';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotelPolicyPopupComponent } from '../hotel-policy-popup/hotel-policy-popup.component';
import { CartService } from '../../../../services/cart.service';
import { HomeService } from '../../../../services/home.service';
import { CommonFunction } from '../../../../_helpers/common-function';
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
    public homeService: HomeService,
    private router: Router,
    private modalService: NgbModal,
    private cartService:CartService,
    private commonFunction:CommonFunction,
  ) { }

  ngOnInit() {
    
    $('body').addClass('cms-bgColor');
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);

    this.route.params.subscribe(params => {
      if (params) {
        this.hotelId = params.id;
        this.hotelToken = params.token;
      }
    });
    this.cartService.getCartItems.subscribe(cartItems => {
      this.cartItems = cartItems;
    })

   /*  this.hotelService.getHotelDetail(`${this.hotelId}`, this.hotelToken).subscribe((res: any) => {
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
    }); */
    this.loading = true;
    this.hotelService.getRoomDetails(`${this.hotelId}`, this.hotelToken).subscribe((res: any) => {
      this.loading = false;
      if (res) {
        this.hotelRoomArray = res.data;
        for(let i=0; i < this.hotelRoomArray.length; i++){
          this.hotelRoomArray[i].galleryImages=[];
            for(let image of this.hotelRoomArray[i].photos){
              this.hotelRoomArray[i].galleryImages.push({
                small: image,
                medium:image,
                big:image
              });
            }
            this.hotelRoomArray[i].dots = this.hotelRoomArray[i].galleryImages.length>5 ? 5 :this.hotelRoomArray[i].galleryImages.length;
            this.hotelRoomArray[i].activeSlide = 1;
        }
        //this.roomSummary.hotelInfo = res.data[0];
        
        this.hotelDetails = {
          name: res.hotel.name,
          city_name: res.hotel.address.city_name,
          address: res.hotel.full_address,
          state_code: res.hotel.address.state_code,
          country_name: res.hotel.address.country_name,
          rating: res.hotel.rating,
          review_rating: res.hotel.review_rating,
          description: this.formatLongText(res.hotel.description),
          amenities: res.hotel.amenities,
          hotelLocations: res.hotel.geocodes,
          latitude : parseFloat(res.hotel.geocodes.latitude),
          longitude : parseFloat(res.hotel.geocodes.longitude),
          hotelReviews: res.hotel.reviews,
          thumbnail: res.hotel.thumbnail
        };
        if (res.hotel.images.length) {

          res.hotel.images.forEach(imageUrl => {
            this.imageTemp.push({
              small: `${imageUrl}`,
              medium: `${imageUrl}`,
              big: `${imageUrl}`,
              description: `${this.hotelDetails.name}`
            });
            this.galleryImages = this.imageTemp;
          });

        }
        
      }
    }, error => {
      this.loading = false;
      this.isNotFound=true;  
    });
  }

  // Author: xavier | 2021/6/23 @ 2:30pm
  // Description: Break long text into paragraphs.
  //              Takes into account empty text and text without periods.
  formatLongText(data: any) {
    const maxLength = 150;
    const text: string = data == null ? "" : data; // null-coalescing operator not yet supported :(
    const tokens: string[] = text.split(".");
    let result: string = "";
    let offset: number = 0;

    for(let i: number = 0; i < tokens.length; i++) {
      if((result.length - offset) >= maxLength) {
        result += "<br><br>";
        offset = result.length;
      }
      if(tokens[i].length > 0) result += tokens[i] + ".";
    }

    return result;
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
          
          if(this.commonFunction.isRefferal()){
            var parms = this.commonFunction.getRefferalParms();
            var queryParams: any = {};
            queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
            if(parms.utm_medium){
              queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
            }
            if(parms.utm_campaign){
              queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
            }
            this.router.navigate(['cart/checkout'],{ queryParams :queryParams});
          } else {
            this.router.navigate(['cart/checkout']);
          }
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
  
  onRoomSlide(event,roomNumber){
    
    if(event.direction=='left'){
      if(this.hotelRoomArray[roomNumber].activeSlide<this.hotelRoomArray[roomNumber].dots){
        this.hotelRoomArray[roomNumber].activeSlide+=1;
      }
    }
    else{
      if(this.hotelRoomArray[roomNumber].activeSlide>1){
        this.hotelRoomArray[roomNumber].activeSlide-=1;
      }
    }
  }

  moduleTabClick(tabName) {
    if (tabName == 'flight') {
      this.homeService.setActiveTab(tabName)
      if(this.commonFunction.isRefferal()){
        var parms = this.commonFunction.getRefferalParms();
        var queryParams: any = {};
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if(parms.utm_medium){
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if(parms.utm_campaign){
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate(['/'],{ queryParams : queryParams});
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}
