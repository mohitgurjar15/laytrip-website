import { Component, OnInit, OnDestroy, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../../services/flight.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../../app/services/generic.service';
import * as moment from 'moment'
import { getLoginUserInfo } from '../../../../../app/_helpers/jwt.helper';
import { CartService } from '../../../../services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscountedBookingAlertComponent } from 'src/app/components/discounted-booking-alert/discounted-booking-alert.component';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { CartInventoryNotmatchErrorPopupComponent } from 'src/app/components/cart-inventory-notmatch-error-popup/cart-inventory-notmatch-error-popup.component';

@Component({
  selector: 'app-flight-item-wrapper',
  templateUrl: './flight-item-wrapper.component.html',
  styleUrls: ['./flight-item-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightItemWrapperComponent implements OnInit, OnDestroy {

  flightDetails;
  @Input() filter;
  @Input() filteredLabel;
  @Output() changeLoading = new EventEmitter;
  @Output() maxCartValidation = new EventEmitter;
  @Output() removeFlight = new EventEmitter;
  isFlightNotAvailable: boolean = false;
  cartItems = [];

  animationState = 'out';
  s3BucketUrl = environment.s3BucketUrl;
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
  currency;

  subscriptions: Subscription[] = [];
  flightDetailIdArray = [];

  hideDiv = true;
  showFlightDetails = [];
  showDiv = false;
  routeCode = [];
  baggageDetails;
  cancellationPolicy;
  cancellationPolicyArray = [];
  loadMoreCancellationPolicy: boolean = false;
  errorMessage;
  loadBaggageDetails: boolean = true;
  loadCancellationPolicy: boolean = false;
  isInstalmentAvailable = false;
  userInfo;
  totalLaycreditPoints: number = 0;
  showFareDetails: number = 0;
  flightUniqueCode;
  isRoundTrip = false;
  noOfDataToShowInitially = 20;
  subcell = '$100';
  isLoggedIn = false;
  userDetails;
  showTotalLayCredit = 0;
  _isLayCredit = false;
  totalLayCredit = 0;
  flightItems;
  scrollLoading: boolean = false;
  dataToLoad = 20;
  checkedAirUniqueCodes = [];
  isRefferal = this.commonFunction.isRefferal();

  installmentOption = {
    payment_method: '',
    payment_frequncy: '',
    down_payment: 0
  };

  constructor(
    private flightService: FlightService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private commonFunction: CommonFunction,
    private genericService: GenericService,
    private cartService: CartService,
    public modalService: NgbModal,
    private decimalPipe: DecimalPipe

  ) {
  }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.userInfo = getLoginUserInfo();

    if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
      this.isRoundTrip = true;
    } else if (this.route.snapshot.queryParams['trip'] === 'oneway') {
      this.isRoundTrip = false;
    }

    this.checkInstalmentAvalability();
    this.checkUser();

    this.cartService.getCartItems.subscribe(cartItems => {
      this.cartItems = cartItems;
    })
    this.loadJquery();
    this.flightService.getFlights.subscribe(data => {
      this.flightItems =[];
      if (data.length) {
        this.flightItems = data;
        for (let i = 0; i < this.flightDetails.length; i++) {
          if (this.flightDetails[i].payment_object.weekly)
            this.flightDetails[i].selected_option = 'weekly';
          else if (this.flightDetails[i].payment_object.biweekly)
            this.flightDetails[i].selected_option = 'biweekly';
          else if (this.flightDetails[i].payment_object.monthly)
            this.flightDetails[i].selected_option = 'monthly';
          else
            this.flightDetails[i].selected_option = 'full';
        }
      }
      else {
        this.flightDetails = [];
      }
    });

    this.flightDetails = this.flightItems.slice(0, this.noOfDataToShowInitially);

    this.flightDetails = this.flightItems.slice(0, this.noOfDataToShowInitially);

    // Author: xavier | 2021/8/3
    // Description: Increase the height of the "Add to Cart" buttons to fit spanish translation
    let userLang = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    if (userLang === 'es') {
      $(document).ready(function () {
        $('.cta_btn').find('button').css({
          'height': '50px',
          'line-height': '20px'
        });
      });
    }
  }

  setAirportAvailabilityOld() {

    let requestParams = { revalidateDto: [] };

    this.flightDetails.forEach(element => {
      if (!this.checkedAirUniqueCodes.includes(element.unique_code)) {
        requestParams.revalidateDto.push({
          route_code: element.route_code,
          unique_code: element.unique_code
        })
        this.checkedAirUniqueCodes.push(element.unique_code);
      }
    });

    this.flightService.searchAirportAvailabilityAssure(requestParams).subscribe(data => {
      let temp;
      for (let i = 0; i < this.flightDetails.length; i++) {
        temp = data[this.flightDetails[i].unique_code] ? data[this.flightDetails[i].unique_code] : {};
        if (Object.keys(temp).length) {
          this.flightDetails[i].availability = temp.availability;
        }
      }
    });
  }

  loadJquery() {
    $("body").click(function () {
      $(".code_name_m").hide();
    });
    $(".code_bt_m").click(function (e) {
      e.stopPropagation();
      $(this).siblings(".code_name_m").toggle();
    });
    $('.code_name_m').click(
      function (e) {
        e.stopPropagation();
      }
    );
  }

  checkUser() {
    let userToken = getLoginUserInfo();
    this.isLoggedIn = false;
    if (typeof userToken != 'undefined' && userToken.roleId != 7) {
      localStorage.removeItem("_isSubscribeNow");
      this.isLoggedIn = true;
    }
  }

  getBaggageDetails(routeCode) {
    this.loadBaggageDetails = true;
    this.flightService.getBaggageDetails(routeCode).subscribe(data => {
      this.baggageDetails = data;
      this.loadBaggageDetails = false;
    });
  }


  toggleCancellationContent() {
    this.loadMoreCancellationPolicy = !this.loadMoreCancellationPolicy;
  }

  showDetails(index, flag = null) {
    if (typeof this.showFlightDetails[index] === 'undefined') {
      this.showFlightDetails[index] = true;
    } else {
      this.showFlightDetails[index] = !this.showFlightDetails[index];
    }

    if (flag == 'true') {
      this.showFareDetails = 1;
    }
    else {

      this.showFareDetails = 0;
    }

    this.showFlightDetails = this.showFlightDetails.map((item, i) => {
      return ((index === i) && this.showFlightDetails[index] === true) ? true : false;
    });
  }

  closeFlightDetail() {

    this.showFareDetails = 0;
    this.showFlightDetails = this.showFlightDetails.map(item => {
      return false;
    });
  }

  bookNow(route) {
    console.log(route)
    this.removeFlight.emit(this.flightUniqueCode);
    this.isFlightNotAvailable = false;

    if (this.cartItems && this.cartItems.length >= 10) {
      this.changeLoading.emit(false);
      this.maxCartValidation.emit(true)
    } else {
      this.changeLoading.emit(true);
      const itinerary = {
        adult: this.route.snapshot.queryParams["adult"],
        child: this.route.snapshot.queryParams["child"],
        infant: this.route.snapshot.queryParams["infant"],
        is_passport_required: route.is_passport_required
      };
      let lastSearchUrl = this.router.url;
      this.cookieService.put('_prev_search', lastSearchUrl);
      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + 10);

      sessionStorage.setItem('_itinerary', JSON.stringify(itinerary))
      let downPayment;
      let paymentMethod ='installment';
      if (route.selected_option === 'weekly') {
        downPayment = route.payment_object['weekly'].down_payment
      } else if (route.selected_option === 'biweekly') {
        downPayment = route.payment_object['biweekly'].down_payment
      } else if (route.selected_option === 'monthly') {
        downPayment = route.payment_object['monthly'].down_payment
      }else if(route.selected_option === 'full') {
        downPayment = 0
        paymentMethod = 'no-installment'
      }
      let payload = {
        module_id: 1,
        route_code: route.route_code,
        referral_id: this.route.snapshot.queryParams['utm_source'] ? this.route.snapshot.queryParams['utm_source'] : '',
        payment_method:paymentMethod,
        payment_frequncy: route.selected_option !='full' ?  route.selected_option : '',
        down_payment: downPayment
        // searchData: { departure: route.departure_code, arrival: route.arrival_code, checkInDate: route.departure_date}
      };
      console.log(payload)
      this.cartService.addCartItem(payload).subscribe((res: any) => {
        this.changeLoading.emit(true);
        if (res) {
          let newItem = { id: res.data.id, module_Info: res.data.moduleInfo[0] }
          this.cartItems = [...this.cartItems, newItem]
          this.cartService.setCartItems(this.cartItems);

          localStorage.setItem('$crt', JSON.stringify(this.cartItems.length));
          if (this.commonFunction.isRefferal()) {
            let parms = this.commonFunction.getRefferalParms();
            var queryParams: any = {};
            queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
            if (parms.utm_medium) {
              queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
            }
            if (parms.utm_campaign) {
              queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
            }
            this.router.navigate(['cart/checkout'], { queryParams: queryParams });
          } else {
            this.router.navigate(['cart/checkout']);
          }
        }
      }, error => {
        this.changeLoading.emit(false);
        if (error.status == 406) {
          this.modalService.open(CartInventoryNotmatchErrorPopupComponent, {
            windowClass: 'cart_inventory_not_match_error_main', centered: true, backdrop: 'static',
            keyboard: false
          });
          return;
        }
        if (error.status == 409 && this.commonFunction.isRefferal()) {
          this.modalService.open(DiscountedBookingAlertComponent, {
            windowClass: 'block_session_expired_main', centered: true, backdrop: 'static',
            keyboard: false
          });
          return;
        }
        this.isFlightNotAvailable = true;
        this.flightUniqueCode = route.unique_code;
      });

    }
  }

  checkCartButton(index, payment_frequncy, down_payment, payment_method) {

    this.flightDetails[index].selected_option = payment_frequncy;
    this.installmentOption.payment_frequncy = payment_frequncy;
    this.installmentOption.down_payment = down_payment;
    this.installmentOption.payment_method = payment_method;
    console.log(this.installmentOption)
  }
  checkInstalmentAvalability() {
    let instalmentRequest = {
      checkin_date: this.route.snapshot.queryParams['departure_date'],
      booking_date: moment().format("YYYY-MM-DD")
    }
    this.genericService.getInstalemntsAvailability(instalmentRequest).subscribe((res: any) => {
      if (res.instalment_availability) {
        this.isInstalmentAvailable = res.instalment_availability;
      }
    })
  }

  totalLaycredit() {
    this.genericService.getAvailableLaycredit().subscribe((res: any) => {
      this.totalLaycreditPoints = res.total_available_points;
    }, (error => {

    }))
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.flightDetails && changes.flightDetails.currentValue) {
    } else if (changes && changes.filteredLabel && changes.filteredLabel.currentValue) {
      this.filteredLabel = changes.filteredLabel.currentValue;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getDayDiff(arrivalDate, departureDate) {
    let diff = moment(arrivalDate, "DD/MM/YYYY").diff(moment(departureDate, "DD/MM/YYYY"), 'days')
    return diff;
  }

  convertTime(time) {
    let newTime = this.commonFunction.convertTime(time, 'h:mm A', 'h:mma')
    return newTime.slice(0, -1)
  }

  hideFlightNotAvailable() {
    this.isFlightNotAvailable = false;
    this.flightUniqueCode = '';
    // let queryParams: any = {};
    /* const queryParams : any = {
      trip: this.route.snapshot.queryParams['trip'],
      departure: this.route.snapshot.queryParams['departure'],
      arrival: this.route.snapshot.queryParams['arrival'],     
      departure_date: this.route.snapshot.queryParams['departure_date'],
      class: this.route.snapshot.queryParams['class'] ? this.route.snapshot.queryParams['class'] : 'Economy',
      adult: this.route.snapshot.queryParams['adult'],
      child: this.route.snapshot.queryParams['child'] ? this.route.snapshot.queryParams['child'] : 0,
      infant: this.route.snapshot.queryParams['infant'] ? this.route.snapshot.queryParams['infant'] : 0
    };
    if (queryParams.trip == 'roundtrip') {
      queryParams.arrival_date = this.route.snapshot.queryParams['arrival_date'];
    }
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();

      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if (parms.utm_medium) {
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if (parms.utm_campaign) {
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
    }
   
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['flight/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
    }); */


  }

  showDownPayment(offerData, downPaymentOption, isInstallmentTypeAvailable) {

    if (typeof offerData != 'undefined' && offerData.applicable) {

      if (typeof offerData.down_payment_options != 'undefined' && offerData.down_payment_options[downPaymentOption].applicable) {
        return true;
      } else if (!this.isRefferal && isInstallmentTypeAvailable) {
        return true;
      }
      return false;
    } else {
      if (!this.isRefferal && isInstallmentTypeAvailable) {
        return true;
      }
      return false;
    }
    return true;
  }

  checkInDateInstallmentValidation(departureDate) {
    var currentDate = moment().add(2, 'days').format("DD/MM/YYYY");
    var departure = moment(departureDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    if (this.getDayDiff(departure, currentDate) > 30) {
      return false;
    }
    return true;
  }

  transformDecimal(num) {
    return this.decimalPipe.transform(num, '1.2-2');
  }


  onScrollDown() {
    this.scrollLoading = (this.flightItems.length != this.flightDetails.length) ? true : false;

    setTimeout(() => {
      console.log('here')
      if (this.noOfDataToShowInitially <= this.flightDetails.length) {

        let requestParams = { revalidateDto: [] };
        this.noOfDataToShowInitially += this.dataToLoad;
        this.flightDetails = this.flightItems.slice(0, this.noOfDataToShowInitially);
        console.log(this.flightDetails)
        this.scrollLoading = false;
      } else {
        this.scrollLoading = false;
      }
    }, 2000);
    console.log(this.scrollLoading)
  }
  getCancellationPolicy(route_code) {
    return "#";
  }
}




