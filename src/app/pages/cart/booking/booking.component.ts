import { Component, OnInit } from '@angular/core';
declare var $: any;
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { FlightService } from '../../../services/flight.service';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { TravelerService } from '../../../services/traveler.service';
import { CheckOutService } from '../../../services/checkout.service';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';

export interface CartItem {

  type: string;
  module_info: {},
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  progressStep = { step1: true, step2: false, step3: false, step4: false };
  userInfo;
  isShowPaymentOption: boolean = true;
  laycreditpoints: number = 0;
  sellingPrice: number;
  flightSummary = [];
  instalmentMode = 'instalment';
  instalmentType: string = 'weekly'
  isLoggedIn: boolean = false;
  showPartialPayemntOption: boolean = true;
  redeemableLayPoints: number;
  priceData = [];
  totalLaycreditPoints: number = 0;
  isLayCreditLoading: boolean = false;
  priceSummary;
  carts = [];
  isValidData: boolean = false;
  isValidTravelers:boolean=false;
  cartLoading = false;
  loading: boolean = false;
  isCartEmpty: boolean = false;
  cartPrices = [];
  travelerForm: FormGroup;
  cardToken: string = '';
  validationErrorMessage:string='';
  cardListChangeCount:number=0;


  constructor(
    private router: Router,
    private flightService: FlightService,
    private genericService: GenericService,
    private travelerService: TravelerService,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private toster: ToastrService,
    private cookieService: CookieService
  ) {
    //this.totalLaycredit();
    this.getCountry();
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.userInfo = getLoginUserInfo();
    if (Object.keys(this.userInfo).length > 0) {
      this.getTravelers();
    }

    this.cartLoading = true;
    this.cartService.getCartList('yes').subscribe((items: any) => {
      this.cartLoading = false;
      let notAvilableItems = [];
      let cart: any;
      let price: any;
      for (let i = 0; i < items.data.length; i++) {
        cart = {};
        cart.type = items.data[i].type;
        cart.module_info = items.data[i].moduleInfo[0];
        cart.old_module_info = {
          selling_price: items.data[i].oldModuleInfo[0].selling_price
        };
        cart.travelers = items.data[i].travelers;
        cart.id = items.data[i].id;
        this.carts.push(cart);

        price = {}
        price.selling_price = items.data[i].moduleInfo[0].selling_price;
        price.departure_date = items.data[i].moduleInfo[0].departure_date;
        price.start_price = items.data[i].moduleInfo[0].start_price;
        price.location = `${items.data[i].moduleInfo[0].departure_code}-${items.data[i].moduleInfo[0].arrival_code}`
        this.cartPrices.push(price)
        if (items.data[i].is_available) {


        }
        else {
          notAvilableItems.push(items.data[i])
        }
      }
      this.cartService.setCartPrices(this.cartPrices)
      if (notAvilableItems.length) {
        // this.toastrService.warning(`${notAvilableItems.length} itinerary is not available`);
      }
    }, error => {
      this.isCartEmpty = true;
      this.cartLoading = false;
    });

    this.cartService.getCartId.subscribe(cartId => {
      if (cartId > 0) {
        this.deleteCart(cartId);
        this.cartService.setCardId(0);
      }
    })

    this.checkOutService.getTravelerFormData.subscribe((travelerFrom: any) => {
      this.isValidTravelers = travelerFrom.status === 'VALID' ? true : false;
      this.travelerForm = travelerFrom;
    })

    sessionStorage.setItem('__insMode', btoa(this.instalmentMode))
  }

  totalLaycredit() {
    this.isLayCreditLoading = true;
    this.genericService.getAvailableLaycredit().subscribe((res: any) => {
      this.isLayCreditLoading = false;
      this.totalLaycreditPoints = res.total_available_points;
    }, (error => {
      this.isLayCreditLoading = false;
    }))
  }

  applyLaycredit(laycreditpoints) {
    this.laycreditpoints = laycreditpoints;
    this.isShowPaymentOption = true;
    if (this.laycreditpoints >= this.sellingPrice) {
      this.isShowPaymentOption = false;
    }
  }

  getSellingPrice() {

    let payLoad = {
      departure_date: moment(this.flightSummary[0].departure_date, 'DD/MM/YYYY').format("YYYY-MM-DD"),
      net_rate: this.flightSummary[0].net_rate
    }
    this.flightService.getSellingPrice(payLoad).subscribe((res: any) => {

      this.priceData = res;
      this.sellingPrice = this.priceData[0].selling_price;
    }, (error) => {

    })
  }

  selectInstalmentMode(instalmentMode) {
    this.instalmentMode = instalmentMode;
    this.showPartialPayemntOption = (this.instalmentMode == 'instalment') ? true : false
    sessionStorage.setItem('__insMode', btoa(this.instalmentMode))
  }

