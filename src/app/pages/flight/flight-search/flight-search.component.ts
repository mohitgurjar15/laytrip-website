import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LayTripStateStoreService } from '../../../state/layTripState/layTripState-store.service';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit, OnDestroy {

  s3BucketUrl = environment.s3BucketUrl;
  loading;
  isNotFound = false;
  flightSearchData;

  subscriptions: Subscription[] = [];

  constructor(
    private layTripStateStoreService: LayTripStateStoreService,
    private route: ActivatedRoute
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
    this.loading = true;
    if (this.loading) {
      this.isNotFound = false;
    }
    this.route.queryParams.forEach(params => {
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
      this.layTripStateStoreService.dispatchGetFlightSearchResult(payload);
      // SELECTOR CALL FOR GET FLIGHT SEARCH RESULT
      this.subscriptions.push(this.layTripStateStoreService.selectFlightSearchResult().subscribe(res => {
        // console.log(res);
        if (res && res.items) {
          this.loading = false;
          this.isNotFound = false;
        }
      }));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
