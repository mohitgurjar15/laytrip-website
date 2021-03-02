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
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AddCardComponent } from '../../../components/add-card/add-card.component';
import { SpreedlyService } from '../../../services/spreedly.service';
import { CommonFunction } from '../../../_helpers/common-function';
import { BookingCompletionErrorPopupComponent } from '../../../components/booking-completion-error-popup/booking-completion-error-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  @ViewChild(AddCardComponent, { static: false }) addCardRef: AddCardComponent;
  progressStep = { step1: true, step2: true };
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
  validationErrorMessage: string = '';
  isValidTravelers: boolean = false;
  cardListChangeCount: number = 0;
  isBookingProgress: boolean = false;
  $cartIdsubscription;
  guestUserId: string = '';
  bookingRequest = {
    payment_type: "",
    laycredit_points: 0,
    card_token: "",
    instalment_type: "",
    additional_amount: 0,
    booking_through: "web",
    cart: [
    ],
    browser_info: {},
    site_url: "",
    selected_down_payment:0
  }
  challengePopUp:boolean=false;
  isSessionTimeOut: boolean = false;
  bookingTimerConfig;
  isBookingRequest = false;
  modalRef;

  constructor(
    private genericService: GenericService,
    private travelerService: TravelerService,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private cookieService: CookieService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private commonFunction: CommonFunction,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spreedly:SpreedlyService,
  ) {
    //this.totalLaycredit();
    this.getCountry();
    // this.openBookingCompletionErrorPopup();
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.userInfo = getLoginUserInfo();
    if (this.userInfo && this.userInfo.roleId != 7) {
      this.getTravelers();
    }
    else {
      this.getTravelers();
      this.guestUserId = this.commonFunction.getGuestUser();
    }

    this.bookingTimerConfiguration();

    this.cartLoading = true;
    this.cartService.getCartList('yes').subscribe((items: any) => {
      this.cartLoading = false;
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
        cart.is_available = items.data[i].id == 1265 ? false : items.data[i].is_available;
        cart.id = items.data[i].id;
        this.carts.push(cart);

        price = {}
        price.selling_price = items.data[i].moduleInfo[0].selling_price;
        price.departure_date = items.data[i].moduleInfo[0].departure_date;
        price.start_price = items.data[i].moduleInfo[0].start_price;
        price.location = `${items.data[i].moduleInfo[0].departure_code}-${items.data[i].moduleInfo[0].arrival_code}`
        this.cartPrices.push(price)

      }
      this.cartService.setCartItems(this.carts)
      this.cartService.setCartPrices(this.cartPrices);


    }, error => {
      this.isCartEmpty = true;
      this.cartLoading = false;
    });



    try {
      let data = sessionStorage.getItem('__islt');
      data = atob(data);
      this.priceSummary = JSON.parse(data)
    }
    catch (e) {
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

  sessionTimeout(event) {
    this.isSessionTimeOut = event;
    if (this.isSessionTimeOut && !this.isBookingRequest) {
      this.router.navigate(['/cart/booking']);
    }
  }

  bookingTimerConfiguration() {
    this.bookingTimerConfig = {
      leftTime: 600 - moment(moment().format('YYYY-MM-DD h:mm:ss')).diff(moment().format('YYYY-MM-DD h:mm:ss'), 'seconds'),
      format: 'm:s'
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
    if (this.addCardRef) {
      this.addCardRef.ngOnDestroy();
    }
    this.cartService.setCartNumber(0);
    this.cartService.setCardId(0);
    this.$cartIdsubscription.unsubscribe();
  }

  getCardListChange(data) {
    this.cardListChangeCount = data;
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  deleteCart(cartId) {
    if (cartId == 0) {
      return;
    }
    this.loading = true;
    this.cartService.deleteCartItem(cartId).subscribe((res: any) => {
      this.loading = false;
      this.redirectTo('/cart/checkout');
      let index = this.carts.findIndex(x => x.id == cartId);
      this.carts.splice(index, 1);
      this.cartPrices.splice(index, 1);
      localStorage.removeItem('$cartOver');
      this.adjustPriceSummary();
      setTimeout(() => {
        this.cartService.setCartItems(this.carts);
        this.cartService.setCartPrices(this.cartPrices);
      }, 2000)
      if (this.carts.length == 0) {
        this.isCartEmpty = true;
      }

      if (index > 0) {
        this.cartService.setCartNumber(index - 1);
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

  validateCartItems() {
    this.validationErrorMessage = '';
    if (!this.isValidTravelers) {
      this.validationErrorMessage = 'Complete required fields in Traveler Details for '
      let message = '';
      for (let i in Object.keys(this.travelerForm.controls)) {
        message = '';
        if (this.travelerForm.controls[`type${i}`].status == "INVALID") {
          message = `${this.carts[i].module_info.departure_code}- ${this.carts[i].module_info.arrival_code} ,`;
          this.validationErrorMessage += message;
        }
      }
      let index = this.validationErrorMessage.lastIndexOf(" ");
      this.validationErrorMessage = this.validationErrorMessage.substring(0, index);
    }
  }

  bookFlight() {
    this.isBookingRequest = true;
    this.validationErrorMessage = '';
    this.validateCartItems();
    if (this.userInfo.roleId == 7) {
      $('#sign_in_modal').modal('show');
      return false;
    }
    let carts = this.carts.map(cart => { return { cart_id: cart.id } })
    this.bookingRequest.card_token = this.cardToken;
    this.bookingRequest.selected_down_payment = this.priceSummary.selectedDownPayment;
    this.bookingRequest.payment_type = this.priceSummary.paymentType;
    this.bookingRequest.instalment_type = this.priceSummary.instalmentType;
    this.bookingRequest.cart = carts;
    sessionStorage.setItem('__cbk',JSON.stringify(this.bookingRequest))
    console.log("this.bookingRequest",this.bookingRequest)
    if(this.isValidTravelers && this.cardToken!=''){
      this.isBookingProgress=true;
      window.scroll(0, 0);
      for (let i = 0; i < this.carts.length; i++) {
        let data = this.travelerForm.controls[`type${i}`].value.adults;
        let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
        let cartData = {
          cart_id: this.carts[i].id,
          travelers: travelers
        }

        this.cartService.updateCart(cartData).subscribe(data => {
          if (i === this.carts.length - 1) {

            let browser_info = this.spreedly.browserInfo();
            console.log(browser_info);
            this.bookingRequest.browser_info = browser_info;
            if(window.location.origin.includes("localhost")){
              this.bookingRequest.site_url = 'https://demo.eztoflow.com';
            }
            else{
              this.bookingRequest.site_url = window.location.origin;
            }


            this.cartService.validate(this.bookingRequest).subscribe((res: any) => {
              let transaction = res.transaction;
              console.log(res);

              let redirection = res.redirection.replace('https://demo.eztoflow.com', 'http://localhost:4200');
              res.redirection = redirection;
              if (transaction.state == "succeeded") {

                console.log('succeeded', [redirection]);
                /* Note: Do not use this.router.navigateByUrl or navigate here */
                window.location.href = redirection;
              } else if (transaction.state == "pending") {

                console.log('pending', [res]);
                this.isBookingProgress=false;
                this.challengePopUp=true;
                this.spreedly.lifeCycle(res);
              } else {

                console.log('fail', [res]);

                this.router.navigate(['/book/failure']);
              }
            }, (error) => {
                console.log(error);
            });
            
          }
        }, (error) => {
          this.isBookingProgress = false;
        });
      }
    }
    else {
      this.isBookingProgress = false;
    }
  }

  adjustPriceSummary() {

    let totalPrice = 0;
    let checkinDate;
    if (this.cartPrices.length > 0) {
      checkinDate = moment(this.cartPrices[0].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
      for (let i = 0; i < this.cartPrices.length; i++) {
        totalPrice += this.cartPrices[i].selling_price;
        if (i == 0) {
          continue;
        }
        if (moment(checkinDate).isAfter(moment(this.cartPrices[i].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD"))) {
          checkinDate = moment(this.cartPrices[i].departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
        }
      }
    }

    let instalmentRequest = {
      instalment_type: this.priceSummary.instalmentType,
      checkin_date: checkinDate,
      booking_date: moment().format("YYYY-MM-DD"),
      amount: totalPrice,
      additional_amount: 0,
      selected_down_payment: this.priceSummary.selectedDownPayment
    }
    this.genericService.getInstalemnts(instalmentRequest).subscribe((res: any) => {

      if (res.instalment_available == true) {
        this.priceSummary.instalments = res;
        this.priceSummary.remainingAmount = totalPrice - res.instalment_date[0].instalment_amount;
        this.priceSummary.totalAmount = totalPrice;
        this.priceSummary = Object.assign({}, this.priceSummary);
        this.cd.detectChanges();
      }

    }, (err) => {

    })
  }

  /* openBookingCompletionErrorPopup() {
    this.modalRef = this.modalService.open(BookingCompletionErrorPopupComponent, {
      windowClass: 'booking_completion_error_block', centered: true, backdrop: 'static',
      keyboard: false
    }).result.then((result) => {

    });
  } */
}
