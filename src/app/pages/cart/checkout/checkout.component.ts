import { Component, OnInit } from '@angular/core';
declare var $: any;
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { FlightService } from '../../../services/flight.service';
import { GenericService } from '../../../services/generic.service';
import { TravelerService } from '../../../services/traveler.service';
import { CheckOutService } from '../../../services/checkout.service';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

export interface CartItem {

  type: string;
  module_info: {},
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  progressStep = { step1: false, step2: true, step3: false, step4: false };
  userInfo;
  isShowPaymentOption: boolean = true;
  laycreditpoints: number = 0;
  sellingPrice: number;
  flightSummary = [];
  instalmentMode = 'instalment';
  instalmentType: string = 'weekly';
  isLoggedIn: boolean = false;
  priceData = [];
  priceSummary;
  carts = [];
  isValidData: boolean = false;
  cartLoading = false;
  loading:boolean=false;
  isCartEmpty:boolean=false;
  cartPrices=[];
  travelerForm:FormGroup;


  constructor(
    private router: Router,
    private flightService: FlightService,
    private genericService: GenericService,
    private travelerService: TravelerService,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private toster:ToastrService
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
      let price:any;
      for (let i = 0; i < items.data.length; i++) {
        cart = {};
        cart.type = items.data[i].type;
        cart.module_info = items.data[i].moduleInfo[0];
        cart.old_module_info = {
          selling_price : items.data[i].oldModuleInfo[0].selling_price
        };
        cart.travelers = items.data[i].travelers;
        cart.id = items.data[i].id;
        this.carts.push(cart);

        price={}
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

      this.checkOutService.getPriceSummary.subscribe(data=>{
        this.priceSummary=data;
      });
    },error=>{
      this.isCartEmpty =true;
      this.cartLoading = false;
    });

    this.cartService.getCartId.subscribe(cartId=>{
      if(cartId>0){
        this.deleteCart(cartId);
        this.cartService.setCardId(0);
      }
    })

    this.checkOutService.getTravelerFormData.subscribe((travelerFrom: any) => {
      console.log("travelerFrom",travelerFrom,travelerFrom.status)
      this.isValidData = travelerFrom.status === 'VALID' ? true : false;
      this.travelerForm= travelerFrom;
    })

    sessionStorage.setItem('__insMode', btoa(this.instalmentMode))
  }



  getTravelers() {
    this.travelerService.getTravelers().subscribe((res: any) => {
      this.checkOutService.setTravelers(res.data)
    })
  }

  getCountry() {
    this.genericService.getCountry().subscribe(res => {
      this.checkOutService.setCountries(res);
    })
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

  deleteCart(cartId){
    this.loading=true;
    this.cartService.deleteCartItem(cartId).subscribe((res: any) => {
      this.loading=false;
      let index = this.carts.findIndex(x=>x.id==cartId);
      this.carts.splice(index, 1);
      this.cartPrices.splice(index,1)
      this.cartService.setCartItems(this.carts);
      this.cartService.setCartPrices(this.cartPrices)
      if(this.carts.length==0){
        this.isCartEmpty =true;
      }
      localStorage.setItem('$crt', JSON.stringify(this.carts.length));
    }, error => {
      this.loading=false;
      if(error.status==404){
        let index = this.carts.findIndex(x=>x.id==cartId);
        this.carts.splice(index, 1);
        this.cartService.setCartItems(this.carts);
        if(this.carts.length==0){
          this.isCartEmpty =true;
        }
        localStorage.setItem('$crt', JSON.stringify(this.carts.length));
      }
    });
  }

  

}
