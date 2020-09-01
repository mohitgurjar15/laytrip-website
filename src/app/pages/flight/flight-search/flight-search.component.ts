import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LayTripStoreService } from '../../../state/layTrip/layTrip-store.service';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { LayTripService } from '../../../state/layTrip/services/layTrip.service';
import { Location } from '@angular/common';

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

  subscriptions: Subscription[] = [];

  constructor(
    private layTripStoreService: LayTripStoreService,
    private route: ActivatedRoute,
    private layTripService: LayTripService,
    public router: Router,
    public location: Location
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
    this.route.queryParams.forEach(params => {
      this.flightSearchInfo = params;
      const payload = {
        source_location: params.departure,
        destination_location: params.arrival,
        departure_date: params.departure_date,
        flight_class: params.class,
        adult_count: parseInt(params.adult),
        child_count: parseInt(params.child),
        infant_count: parseInt(params.infant),
      };
      this.getFlightSearchData(payload);
    });
  }

  getFlightSearchData(payload) {
    this.loading = true;
    // DISPATCH CALL FOR GET FLIGHT SEARCH RESULT
    this.layTripStoreService.dispatchGetFlightSearchResult(payload);
    // SELECTOR CALL FOR GET FLIGHT SEARCH RESULT
    this.subscriptions.push(this.layTripStoreService.selectFlightSearchResult().subscribe(res => {
      if (res) {
        this.flightSearchData = res.items;
        // console.log(this.flightSearchData);
        this.loading = false;
        this.isNotFound = false;
        // console.log(this.loading);
      }
    }));
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
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
