import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../../../../services/hotel.service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotelPolicyPopupComponent } from '../hotel-policy-popup/hotel-policy-popup.component';
import { CartService } from '../../../../services/cart.service';
import { HomeService } from '../../../../services/home.service';
import { CommonFunction } from '../../../../_helpers/common-function';
import { DiscountedBookingAlertComponent } from 'src/app/components/discounted-booking-alert/discounted-booking-alert.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { translateAmenities } from '../../../../_helpers/generic.helper';
import { CartInventoryNotmatchErrorPopupComponent } from 'src/app/components/cart-inventory-notmatch-error-popup/cart-inventory-notmatch-error-popup.component';
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
    private http: HttpClient
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
        this.hotelDetails = {
          name: res.hotel.name,
          city_name: res.hotel.address.city_name,
          address: res.hotel.full_address,
          state_code: res.hotel.address.state_code,
          country_name: res.hotel.address.country_name,
          rating: res.hotel.rating,
          review_rating: res.hotel.review_rating,
          description: res.hotel.description,
          amenities: res.hotel.amenities,
          hotelLocations: res.hotel.geocodes,
          latitude : parseFloat(res.hotel.geocodes.latitude),
          longitude : parseFloat(res.hotel.geocodes.longitude),
          hotelReviews: res.hotel.reviews,
          thumbnail: res.hotel.thumbnail
        };
        this.translateHotelData();
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

  // Author: xavier | 2021/6/24
  // Description: Toggle description expand/collapse
  toggleDesc() {
    let el = $("#hotel_desc");
    if(el.data("isExpanded")) {
      el.toggleClass('desc_exp desc_col', 450);
      el.data("isExpanded", 0);
    } else {
      el.toggleClass('desc_col desc_exp', 450);
      $(".read_more").animate({opacity: "0"}, 450);
      el.data("isExpanded", 1);
    }
  }

  // Author: xavier | 2021/6/23
  // Description: Break long text into paragraphs.
  //              Takes into account empty text and text without periods.
  formatLongText(data: any) {
    const maxLength = 150;
    const text: string = data == null ? "" : data; // null-coalescing operator not yet supported
    const tokens: string[] = text.split(".");
    let result: string = "";
    let offset: number = 0;
    for(let i: number = 0; i < tokens.length; i++) {
      if((result.length - offset) >= maxLength) {
        result += "<br><br>";
        offset = result.length;
      }
      if(tokens[i].length > 0) result += `${tokens[i]}.`;
    }

    return result;
  }

  // Author: xavier | 2021/7/27
  // Description: Translates hotel's description using Google's translation API.
  translateHotelData() {
    // For debugging purposes only, so we don't keep calling Google's API.
    //this.hotelDetails.description = this.formatLongText(this.hotelDetails.description);
    //return;

    const lang = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    if(lang == "en") {
      this.hotelDetails.description = this.formatLongText(this.hotelDetails.description);
      return;
    }

    let body = new HttpParams();
    body = body.set('q', this.hotelDetails.description)
               .set('source', 'en')
               .set('target', lang)
               .set('format', 'text')
               .set('model', 'nmt')
               .set('key', 'AIzaSyAM2IBT7FXhbv1NFqqVEdYkFDTyqPUhmR8');

    class gApiResp { 
      data: {
        translations: {
          translatedText: string[],
          detectedSourceLanguage: string,
          model: string
        }[];
      }
    }
    
    // Translate Description
    this.http
      .post<gApiResp>('https://translation.googleapis.com/language/translate/v2', body)
      .subscribe(
        res => this.hotelDetails.description = this.formatLongText(res.data.translations[0].translatedText)
      );

    // Translate Ammenities
    for(let i = 0; i < this.hotelDetails.amenities.list.length; i++) {
      this.hotelDetails.amenities.list[i] = translateAmenities(this.hotelDetails.amenities.list[i]);
      // body = body.set('q', this.hotelDetails.amenities.list[i]);
      // this.http
      // .post<gApiResp>('https://translation.googleapis.com/language/translate/v2', body)
      // .subscribe(
      //   res => {
      //     this.hotelDetails.amenities.list[i] = res.data.translations[0].translatedText;
      //   }
      // );
    }
    
  }

  counter(i: any) {
    i = Math.ceil(i);
    return new Array(i);
  }

  selectRoom(roomInfo) {
  
     if (this.cartItems && this.cartItems.length >= 10) {
      this.addCartLoading=false;
      this.isCartFull=true;
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
        this.addCartLoading = false;
        /* if (error.status == 406) {
          this.modalService.open(CartInventoryNotmatchErrorPopupComponent, {
            windowClass: 'cart_inventory_not_match_error_main', centered: true, backdrop: 'static',
            keyboard: false
          });
        } else */
          if (error.status == 409 && this.commonFunction.isRefferal()) {
          this.modalService.open(DiscountedBookingAlertComponent, {
            windowClass: 'block_session_expired_main', centered: true, backdrop: 'static',
            keyboard: false
          });
        }
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
