import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { GenericService } from '../../../services/generic.service';
import { TravelerService } from '../../../services/traveler.service';
import { CheckOutService } from '../../../services/checkout.service';
import { CartService } from '../../../services/cart.service';
import { FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AddCardComponent } from '../../../components/add-card/add-card.component';

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
  @ViewChild(AddCardComponent, {static: false}) addCardRef: AddCardComponent;
  progressStep = { step1: false, step2: true, step3: false, step4: false };
  userInfo;
  isShowPaymentOption: boolean = true;
  laycreditpoints: number = 0;
  sellingPrice: number;
  flightSummary = [];
  isLoggedIn: boolean = false;
  priceData = [];
  priceSummary: any;
  carts = [];
  isValidData: boolean = false;
  cartLoading = false;
  loading: boolean = false;
  isCartEmpty: boolean = false;
  cartPrices = [];
  travelerForm: FormGroup;
  cardToken: string = '';
  validationErrorMessage:string='';
  isValidTravelers:boolean=false;
  cardListChangeCount:number=0;
  isBookingProgress:boolean=false;
  $cartIdsubscription;
  bookingRequest={
    payment_type: "",
    laycredit_points: 0,
    card_token: "",
    instalment_type: "",
    additional_amount: 0,
    booking_through: "web",
    cart: [
    ]
  }

  constructor(
    private genericService: GenericService,
    private travelerService: TravelerService,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private cookieService: CookieService,
    private cd: ChangeDetectorRef,
    private router:Router
  ) {
    //this.totalLaycredit();
    this.getCountry();
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.userInfo = getLoginUserInfo();
    if (this.userInfo && Object.keys(this.userInfo).length > 0) {
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
      this.cartService.setCartPrices(this.cartPrices);
      if (notAvilableItems.length) {
        // this.toastrService.warning(`${notAvilableItems.length} itinerary is not available`);
      }

    }, error => {
      this.isCartEmpty = true;
      this.cartLoading = false;
    });


    
    try{
      let data = sessionStorage.getItem('__islt');
      data = atob(data);
      this.priceSummary = JSON.parse(data)
      console.log("this.priceSummary",this.priceSummary)
    }
    catch(e){
      this.router.navigate(['/'])
    }

    this.$cartIdsubscription = this.cartService.getCartId.subscribe(cartId => {
      if (cartId > 0) {
        this.deleteCart(cartId);
      }
    })

    this.checkOutService.getTravelerFormData.subscribe((travelerFrom: any) => {
      this.isValidTravelers = travelerFrom.status === 'VALID' ? true : false;
      this.travelerForm = travelerFrom;
    })

    try {
      this.cardToken = this.cookieService.get('__cc');
    }
    catch (e) {
      this.cardToken = '';
    }

  }

  getTravelers() {
    this.travelerService.getTravelers().subscribe((res: any) => {
      this.checkOutService.setTravelers(res.data);
      this.cd.detectChanges();
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
    if(this.addCardRef){
      this.addCardRef.ngOnDestroy();
    }
    this.cartService.setCartNumber(0);
    this.cartService.setCardId(0);
    this.$cartIdsubscription.unsubscribe();
  }

  getCardListChange(data){
    this.cardListChangeCount=data;
  }

  deleteCart(cartId) {
    if(cartId==0){
      return;
    }
    this.loading = true;
    this.cartService.deleteCartItem(cartId).subscribe((res: any) => {
      this.loading = false;
      let index = this.carts.findIndex(x => x.id == cartId);
      this.carts.splice(index, 1);
      this.cartPrices.splice(index, 1)
      this.adjustPriceSummary()
      setTimeout(()=>{
        this.cartService.setCartItems(this.carts);
        this.cartService.setCartPrices(this.cartPrices)
      },2000)
      if (this.carts.length == 0) {
        this.isCartEmpty = true;
      }

      if(index>0){
        this.cartService.setCartNumber(index-1);
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

  validateCartItems(){
    this.validationErrorMessage='';
    if (!this.isValidTravelers) {
      this.validationErrorMessage='Traveller details is not valid for '
      let message='';
      for(let i in Object.keys(this.travelerForm.controls)){
        message='';
        if(this.travelerForm.controls[`type${i}`].status=="INVALID"){
          message = `${this.carts[i].module_info.departure_code}- ${this.carts[i].module_info.arrival_code} and `;
          this.validationErrorMessage +=message;
        }
      }
      let index = this.validationErrorMessage.lastIndexOf(" ");
      this.validationErrorMessage = this.validationErrorMessage.substring(0, index);
    }
  }

  bookFlight(){
    this.validationErrorMessage='';
    this.validateCartItems();

    console.log("innnn")
    let carts = this.carts.map(cart=>{ return {  cart_id: cart.id} })
    this.bookingRequest.card_token=this.cardToken;
    this.bookingRequest.payment_type = this.priceSummary.paymentType;
    this.bookingRequest.instalment_type = this.priceSummary.instalmentType;
    this.bookingRequest.cart = carts;
    console.log("this.bookingRequest",this.bookingRequest)
    if(this.isValidTravelers && this.cardToken!=''){
      this.isBookingProgress=true;
      for (let i = 0; i < this.carts.length; i++) {
        let data = this.travelerForm.controls[`type${i}`].value.adults;
        let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
        let cartData = {
          cart_id: this.carts[i].id,
          travelers: travelers
        }
        this.cartService.updateCart(cartData).subscribe(data => {
          if (i === this.carts.length - 1) {
            console.log("Done");  
            this.cartService.bookCart(this.bookingRequest).subscribe((result:any)=>{
              console.log("result",result)

              let successItem = result.carts.filter(cart=>{ 
                if(cart.status==1){
                  return { cart_id : cart.id } 
                }
              });
              let failedItem = result.carts.filter(cart=>{ 
                if(cart.status==2){
                  return { car_id : cart.id } 
                }
              });
              
              let index
              for(let item of successItem){
                index = this.carts.findIndex(x=>x.id==item.cart_id)
                this.carts.splice(index,1)
                this.cartPrices.splice(index, 1)
              }
              this.cartService.setCartItems(this.carts);
              this.cartService.setCartPrices(this.cartPrices)

              localStorage.setItem('$crt', failedItem.length || 0);

              this.router.navigate([`/cart/confirm/${result.laytripCartId}`])
            })
          }
        },(error)=>{
          this.isBookingProgress=false;
        });
      }
    }
    else{
      this.isBookingProgress=false;
    }
    
  }

  adjustPriceSummary(){

    let totalPrice=0;
    let checkinDate;
    console.log("==this.cartPrices==",this.cartPrices);
    if(this.cartPrices.length>0){
        checkinDate = moment(this.cartPrices[0].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");
        for(let i=0; i < this.cartPrices.length; i++){
          totalPrice+=this.cartPrices[i].selling_price;
          if(i==0){
            continue;
          }
          if(moment(checkinDate).isAfter(moment(this.cartPrices[i].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD"))){
            checkinDate = moment(this.cartPrices[i].departure_date,"DD/MM/YYYY'").format("YYYY-MM-DD");
          }
        }
    }

    let instalmentRequest={
      instalment_type: this.priceSummary.instalmentType,
      checkin_date: checkinDate,
      booking_date: moment().format("YYYY-MM-DD"),
      amount: totalPrice,
      additional_amount: 0,
      selected_down_payment:this.priceSummary.selectedDownPayment
    }
    this.genericService.getInstalemnts(instalmentRequest).subscribe((res:any)=>{
      
      if(res.instalment_available==true){
        this.priceSummary.instalments=res;
        this.priceSummary.remainingAmount=totalPrice - res.instalment_date[0].instalment_amount;
        this.priceSummary.totalAmount=totalPrice;
        console.log("this.priceSummary=>>>",this.priceSummary)
      }
      
    },(err)=>{

    })
  }
}
