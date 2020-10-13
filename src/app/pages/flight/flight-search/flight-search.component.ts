import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayTripStoreService } from '../../../state/layTrip/layTrip-store.service';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LayTripService } from '../../../state/layTrip/services/layTrip.service';
import { Location } from '@angular/common';
import { Actions, ofType } from '@ngrx/effects';
import { FlightService } from '../../../services/flight.service';
import * as moment from 'moment';

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
  isResetFilter:string='no';
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
    window.scroll(0, 0);
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
        // if (params && params.trip === 'oneway') {
        //   if (typeof params.arrival_date !== 'undefined') {
        //     console.log(params);
        //     delete params['arrival_date'];
        //   }
        // }
        // if (params.trip === 'oneway' && this.route.snapshot.queryParams['arrival_date']) {
        //   let snapshot = this.route.snapshot;
        //   const removingParams = { ...snapshot.queryParams };
        //   delete removingParams.arrival_date;
        //   params = removingParams;
        // }
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
        /* if (err && err.status === 404) { */
        this.isNotFound = true;
        this.loading = false;
        /* } */
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
        /* if (err && err.status === 404) { */
        this.isNotFound = true;
        this.loading = false;
        /* } */
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
    // TRIP is round-trip then call this API
    if (event.trip === 'roundtrip') {
      this.getFlightSearchDataForRoundTrip(event);
    } else if (event.trip === 'oneway') {
      this.getFlightSearchDataForOneway(event);
    }
  }

  getFlightSearchDataForOneway(event) {
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

  getFlightSearchDataForRoundTrip(event) {
    this.router.navigate(['flight/search'], {
      skipLocationChange: false, queryParams: {
        trip: event.trip,
        departure: event.departure,
        arrival: event.arrival,
        departure_date: event.departure_date,
        arrival_date: event.arrival_date,
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

  sortFlight(event) {
    let { key, order } = event;
    if (key === 'total_duration') {
      this.flightDetails = this.sortByDuration(this.flightDetails, key, order);
    }
    else if (key === 'arrival') {
      this.flightDetails = this.sortByArrival(this.flightDetails, key, order);
    }
    else if (key === 'departure') {

      this.flightDetails = this.sortByDeparture(this.flightDetails, key, order);
    }
    else {
      this.flightDetails = this.sortJSON(this.flightDetails, key, order);
    }
    console.log(this.flightDetails);

  }

  sortJSON(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    } else {
      return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

  sortByDuration(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    }
    else {
      return data.sort(function (a, b) {
        let x = moment(`${a.arrival_date} ${a.arrival_time}`, 'DD/MM/YYYY hh:mm A').diff(moment(`${a.departure_date} ${a.departure_time}`, 'DD/MM/YYYY hh:mm A'), 'seconds')
        let y = moment(`${b.arrival_date} ${b.arrival_time}`, 'DD/MM/YYYY hh:mm A').diff(moment(`${b.departure_date} ${b.departure_time}`, 'DD/MM/YYYY hh:mm A'), 'seconds')
        console.log(`${a.arrival_date} ${a.arrival_time}`, `${a.departure_date} ${a.departure_time}`, x, y, way)
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

  sortByArrival(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    }
    else {
      return data.sort(function (a, b) {
        let x = moment(`${a.arrival_date} ${a.arrival_time}`, 'DD/MM/YYYY hh:mm A').format("X");
        let y = moment(`${b.arrival_date} ${b.arrival_time}`, 'DD/MM/YYYY hh:mm A').format("X");
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

  sortByDeparture(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    }
    else {
      return data.sort(function (a, b) {

        let x = moment(`${a.departure_date} ${a.departure_time}`, 'DD/MM/YYYY hh:mm A').format("X");
        let y = moment(`${b.departure_date} ${b.departure_time}`, 'DD/MM/YYYY hh:mm A').format("X");
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

  filterFlight(event) {
    this.flightDetails = event;
  }

  resetFilter(){
    //this.isResetFilter=(new Date()).toString();
  }
}
