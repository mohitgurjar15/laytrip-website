import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LayTripStoreService } from '../../../state/layTrip/layTrip-store.service';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { LayTripService } from '../../../state/layTrip/services/layTrip.service';

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
        } else {
          // console.log(this.loading);
        }
      }, error => {
        // console.log(error);
      }));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
