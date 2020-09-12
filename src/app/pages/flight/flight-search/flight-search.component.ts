import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LayTripStoreService } from '../../../state/layTrip/layTrip-store.service';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LayTripService } from '../../../state/layTrip/services/layTrip.service';
import { Location } from '@angular/common';
import { Actions, ofType } from '@ngrx/effects';
import { FlightService } from '../../../services/flight.service';
// import { data } from '../../flight/components/flight-item-wrapper/data';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit, OnDestroy {

  s3BucketUrl = environment.s3BucketUrl;
  loading = true;
  isNotFound = false;
  flightSearchData;
  flightSearchInfo;

  flightDetails;
  filterFlightDetails;

  subscriptions: Subscription[] = [];

  constructor(
    private layTripStoreService: LayTripStoreService,
    private route: ActivatedRoute,
    private layTripService: LayTripService,
    private flightService: FlightService,
    public router: Router,
    public location: Location,
    private actions$: Actions
  ) { }

  ngOnInit() {
    // const payload = {
    //   source_location: 'JAI',
    //   destination_location: 'DEL',
    //   departure_date: '2020-12-06',
    //   flight_class: 'Economy',
    //   adult_count: 1,
    //   child_count: 0,
    //   infant_count: 0,
    // };
    let payload: any = {};
    this.route.queryParams.forEach(params => {
      this.flightSearchInfo = params;
      if (params && params.trip === 'roundtrip') {
        payload = {
          source_location: params.departure,
          destination_location: params.arrival,
          departure_date: params.departure_date,
          arrival_date: params.arrival_date,
          flight_class: params.class,
          adult_count: parseInt(params.adult),
          child_count: parseInt(params.child),
          infant_count: parseInt(params.infant),
        };
      } else {
        payload = {
          source_location: params.departure,
          destination_location: params.arrival,
          departure_date: params.departure_date,
          flight_class: params.class,
          adult_count: parseInt(params.adult),
          child_count: parseInt(params.child),
          infant_count: parseInt(params.infant),
        };
      }
      this.getFlightSearchData(payload, params.trip);
    });
  }

  getFlightSearchData(payload, tripType) {
    this.loading = true;
    // // DISPATCH CALL FOR GET FLIGHT SEARCH RESULT
    // this.layTripStoreService.dispatchGetFlightSearchResult(payload);
    // // SELECTOR CALL FOR GET FLIGHT SEARCH RESULT
    // this.subscriptions.push(this.layTripStoreService.selectFlightSearchResult().subscribe(res => {
    //   console.log(res);
    //   if (res) {
    //     this.flightSearchData = res.items;
    //     this.loading = false;
    //     this.isNotFound = false;
    //   }
    // }));

    if (payload && tripType === 'roundtrip') {
      // this.flightDetails = data.items;
      // this.filterFlightDetails = data;
      // this.loading = false;
      this.flightService.getRoundTripFlightSearchResult(payload).subscribe((res: any) => {
        if (res) {
          this.loading = false;
          this.isNotFound = false;
          this.flightDetails = res.items;
          this.filterFlightDetails = res;
        }
      }, err => {
        if (err && err.status === 404) {
          this.isNotFound = true;
          this.loading = false;
        }
      });
    } else {
      this.flightService.getFlightSearchResult(payload).subscribe((res: any) => {
        if (res) {
          this.loading = false;
          this.isNotFound = false;
          this.flightDetails = res.items;
          this.filterFlightDetails = res;
        }
      }, err => {
        if (err && err.status === 404) {
          this.isNotFound = true;
          this.loading = false;
        }
      });
    }

    // this.flightService.getFlightSearchResult(payload).subscribe((res: any) => {
    //   if (res) {
    //     this.loading = false;
    //     this.isNotFound = false;
    //     this.flightDetails = res.items;
    //     this.filterFlightDetails = res;
    //   }
    // }, err => {
    //   if (err && err.status === 404) {
    //     this.isNotFound = true;
    //     this.loading = false;
    //   }
    // });
  }

  getSearchItem(event) {
    const payload = {
      source_location: event.departure,
      destination_location: event.arrival,
      departure_date: event.departure_date,
      flight_class: event.class,
      adult_count: parseInt(event.adult),
      child_count: parseInt(event.child),
      infant_count: parseInt(event.infant),
    };
    // this.getFlightSearchData(payload);
    this.router.navigate(['flight/search'], {
      skipLocationChange: false, queryParams: {
        trip: event.trip,
        departure: event.departure,
        arrival: event.arrival,
        departure_date: event.departure_date,
        class: event.class ? event.class : 'Economy',
        adult: event.adult,
        child: event.child ? event.child : 0,
        infant: event.infant ? event.infant : 0
      },
      queryParamsHandling: 'merge'
    });

    // TRIP is round-trip then call this API
    if (event.trip === 'round-trip') {
      this.getFlightSearchDataForRoundTrip(payload);
    }
  }

  getFlightSearchDataForRoundTrip(payload) {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
