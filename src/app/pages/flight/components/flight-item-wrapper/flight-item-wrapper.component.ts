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
import { ToastrService } from 'ngx-toastr';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscountedBookingAlertComponent } from 'src/app/components/discounted-booking-alert/discounted-booking-alert.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-flight-item-wrapper',
  templateUrl: './flight-item-wrapper.component.html',
  styleUrls: ['./flight-item-wrapper.component.scss'],
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
  //flightList;
  s3BucketUrl = environment.s3BucketUrl;
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
  //flightListArray = [];
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


  constructor(
    private flightService: FlightService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private commonFunction: CommonFunction,
    private genericService: GenericService,
    private cartService: CartService,
    private toastr: ToastrService,
    //private spinner: NgxSpinnerService,
    public modalService: NgbModal,
    private decimalPipe: DecimalPipe

  ) {
  }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    //this.flightListArray = this.flightDetails;
    this.userInfo = getLoginUserInfo();

    if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
      this.isRoundTrip = true;
    } else if (this.route.snapshot.queryParams['trip'] === 'oneway') {
      this.isRoundTrip = false;
    }

    //this.totalLaycredit();
    this.checkInstalmentAvalability();
    this.checkUser();

    this.cartService.getCartItems.subscribe(cartItems => {
      this.cartItems = cartItems;
    })

    // setTimeout(() => { 
    //   this.loadJquery(); 
    // }, 3000)
    this.loadJquery(); 
    this.flightService.getFlights.subscribe(data=>{
      if(data.length){
        this.flightItems = data;
        this.flightDetails = data.slice(0, this.noOfDataToShowInitially);
        
        this.setAirportAvailability();
      }
      else{
        this.flightDetails=[];
      }
    })

  }

  setAirportAvailability() {
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
        if (Object.keys(temp).length && !this.checkedAirUniqueCodes.includes(this.flightDetails[i].unique_code)) {
          this.flightDetails[i].availability = temp.availability;
        } else {
          this.flightDetails[i].availability = 'no';
        }
        //this.checkedAirUniqueCodes.push(this.flightDetails[i].unique_code);
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

  opened() {
  }

  getBaggageDetails(routeCode) {
    this.loadBaggageDetails = true;
    this.flightService.getBaggageDetails(routeCode).subscribe(data => {
      this.baggageDetails = data;
      this.loadBaggageDetails = false;
    });
  }

  getCancellationPolicy(routeCode) {

    // this.loadCancellationPolicy = true;
    // this.loadMoreCancellationPolicy = false;
    // this.errorMessage = '';
    // this.cancellationPolicyArray = [];
    // this.cancellationPolicy = '';
    // this.flightService.getCancellationPolicy(routeCode).subscribe((data: any) => {
    //   this.cancellationPolicyArray = data.cancellation_policy.split('--')
    //   this.loadCancellationPolicy = false;
    //   this.cancellationPolicy = data;
    // }, (err) => {
    //   this.loadCancellationPolicy = false;
    //   this.errorMessage = err.message;
    // });
  }

  toggleCancellationContent() {
    this.loadMoreCancellationPolicy = !this.loadMoreCancellationPolicy;
  }

  /* ngAfterContentChecked() {
    this.flightListArray = this.flightList;
    this.flightListArray.forEach(item => {
      this.flightDetailIdArray.push(item.route_code);
    });
  } */

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

      let payload = {
        module_id: 1,
        route_code: route.route_code,
        referral_id: this.route.snapshot.queryParams['utm_source'] ? this.route.snapshot.queryParams['utm_source'] : ''
      };
      //payload.guest_id = !this.isLoggedIn?this.commonFunction.getGuestUser():'';
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
            if(parms.utm_medium){
              queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
            }
            if(parms.utm_campaign){
              queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
            }
            this.router.navigate(['cart/checkout'], { queryParams:queryParams });
          } else {
            this.router.navigate(['cart/checkout']);
          }
        }
      }, error => {
        this.changeLoading.emit(false);
        if (error.status == 409 && this.commonFunction.isRefferal()) {
          this.modalService.open(DiscountedBookingAlertComponent, {
            windowClass: 'block_session_expired_main', centered: true, backdrop: 'static',
            keyboard: false
          });
          return;
        }
        //this.toastr.warning(error.message, 'Warning', { positionClass: 'toast-top-center', easeTime: 1000 });
        this.isFlightNotAvailable = true;
        this.flightUniqueCode = route.unique_code;
        // this.isFlightNotAvailable.emit(true)
      });

    }
    /* } */
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
      //this.flightDetails = changes.flightDetails.currentValue;
    } else if (changes && changes.filteredLabel && changes.filteredLabel.currentValue) {
      this.filteredLabel = changes.filteredLabel.currentValue;
    }
    // this.flightList = changes.flightDetails.currentValue;
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
  }

  showDownPayment(offerData,downPaymentOption){

    if (typeof offerData != 'undefined' && offerData.applicable) {

      if(typeof offerData.down_payment_options!='undefined' && offerData.down_payment_options[downPaymentOption].applicable){
        return true;
      }
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
      if (this.noOfDataToShowInitially <= this.flightDetails.length) {
        
        let requestParams = { revalidateDto: [] };
        this.noOfDataToShowInitially += this.dataToLoad;
        this.flightDetails = this.flightItems.slice(0, this.noOfDataToShowInitially);
        //Create new req param from i.e. 21 to 40
        
        
        this.setAirportAvailability()
        this.scrollLoading = false;
      } else {
        this.scrollLoading = false;
      }
    }, 1000);
  }
}




