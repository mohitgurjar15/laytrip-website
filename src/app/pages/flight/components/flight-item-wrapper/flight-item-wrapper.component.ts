import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { LayTripStoreService } from '../../../../state/layTrip/layTrip-store.service';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../../services/flight.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonFunction } from '../../../../_helpers/common-function';

@Component({
  selector: 'app-flight-item-wrapper',
  templateUrl: './flight-item-wrapper.component.html',
  styleUrls: ['./flight-item-wrapper.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(50, [
            animate('0.5s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(200, [
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

  animationState = 'out';
  flightList;
  s3BucketUrl = environment.s3BucketUrl;
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
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
  errorMessage;
  loadBaggageDetails = true;

  isRoundTrip = false;

  subcell = '$100';

  constructor(
    private layTripStoreService: LayTripStoreService,
    private flightService: FlightService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private commonFunction:CommonFunction
  ) { }

  ngOnInit() {

    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.loadJquery();

    // console.log(this.flightDetails);
    this.flightList = this.flightDetails;

    if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
      this.isRoundTrip = true;
    } else if (this.route.snapshot.queryParams['trip'] === 'oneway') {
      this.isRoundTrip = false;
    }

    // this.subscriptions.push(this.layTripStoreService.selectFlightSearchResult().subscribe(res => {
    //   if (res) {
    //     if (res.items) {
    //       // FOR FLIGHT LIST & DETAILS
    //       this.flightList = res.items;
    //     }
    //   }
    // }));

    // setTimeout(() => {
    //   const cells = Array.from(document.querySelectorAll<HTMLDivElement>('.mat-calendar .mat-calendar-body-cell-content'));
    //   cells.forEach(c => {
    //     c.innerHTML = c.innerHTML + ' ' + this.subcell;
    //   });
    // });
  }

  opened() {
    // setTimeout(() => {
    //   const cells = Array.from(document.querySelectorAll<HTMLDivElement>('.mat-calendar .mat-calendar-body-cell-content'));
    //   cells.forEach(c => {
    //     c.innerHTML = c.innerHTML + ' ' + this.subcell;
    //   });
    // });
  }

  getBaggageDetails(routeCode) {
    this.loadBaggageDetails = true;
    this.flightService.getBaggageDetails(routeCode).subscribe(data => {
      console.log('baggage:::', data);
      this.baggageDetails = data;
      this.loadBaggageDetails = false;
    });
  }

  getCancellationPolicy(routeCode) {
    this.cancellationPolicy = '';
    this.flightService.getCancellationPolicy(routeCode).subscribe(data => {
      console.log('cancellation-policy:::', data);
      this.errorMessage = '';
      this.cancellationPolicy = data;
    }, (err) => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }

  loadJquery() {
  }

  ngAfterContentChecked() {
    this.flightListArray = this.flightList;
    this.flightListArray.forEach(item => {
      this.flightDetailIdArray.push(item.route_code);
    });
  }

  showDetails(index) {

    if (typeof this.showFlightDetails[index] === 'undefined') {
      this.showFlightDetails[index] = true;
    } else {
      this.showFlightDetails[index] = !this.showFlightDetails[index];
    }

    this.showFlightDetails = this.showFlightDetails.map((item, i) => {
      return ((index === i) && this.showFlightDetails[index] === true) ? true : false;
    });
  }

  closeFlightDetail() {
    this.showFlightDetails = this.showFlightDetails.map(item => {
      return false;
    });
  }

  bookNow(routeCode) {
    const itinerary = {
      adult: this.route.snapshot.queryParams["adult"],
      child: this.route.snapshot.queryParams["child"],
      infant: this.route.snapshot.queryParams["infant"]
    };
    this.cookieService.put('_itinerary', JSON.stringify(itinerary));
    this.router.navigate([`flight/traveler/${routeCode}`]);
  }


  ngOnChanges(changes:SimpleChanges){
    
    this.flightList=changes.flightDetails.currentValue;
  }

  logAnimation(event) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
