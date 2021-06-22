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
    selected_down_payment: 0
  }
  challengePopUp: boolean = false;
  isSessionTimeOut: boolean = false;
  bookingTimerConfig;
  isBookingRequest = false;
  inValidCartTravller = [];
  totalCard: number = 0;
  add_new_card = false;
  alertErrorMessage: string = '';
  isAllAlertClosed: boolean = true;
  isTermConditionAccepted: boolean = false;
  isTermConditionError: boolean = false;

  isExcludedCountryAccepted: boolean = false;
  isExcludedCountryError: boolean = false;
  lottieLoaderType = "";
  modules = [];

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
    private spreedly: SpreedlyService,
  ) {
    //this.totalLaycredit();
    this.getCountry();
    // this.openBookingCompletionErrorPopup();
  }

  ngOnInit() {
    window.scroll(0, 0);
    localStorage.removeItem("__alrt")
    this.userInfo = getLoginUserInfo();
    if (this.userInfo && this.userInfo.roleId != 7) {
      this.getTravelers();
    }
    else {
      this.getTravelers();
      this.guestUserId = this.commonFunction.getGuestUser();
    }

    this.cartLoading = true;
    this.cartService.getCartList('yes').subscribe((items: any) => {
      if (items && items.data && items.data.length) {
        this.bookingTimerConfiguration();
      }
      this.cartLoading = false;
      let cart: any;
      let price: any;
      for (let i = 0; i < items.data.length; i++) {
        cart = {};
        price = {}

        cart.type = items.data[i].type;
        cart.travelers = items.data[i].travelers;
        cart.id = items.data[i].id;
        cart.is_available = items.data[i].is_available;

        this.modules.push(items.data[i].type);
        if (this.modules.some(x => x === "flight")) {
          this.lottieLoaderType = "flight";
        } else {
          this.lottieLoaderType = "hotel";
        }

        if (items.data[i].type == 'flight') {
          cart.module_info = items.data[i].moduleInfo[0];
          cart.old_module_info = {
            selling_price: items.data[i].oldModuleInfo[0].selling_price
          };

          price.selling_price = items.data[i].moduleInfo[0].selling_price;
          price.departure_date = items.data[i].moduleInfo[0].departure_date;
          price.start_price = items.data[i].moduleInfo[0].start_price;
          price.type = items.data[i].type;
          price.location = `${items.data[i].moduleInfo[0].departure_code}-${items.data[i].moduleInfo[0].arrival_code}`
        }
        else if (items.data[i].type == 'hotel') {

          cart.module_info = items.data[i].moduleInfo[0];
          cart.old_module_info = {
            selling_price: items.data[i].oldModuleInfo[0].selling.total
          };

          price.type = items.data[i].type;
          price.price_break_down = items.data[i].moduleInfo[0].selling;
          price.mandatory_fee_details = items.data[i].moduleInfo[0].mandatory_fee_details;
          price.selling_price = items.data[i].moduleInfo[0].selling.total;
          price.departure_date = moment(items.data[i].moduleInfo[0].input_data.check_in, "YYYY-MM-DD").format('DD/MM/YYYY');
          price.start_price = 0;
          price.location = items.data[i].moduleInfo[0].hotel_name;
        }
        this.carts.push(cart);
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
      if (this.commonFunction.isRefferal()) {
        let parms = this.commonFunction.getRefferalParms();
        var queryParams : any = {};
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if(parms.utm_medium){
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if(parms.utm_campaign){
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate(['/'], { queryParams: queryParams });
      } else {
        this.router.navigate(['/'])
      }
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

    this.cartService.getLoaderStatus.subscribe(state => {
      this.loading = state;
    })

    this.genericService.getCardItems.subscribe((res: any) => {

      if (this.totalCard != res.length) {
        this.totalCard = res.length;
        this.add_new_card = false;
      }
    })

  }

  sessionTimeout(event) {
    this.isSessionTimeOut = event;
    if (this.isSessionTimeOut && !this.isBookingRequest) {
      if (this.commonFunction.isRefferal()) {
        var queryParams : any = {};
        let parms = this.commonFunction.getRefferalParms();
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if(parms.utm_medium){
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if(parms.utm_campaign){
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate(['/cart/booking'], { queryParams: queryParams });
      } else {
        this.router.navigate(['/cart/booking'])
      }
    }
  }

  bookingTimerConfiguration() {
    this.bookingTimerConfig = Object.assign({}, {
      leftTime: 600,
      format: 'm:s'
    });
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
      },
      type5: {
        adults: []
      },
      type6: {
        adults: []
      },
      type7: {
        adults: []
      },
      type8: {
        adults: []
      },
      type9: {
        adults: []
      }
    });
    if (this.addCardRef) {
      this.addCardRef.ngOnDestroy();
    }
    this.cartService.setCartNumber(0);
    this.cartService.setCardId(0);
    this.$cartIdsubscription.unsubscribe();
    this.checkOutService.setTravelers([]);
  }

  getCardListChange(data) {
    //this.add_new_card = false;
    this.cardListChangeCount = data;
  }

  redirectTo(uri: string) {
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      var queryParams : any = {};
      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if(parms.utm_medium){
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if(parms.utm_campaign){
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate([uri], { queryParams: queryParams }));
    } else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate([uri]));
    }
  }

  deleteCart(cartId) {
    if (cartId == 0) {
      return;
    }
    this.loading = true;
    this.cartService.deleteCartItem(cartId).subscribe((res: any) => {
      this.loading = false;
      if (this.commonFunction.isRefferal()) {
        var parms = this.commonFunction.getRefferalParms();
        var queryParams : any = {};
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if(parms.utm_medium){
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if(parms.utm_campaign){
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate(['/cart/checkout'], { skipLocationChange: true, queryParams: queryParams });
      } else {
        this.redirectTo('/cart/checkout');
      }
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
    let message = '';
    this.inValidCartTravller = [];
    for (let i in Object.keys(this.travelerForm.controls)) {
      message = '';
      for (let j = 0; j < this.travelerForm.controls[`type${i}`]['controls'].adults.controls.length; j++) {
        if (typeof this.carts[i] != 'undefined' && this.carts[i].is_available && this.travelerForm.controls[`type${i}`]['controls'].adults.controls[j].status == 'INVALID') {

          if (this.validationErrorMessage == '') {
            this.validationErrorMessage = 'Complete required fields in Traveler Details for'
          }

          if (!this.inValidCartTravller.includes(i)) {
            if (this.carts[i].type == 'flight') {
              message = ` ${this.carts[i].module_info.departure_code}- ${this.carts[i].module_info.arrival_code} ,`;
            }
            if (this.carts[i].type == 'hotel') {
              message = ` ${this.carts[i].module_info.hotel_name} ,`;
            }
            this.validationErrorMessage += message;
          }
          this.isValidTravelers = false;
          this.inValidCartTravller.push(i)
        }
        if (typeof this.carts[i] != 'undefined' && this.carts[i].is_available && this.travelerForm.controls[`type${i}`]['controls'].adults.controls[j].status == 'VALID') {

          if (this.carts[i].is_available && this.travelerForm.controls[`type${i}`]['controls'].adults.controls[j].value.userId == "") {

            if (this.validationErrorMessage == '') {
              this.validationErrorMessage = 'Complete required fields in Traveler Details for'
            }
            if (!this.inValidCartTravller.includes(i)) {
              if (this.carts[i].type == 'flight') {
                message = ` ${this.carts[i].module_info.departure_code}- ${this.carts[i].module_info.arrival_code} ,`;
              }
              if (this.carts[i].type == 'hotel') {
                message = ` ${this.carts[i].module_info.title} ,`;
              }
              this.validationErrorMessage += message;
            }

            this.isValidTravelers = false;
            this.inValidCartTravller.push(i)
          }
        }
      }
    }

    let index = this.validationErrorMessage.lastIndexOf(" ");
    this.validationErrorMessage = this.validationErrorMessage.substring(0, index);

    let cartAlerts: any = localStorage.getItem("__alrt")
    this.alertErrorMessage = '';
    try {

      if (cartAlerts) {
        this.alertErrorMessage = 'Please close alert of price change for';
        cartAlerts = JSON.parse(cartAlerts);
        if (cartAlerts.length) {
          for (let i = 0; i < cartAlerts.length; i++) {
            if (cartAlerts[i].type == 'price_change') {
              this.alertErrorMessage += ` ${cartAlerts[i].name} ,`
            }
          }
          let index = this.alertErrorMessage.lastIndexOf(" ");
          this.alertErrorMessage = this.alertErrorMessage.substring(0, index);
          /* for (let i = 0; i < cartAlerts.length; i++) {
            if (cartAlerts[i].type == 'installment_vartion') {
              if (cartAlerts.length == 1) {
                this.alertErrorMessage = "Please close alert of odd installment amount.";
              }
              else {
                this.alertErrorMessage += ` and odd installment amount.`;
              }
            }
          } */

          this.isAllAlertClosed = false;
        }
        else {
          this.isAllAlertClosed = true;
        }
      }
      else {
        this.isAllAlertClosed = true;
      }
    }
    catch (e) {
      this.isAllAlertClosed = true;
    }

    if (!this.isTermConditionAccepted) {
      this.isTermConditionError = true;
    }
    else {
      this.isTermConditionError = false;
    }

    if (!this.isExcludedCountryAccepted) {
      this.isExcludedCountryError = true;
    }
    else {
      this.isExcludedCountryError = false;
    }
  }

  removeValidationError() {
    this.validationErrorMessage = '';
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
    sessionStorage.setItem('__cbk', JSON.stringify(this.bookingRequest))
    if (this.isValidTravelers && this.cardToken != '' && this.isAllAlertClosed && this.isTermConditionAccepted && this.isExcludedCountryAccepted) {
      this.isBookingProgress = true;
      window.scroll(0, 0);
      for (let i = 0; i < this.carts.length; i++) {
        let data = this.travelerForm.controls[`type${i}`].value.adults;
        //let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
        let travelers = [];
        for (let k = 0; k < data.length; k++) {
          travelers.push({
            traveler_id: data[k].userId
          })

          data[k].dob = moment(data[k].dob, "MM/DD/YYYY").format("YYYY-MM-DD")
          if (data[k].passport_expiry) {
            data[k].passport_expiry = moment(data[k].passport_expiry, "MM/DD/YYYY").format("YYYY-MM-DD")
          }
          this.travelerService.updateAdult(data[k], data[k].userId).subscribe((traveler: any) => {

          })
        }
        let cartData = {
          cart_id: this.carts[i].id,
          travelers: travelers
        }


        this.cartService.updateCart(cartData).subscribe(data => {
          if (i === this.carts.length - 1) {
            
            let browser_info = this.spreedly.browserInfo();
            this.bookingRequest.browser_info = browser_info;
            if (window.location.origin.includes("localhost")) {
              this.bookingRequest.site_url = 'https://demo.eztoflow.com';
            }
            else {
              this.bookingRequest.site_url = window.location.origin;
            }


            this.cartService.validate(this.bookingRequest).subscribe((res: any) => {
              let transaction = res.transaction;

              let redirection = res.redirection.replace('https://demo.eztoflow.com', 'http://localhost:4200');
              
              var queryParams : any = {};
              if (this.commonFunction.isRefferal()) {
                var parms = this.commonFunction.getRefferalParms();
                redirection += redirection+parms.utm_source ? '&utm_source='+parms.utm_source : '';
                queryParams.utm_source = parms.utm_source ? parms.utm_source : '';

                if(parms.utm_medium){
                  queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
                  redirection += redirection+parms.utm_medium ? '&utm_medium='+parms.utm_medium : '';
                }
                if(parms.utm_campaign){
                  redirection += redirection+parms.utm_campaign ? '&utm_campaign='+parms.utm_campaign : '';
                  queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
                }
              } 
              res.redirection = redirection;

              // console.log("res", res);
              if (transaction.state == "succeeded") {
                // console.log('succeeded', [redirection]);
                window.location.href = redirection;
              } else if (transaction.state == "pending") {

                // console.log('pending', [res]);
                this.isBookingProgress = false;
                this.challengePopUp = true;
                this.spreedly.lifeCycle(res);
              } else {
                console.log('fail', [res]);
                if (this.commonFunction.isRefferal()) {
                  this.router.navigate(['/cart/checkout'], { skipLocationChange: true, queryParams: queryParams });
                } else {
                  this.redirectTo('/cart/checkout');
                }
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

  addNewCard() {
    this.add_new_card = true;
  }

  closeNewCardPanel(event) {
    this.add_new_card = event;
  }

  totalNumberOfcard(event) {
    console.log(event);
    //this.totalCard = event;
  }

  acceptTermCondition(event) {
    if (event.target.checked) {
      this.isTermConditionAccepted = true;
      this.isTermConditionError = false;
    }
    else {
      this.isTermConditionAccepted = false;
      this.isTermConditionError = true;
    }
  }

  removeTermConditionError() {
    this.isTermConditionError = false;
  }

  acceptExcludedCountry(event) {
    if (event.target.checked) {
      this.isExcludedCountryAccepted = true;
      this.isExcludedCountryError = false;
    }
    else {
      this.isExcludedCountryAccepted = false;
      this.isExcludedCountryError = true;
    }
  }

  removeExculdedError() {
    this.isExcludedCountryError = false;
  }
}
