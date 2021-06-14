import { Component, OnInit, ViewChild } from '@angular/core';
declare var $: any;
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { FlightService } from '../../../services/flight.service';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { TravelerService } from '../../../services/traveler.service';
import { CheckOutService } from '../../../services/checkout.service';
import { CartService } from '../../../services/cart.service';
import { FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { AddCardComponent } from '../../../components/add-card/add-card.component';
import { CommonFunction } from '../../../_helpers/common-function';

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

  @ViewChild(AddCardComponent, { static: false }) addCardRef: AddCardComponent;
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
  isValidTravelers: boolean = false;
  cartLoading = false;
  loading: boolean = false;
  isCartEmpty: boolean = false;
  cartPrices = [];
  travelerForm: FormGroup;
  cardToken: string = '';
  validationErrorMessage: string = '';
  cardListChangeCount: number = 0;
  $cartIdsubscription;
  guestUserId: string = '';
  notAvailableError: string = '';
  isNotAvailableItinerary: boolean = false;
  isAllAlertClosed: boolean = true;
  isSubmitted: boolean = false;
  alertErrorMessage: string = '';
  inValidCartTravller = []
  lottieLoaderType = "";
  add_new_card = false;
  totalCard: number = 0;
  modules = [];
  ismaxCartAdded: boolean = false;

  constructor(
    private router: Router,
    private flightService: FlightService,
    private genericService: GenericService,
    private travelerService: TravelerService,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private commonFunction: CommonFunction,
    private cookieService: CookieService,
    private route: ActivatedRoute,
  ) {
    //this.totalLaycredit();
    this.getCountry();
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
        this.cartPrices.push(price);
      }

      this.cartService.setCartItems(this.carts)
      this.cartService.setCartPrices(this.cartPrices)

    }, error => {
      this.isCartEmpty = true;
      this.cartLoading = false;
      this.carts = [];
      this.cartPrices = [];
      localStorage.setItem('$crt', '0');
    });

    this.$cartIdsubscription = this.cartService.getCartId.subscribe(cartId => {

      if (cartId > 0) {
        this.deleteCart(cartId);
      }
    })

    try {
      this.cardToken = this.cookieService.get('__cc');
      this.cardToken = this.cardToken || '';
    }
    catch (e) {
      this.cardToken = '';
    }

    this.checkOutService.getTravelerFormData.subscribe((travelerFrom: any) => {
      this.isValidTravelers = travelerFrom.status === 'VALID' ? true : false;
      this.travelerForm = travelerFrom;
      if (this.carts.length && this.isSubmitted) {
        this.validationErrorMessage = '';
        this.validateCartItems();
      }
    })

    this.cartService.getLoaderStatus.subscribe(state => {
      this.loading = state;
    })

    this.genericService.getCardItems.subscribe((res: any) => {

      if (this.totalCard != res.length) {
        this.totalCard = res.length;
        this.add_new_card = false;
      }
    })

    sessionStorage.setItem('__insMode', btoa(this.instalmentMode))
  }

  totalNumberOfcard(event) {
    //this.totalCard = event;
  }

  addNewCard() {
    this.add_new_card = true;
  }

  closeNewCardPanel(event) {
    this.add_new_card = event;
  }

  ngAfterViewInit() {
    this.userInfo = getLoginUserInfo();
    if (this.userInfo && Object.keys(this.userInfo).length > 0) {
      this.getTravelers();
    }
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
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      var queryParams: any = {};
      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if(parms.utm_medium){
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if(parms.utm_campaign){
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
      this.router.navigate(['/flight/checkout'], { queryParams: queryParams });
    } else {
      this.router.navigate(['/flight/checkout']);
    }
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

  redirectTo(uri: string) {
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();      
      var queryParams: any = {};
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
      this.redirectTo('/cart/booking');
      let index = this.carts.findIndex(x => x.id == cartId);
      this.carts.splice(index, 1);
      this.cartPrices.splice(index, 1);
      localStorage.removeItem('$cartOver');

      setTimeout(() => {
        this.cartService.setCartItems(this.carts);
        this.cartService.setCartPrices(this.cartPrices)
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

  saveAndSearch() {
    this.ismaxCartAdded = false;
    let totalCarts: any = localStorage.getItem('$crt');
    if (totalCarts == 10) {
      this.ismaxCartAdded = true;
    } else {
      if (this.commonFunction.isRefferal()) {
        var parms = this.commonFunction.getRefferalParms();
        var queryParams: any = {};
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if(parms.utm_medium){
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if(parms.utm_campaign){
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate(['/'], { queryParams:queryParams });
      } else {
        this.router.navigate(['/']);
      }
    }
    return false;
    this.validationErrorMessage = '';
    if (this.isValidTravelers) {
      this.loading = true;
      for (let i = 0; i < this.carts.length; i++) {
        let data = this.travelerForm.controls[`type${i}`].value.adults;
        let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
        let cartData = {
          cart_id: this.carts[i].id,
          travelers: travelers
        }
        this.cartService.updateCart(cartData).subscribe(data => {
          if (i === this.carts.length - 1) {
            this.loading = false;
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
    this.validationErrorMessage = '';
    this.validateCartItems();
  }

  removeValidationError() {
    this.validationErrorMessage = '';
  }

  validateCartItems() {
    this.validationErrorMessage = '';
    this.inValidCartTravller = [];
    /* if (!this.isValidTravelers) { */
    //this.validationErrorMessage = 'Complete required fields in Traveler Details for'
    let message = '';

    for (let i in Object.keys(this.travelerForm.controls)) {
      message = '';
      for (let j = 0; j < this.travelerForm.controls[`type${i}`]['controls'].adults.controls.length; j++) {
        if (typeof this.carts[i] != 'undefined' && this.carts[i].is_available && this.travelerForm.controls[`type${i}`]['controls'].adults.controls[j].status == 'INVALID') {


          if (this.validationErrorMessage == '') {
            this.validationErrorMessage = 'Complete required fields in Traveler Details for'
          }
          if (!this.inValidCartTravller.includes(i)) {
            if (this.carts[i].type == 'flight') {
              message = ` ${this.carts[i].module_info.departure_code}-${this.carts[i].module_info.arrival_code} ,`;
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
                message = ` ${this.carts[i].module_info.departure_code}-${this.carts[i].module_info.arrival_code} ,`;
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
    /* } */

    let notAvailableMessage = '';
    this.notAvailableError = 'Itinerary is not available from ';
    for (let i = 0; i < this.carts.length; i++) {
      notAvailableMessage = '';
      if (!this.carts[i].is_available) {
        this.isNotAvailableItinerary = true;
        if (this.carts[i].type == 'flight') {
          notAvailableMessage = ` ${this.carts[i].module_info.departure_code}- ${this.carts[i].module_info.arrival_code} ,`;
        }
        if (this.carts[i].type == 'hotel') {
          notAvailableMessage = ` ${this.carts[i].module_info.title} ,`;
        }
        this.notAvailableError += notAvailableMessage;
      }
    }

    if (this.isNotAvailableItinerary) {
      let index = this.notAvailableError.lastIndexOf(" ");
      this.notAvailableError = this.notAvailableError.substring(0, index);
      //this.notAvailableError +='.';
    }

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
  }

  continueToCheckout() {

    this.validationErrorMessage = '';
    this.validateCartItems();
    this.isSubmitted = true;

    if (this.cardToken == '') {
      if (this.validationErrorMessage == '') {
        this.validationErrorMessage = ` Please select a credit card`;
      }
      else {
        this.validationErrorMessage += ` and please select a credit card`;
      }
    }

    if (this.isValidTravelers && this.cardToken != '' && !this.isNotAvailableItinerary && this.isAllAlertClosed) {
      this.loading = true;
      this.travelerForm.enable();
      for (let i = 0; i < this.carts.length; i++) {
        let data = this.travelerForm.controls[`type${i}`].value.adults;
        /*  */
        let travelers = [];
        for (let k = 0; k < data.length; k++) {
          travelers.push({
            traveler_id: data[k].userId
          })

          if (data[k].dob) {
            data[k].dob = moment(data[k].dob, "MM/DD/YYYY").format("YYYY-MM-DD")
          }
          if (data[k].passport_expiry) {
            data[k].passport_expiry = moment(data[k].passport_expiry, "MM/DD/YYYY").format("YYYY-MM-DD")
          }
          this.travelerService.updateAdult(data[k], data[k].userId).subscribe((traveler: any) => {

          })
        }
        let cartData = {
          cart_id: this.carts[i].id,
          travelers: travelers,
          referral_id: this.route.snapshot.queryParams['utm_source'] ? this.route.snapshot.queryParams['utm_source'] : ''
        }
        this.cartService.updateCart(cartData).subscribe(data => {
          if (i === this.carts.length - 1) {
            this.loading = false;
            if (this.commonFunction.isRefferal()) {
              let parms = this.commonFunction.getRefferalParms();
              var queryParams: any = {};
              queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
              if(parms.utm_medium){
                queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
              }
              if(parms.utm_campaign){
                queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
              }
              this.router.navigate(['cart/checkout'], { queryParams: queryParams });
            } else {
              this.router.navigate(['cart/checkout']);
            }
          }
        });
      }
    }
  }

  getCardListChange(data) {
    //this.add_new_card = false;
    this.cardListChangeCount = data;
  }

  removeNotAvailableError() {
    this.isNotAvailableItinerary = false;
  }

  removeAllAlertError() {
    this.isAllAlertClosed = true;
  }
  removeMaxCartAlertError() {
    this.ismaxCartAdded = false;
  }
}