  getInstalmentData(data) {

    this.instalmentType = data.instalmentType;
    //this.laycreditpoints = data.layCreditPoints;
    this.priceSummary = data;
    this.checkOutService.setPriceSummary(this.priceSummary)
    sessionStorage.setItem('__islt', btoa(JSON.stringify(data)))
  }


  ngDoCheck() {
    let userToken = localStorage.getItem('_lay_sess');
    this.userInfo = getLoginUserInfo();

    if (userToken) {
      this.isLoggedIn = true;
    }
  }

  redeemableLayCredit(event) {
    this.redeemableLayPoints = event;
  }

  getTravelers() {
    this.travelerService.getTravelers().subscribe((res: any) => {
      //this.travelers=res.data;
      this.checkOutService.setTravelers(res.data)
    })
  }

  getCountry() {
    this.genericService.getCountry().subscribe(res => {
      this.checkOutService.setCountries(res);
    })
  }

  handleSubmit() {
    this.router.navigate(['/flight/checkout']);
  }

  ngOnDestroy() {
    this.cartService.setCartTravelers({
      type0: {
        adults: []
      },
      type1: {
        adults: []
      },
      type2: {
        adults: []
      },
      type3: {
        adults: []
      },
      type4: {
        adults: []
      }
    });
  }

  deleteCart(cartId) {
    this.loading = true;
    this.cartService.deleteCartItem(cartId).subscribe((res: any) => {
      this.loading = false;
      let index = this.carts.findIndex(x => x.id == cartId);
      this.carts.splice(index, 1);
      this.cartPrices.splice(index, 1)
      setTimeout(()=>{
        this.cartService.setCartItems(this.carts);
        this.cartService.setCartPrices(this.cartPrices)
      },2000)
      if (this.carts.length == 0) {
        this.isCartEmpty = true;
      }

      localStorage.setItem('$crt', JSON.stringify(this.carts.length));
      this.cartService.setDeletedCartItem(index)
    }, error => {
      this.loading = false;
      if (error.status == 404) {
        let index = this.carts.findIndex(x => x.id == cartId);
        this.carts.splice(index, 1);
        this.cartService.setCartItems(this.carts);
        if (this.carts.length == 0) {
          this.isCartEmpty = true;
        }
        localStorage.setItem('$crt', JSON.stringify(this.carts.length));
      }
    });
  }

  saveAndSearch() {
    this.router.navigate(['/']);
    return false;
    this.validationErrorMessage='';
    if (this.isValidTravelers) {
      this.loading=true;
      for (let i = 0; i < this.carts.length; i++) {
        let data = this.travelerForm.controls[`type${i}`].value.adults;
        let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
        let cartData = {
          cart_id: this.carts[i].id,
          travelers: travelers
        }
        this.cartService.updateCart(cartData).subscribe(data => {
          if (i === this.carts.length - 1) {
            this.loading=false;
            this.router.navigate(['/'])
          }
        });
      }
    }
    else {
      this.validateCartItems();
    }
  }

  selectCreditCard(data) {
    this.cardToken = data;
    this.cookieService.put("__cc", this.cardToken);
  }

  removeValidationError(){
    this.validationErrorMessage='';
  }

  validateCartItems(){
    this.validationErrorMessage='';
    if (!this.isValidTravelers) {
      this.validationErrorMessage='Traveller details is not valid for '
      let message='';
      for(let i in Object.keys(this.travelerForm.controls)){
        message='';
        if(this.travelerForm.controls[`type${i}`].status=="INVALID"){
          message = `${this.carts[i].module_info.departure_code}- ${this.carts[i].module_info.arrival_code} and`;
          this.validationErrorMessage +=message;
        }
      }
      let index = this.validationErrorMessage.lastIndexOf(" ");
      this.validationErrorMessage = this.validationErrorMessage.substring(0, index);
    }
  }

  continueToCheckout(){

    this.validationErrorMessage='';
    this.validateCartItems();

    if(this.cardToken==''){
      if(this.validationErrorMessage==''){
        this.validationErrorMessage=` Please select credit card`;
      }
      else{
        this.validationErrorMessage+=` and please select credit card`;
      }
    }

    if(this.isValidTravelers && this.cardToken!=''){
        this.loading=true;
        for (let i = 0; i < this.carts.length; i++) {
          let data = this.travelerForm.controls[`type${i}`].value.adults;
          let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
          let cartData = {
            cart_id: this.carts[i].id,
            travelers: travelers
          }
          this.cartService.updateCart(cartData).subscribe(data => {
            if (i === this.carts.length - 1) {
              this.loading=false;
              this.router.navigate(['/cart/checkout'])
            }
          });
        }
    }
  }

  getCardListChange(data){
    this.cardListChangeCount=data;
  }
}
