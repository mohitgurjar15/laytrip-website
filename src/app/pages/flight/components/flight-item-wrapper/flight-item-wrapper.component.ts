import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
import { getLoginUserInfo, getUserDetails } from '../../../../../app/_helpers/jwt.helper';
import { CartService } from '../../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-flight-item-wrapper',
  templateUrl: './flight-item-wrapper.component.html',
  styleUrls: ['./flight-item-wrapper.component.scss'],
})
export class FlightItemWrapperComponent implements OnInit, AfterContentChecked, OnDestroy {

  @Input() flightDetails;
  @Input() filter;
  @Input() filteredLabel;
  @Output() changeLoading = new EventEmitter;
  @Output() maxCartValidation = new EventEmitter;
  @Output() flightNotAvailable = new EventEmitter;
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
    private spinner: NgxSpinnerService,
    public modalService: NgbModal,
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

    //this.totalLaycredit();
    this.checkInstalmentAvalability();
    this.checkUser();

    this.cartService.getCartItems.subscribe(cartItems => {
      this.cartItems = cartItems;
    })

  }

  ngDoCheck() {
    // this.checkUser();
  }

  checkUser() {
    let userToken = getLoginUserInfo();
    this.isLoggedIn = false;
    if (typeof userToken!='undefined' &&  userToken.roleId!=7) {
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
    /* if (!this.isLoggedIn) {
      const modalRef = this.modalService.open(LaytripOkPopup, {
        centered: true,
        keyboard: false,
        backdrop: 'static'
      });
    } else { */

      if (this.cartItems && this.cartItems.length >= 5) {
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
          route_code: route.route_code
        };
        //payload.guest_id = !this.isLoggedIn?this.commonFunction.getGuestUser():'';
        this.cartService.addCartItem(payload).subscribe((res: any) => {
          this.changeLoading.emit(true);
          if (res) {
            let newItem = { id: res.data.id, module_Info: res.data.moduleInfo[0] }
            this.cartItems = [...this.cartItems, newItem]
            this.cartService.setCartItems(this.cartItems);

            localStorage.setItem('$crt', JSON.stringify(this.cartItems.length));
            this.router.navigate([`cart/booking`]);
          }
        }, error => {
          this.changeLoading.emit(false);
          //this.toastr.warning(error.message, 'Warning', { positionClass: 'toast-top-center', easeTime: 1000 });
          this.flightNotAvailable.emit(true)
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
      this.flightList = changes.flightDetails.currentValue;
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
}

@Component({
  selector: 'laytrip-ok-popup',
  template: `<div class="modal-header">
      <h4 class="modal-title">Warning</h4>
    </div>
    <div class="modal-body">
      <p>Please login to book flight</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-light" (click)="modal.close('Close click')">OK</button>
    </div>`,
})

export class LaytripOkPopup {

  constructor(public modal: NgbActiveModal) {
  }
}


