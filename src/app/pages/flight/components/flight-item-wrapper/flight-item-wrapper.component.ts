import { Component, OnInit, Input, AfterContentChecked, OnDestroy } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { LayTripStoreService } from '../../../../state/layTrip/layTrip-store.service';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../../services/flight.service';

@Component({
  selector: 'app-flight-item-wrapper',
  templateUrl: './flight-item-wrapper.component.html',
  styleUrls: ['./flight-item-wrapper.component.scss'],
})
export class FlightItemWrapperComponent implements OnInit, AfterContentChecked, OnDestroy {

  animationState = 'out';
  flightList;
  s3BucketUrl = environment.s3BucketUrl;
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
  flightListArray = [];
  currency;

  subscriptions: Subscription[] = [];
  flightDetailIdArray = [];

  hideDiv = true;
  showFlightDetails = -1;
  showDiv = false;
  routeCode = [];
  baggageDetails;
  cancellationPolicy;
  errorMessage;
  loadBaggageDetails=true;

  constructor(
    private layTripStoreService: LayTripStoreService,
    private flightService: FlightService
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.loadJquery();

    this.subscriptions.push(this.layTripStoreService.selectFlightSearchResult().subscribe(res => {
      if (res) {
        if (res.items) {
          // FOR FLIGHT LIST & DETAILS
          this.flightList = res.items;
        }
      }
    }));
  }

  getBaggageDetails(routeCode) {
    this.loadBaggageDetails=true;
    this.flightService.getBaggageDetails(routeCode).subscribe(data => {
      console.log('baggage:::', data);
      this.baggageDetails = data;
      this.loadBaggageDetails=false;
    });
  }

  getCancellationPolicy(routeCode) {
    this.cancellationPolicy="";
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
    this.showFlightDetails = index;
    
  }

  clickOutside() {
    // console.log('outside clicked');
    this.showFlightDetails = -1;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
