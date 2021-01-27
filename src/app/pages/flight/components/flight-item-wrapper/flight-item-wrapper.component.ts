import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../../services/flight.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../../app/services/generic.service';
import * as moment from 'moment'
import { getLoginUserInfo } from '../../../../../app/_helpers/jwt.helper';
import { CartService } from '../../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-flight-item-wrapper',
  templateUrl: './flight-item-wrapper.component.html',
  styleUrls: ['./flight-item-wrapper.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(10, [
            animate('0.001s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(50, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ],
})
export class FlightItemWrapperComponent implements OnInit, AfterContentChecked, OnDestroy {

  @Input() flightDetails;
  @Input() filter;
  cartItems = [];

  animationState = 'out';
  flightList;
  s3BucketUrl = environment.s3BucketUrl;
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
  flightListArray = [];
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

  isRoundTrip = false;

  subcell = '$100';
  isLoggedIn = false;
  userDetails;
  showTotalLayCredit = 0;
  _isLayCredit = false;
  totalLayCredit = 0;

  constructor(
    private flightService: FlightService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private commonFunction: CommonFunction,
    private genericService: GenericService,
    private cartService: CartService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {

    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.flightList = this.flightDetails;
    this.userInfo = getLoginUserInfo();

    if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
      this.isRoundTrip = true;
    } else if (this.route.snapshot.queryParams['trip'] === 'oneway') {
      this.isRoundTrip = false;
    }

    this.totalLaycredit();
    this.checkInstalmentAvalability();
    this.checkUser();

    this.cartService.getCartItems.subscribe(cartItems=>{
      this.cartItems = cartItems;
    })
    console.log(this.cartItems,"One");

  }

  ngDoCheck() {
    // this.checkUser();
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');

    this.isLoggedIn = false;
    if (userToken && userToken != 'undefined' && userToken != 'null') {
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

    this.loadCancellationPolicy = true;
    this.loadMoreCancellationPolicy = false;
    this.errorMessage = '';
    this.flightService.getCancellationPolicy(routeCode).subscribe((data: any) => {
      this.cancellationPolicyArray = data.cancellation_policy.split('--')
      this.loadCancellationPolicy = false;
      this.cancellationPolicy = data;
    }, (err) => {
      this.loadCancellationPolicy = false;
      this.errorMessage = err.message;
    });
  }

  toggleCancellationContent() {
    this.loadMoreCancellationPolicy = !this.loadMoreCancellationPolicy;
  }

  ngAfterContentChecked() {
    this.flightListArray = this.flightList;
    this.flightListArray.forEach(item => {
      this.flightDetailIdArray.push(item.route_code);
    });
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
    console.log(this.cartItems,"TWo");
    if (!this.isLoggedIn) {
      this.toastr.warning('Please login to book flight', 'Warning', { positionClass: 'toast-top-center', easeTime: 1000 });
    } else {

      if (this.cartItems && this.cartItems.length >=5) {
        this.spinner.hide();
        this.toastr.warning('You can not add more than 5 items in cart', 'Warning', { positionClass: 'toast-top-center', easeTime: 1000 });
      } else {
        this.spinner.show();
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
        sessionStorage.setItem('__route', JSON.stringify(route));
        /* if(this.isInstalmentAvailable || this.totalLaycreditPoints>0){
        } else{
          this.router.navigate([`flight/checkout/${route.route_code}`]);
        } */
        const payload = {
          module_id: 1,
          route_code: route.route_code,
          // room_id: 42945378451569
        };
        this.cartService.addCartItem(payload).subscribe((res: any) => {
          this.spinner.hide();
          if (res) {
            this.cartItems = [...this.cartItems,res.data]
            this.cartService.setCartItems(this.cartItems);
            
            localStorage.setItem('$crt', JSON.stringify(this.cartItems.length));
            this.router.navigate([`flight/payment/${route.route_code}`]);
          }
        }, error => {
          this.spinner.hide();
          this.toastr.warning(error.message, 'Warning', { positionClass: 'toast-top-center', easeTime: 1000 });
        });

      }
    }

    // const itinerary = {
    //   adult: this.route.snapshot.queryParams["adult"],
    //   child: this.route.snapshot.queryParams["child"],
    //   infant: this.route.snapshot.queryParams["infant"],
    //   is_passport_required: route.is_passport_required
    // };
    // let lastSearchUrl = this.router.url;
    // this.cookieService.put('_prev_search', lastSearchUrl);
    // const dateNow = new Date();
    // dateNow.setMinutes(dateNow.getMinutes() + 10);

    // sessionStorage.setItem('_itinerary', JSON.stringify(itinerary))
    // sessionStorage.setItem('__route', JSON.stringify(route));
    // /* if(this.isInstalmentAvailable || this.totalLaycreditPoints>0){
    // } else{
    //   this.router.navigate([`flight/checkout/${route.route_code}`]);
    // } */
    // this.router.navigate([`flight/payment/${route.route_code}`]);

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

    this.flightList = changes.flightDetails.currentValue;
  }

  logAnimation(event) {
    // console.log(event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
