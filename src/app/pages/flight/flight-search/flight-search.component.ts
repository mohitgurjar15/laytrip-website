import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FlightService } from '../../../services/flight.service';
import * as moment from 'moment';
import { CommonFunction } from '../../../_helpers/common-function';
import { NgxSpinnerService } from "ngx-spinner";

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
  isResetFilter: string = 'no';
  subscriptions: Subscription[] = [];
  tripType: string = '';

  flexibleLoading: boolean = false;
  flexibleNotFound: boolean = false;
  dates: [] = [];
  calenderPrices: [] = []
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    public router: Router,
    public location: Location,
    public commonFunction: CommonFunction,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    window.scroll(0, 0);

    sessionStorage.removeItem("__insMode")
    sessionStorage.removeItem("__islt")
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

  ngAfterViewInit() {
    $("#search_large_btn1, #search_large_btn2, #search_large_btn3").hover(
      function () {
        $('.norm_btn').toggleClass("d-none");
        $('.hover_btn').toggleClass("show");
      }
    );
  }


  getFlightSearchData(payload, tripType) {
    this.loading = true;
    this.tripType = tripType;
    this.errorMessage = '';
    if (payload && tripType === 'roundtrip') {
      this.flightService.getRoundTripFlightSearchResult(payload).subscribe((res: any) => {
        if (res) {
          this.loading = false;
          this.isNotFound = false;
          this.flightDetails = res.items;
          this.filterFlightDetails = res;

          
        }
      }, err => {
        if (err && err.status === 404) {
          this.errorMessage = err.message;
        }
        else {
          this.isNotFound = true;
        }

        this.loading = false;
      });
      this.dates = [];
      this.flightService.getFlightFlexibleDatesRoundTrip(payload).subscribe((res: any) => {
        if (res) {
          this.flexibleLoading = false;
          this.flexibleNotFound = false;
          this.dates = res;
        }
      }, err => {
        this.flexibleNotFound = true;
        this.flexibleLoading = false;
      });

      this.getCalenderPrice(payload)
    } else {
      this.flightService.getFlightSearchResult(payload).subscribe((res: any) => {
        if (res) {
          this.loading = false;
          this.isNotFound = false;
          this.flightDetails = res.items;
          this.filterFlightDetails = res;
          // this.spinner.show();
          // setTimeout(() => {
          //   this.spinner.hide();
          // }, 5000);
        }
      }, err => {

        if (err.status == 422) {
          this.errorMessage = err.message;
        }
        else {
          this.isNotFound = true;
        }
        this.loading = false;
      });

      this.dates = [];
      this.flightService.getFlightFlexibleDates(payload).subscribe((res: any) => {
        if (res) {
          this.flexibleLoading = false;
          this.flexibleNotFound = false;
          this.dates = res;
        }
      }, err => {
        this.flexibleNotFound = true;
        this.flexibleLoading = false;
      });

      this.getCalenderPrice(payload)
    }
  }


  getCalenderPrice(payload) {

    let departureDate = this.route.snapshot.queryParams['departure_date'];
    let departureDates = departureDate.split("-");
    let startDate: any = moment([departureDates[0], departureDates[1] - 1]);
    let endDate: any = moment(startDate).endOf('month');

    startDate = moment(startDate.toDate()).format("YYYY-MM-DD")
    endDate = moment(endDate.toDate()).format("YYYY-MM-DD");
    if (!moment().isBefore(startDate)) {
      startDate = moment().format("YYYY-MM-DD")
    }

    payload.start_date = startDate;
    payload.end_date = endDate;
    this.flightService.getFlightCalenderDate(payload).subscribe((res: any) => {
      if (res) {
        this.calenderPrices = res;
      }
    }, err => {

    });
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
    let urlData = this.commonFunction.decodeUrl(this.router.url);
    const queryParams = {
      trip: event.trip,
      departure: event.departure,
      arrival: event.arrival,
      departure_date: event.departure_date,
      class: event.class ? event.class : 'Economy',
      adult: event.adult,
      child: event.child ? event.child : 0,
      infant: event.infant ? event.infant : 0
    };
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`${urlData.url}`], { queryParams: queryParams, queryParamsHandling: 'merge' });
    });
  }

  getFlightSearchDataForRoundTrip(event) {
    let urlData = this.commonFunction.decodeUrl(this.router.url);
    const queryParams = {
      trip: event.trip,
      departure: event.departure,
      arrival: event.arrival,
      departure_date: event.departure_date,
      arrival_date: event.arrival_date,
      class: event.class ? event.class : 'Economy',
      adult: event.adult,
      child: event.child ? event.child : 0,
      infant: event.infant ? event.infant : 0
    };
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`${urlData.url}`], { queryParams: queryParams, queryParamsHandling: 'merge' });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  sortFlight(event) {
    let { key, order } = event;
    if (key === 'total_duration') {
      this.flightDetails = this.sortByDuration(this.filterFlightDetails.items, key, order);
    }
    else if (key === 'arrival') {
      this.flightDetails = this.sortByArrival(this.filterFlightDetails.items, key, order);
    }
    else if (key === 'departure') {

      this.flightDetails = this.sortByDeparture(this.filterFlightDetails.items, key, order);
    }
    else {
      this.flightDetails = this.sortJSON(this.filterFlightDetails.items, key, order);
    }
    // console.log("After Key:",key,this.flightDetails)

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

  resetFilter() {
    this.isResetFilter = (new Date()).toString();
  }
}
