import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LayTripStateStoreService } from '../../../state/layTripState/layTripState-store.service';
declare var $: any;
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  loading;
  isNotFound = false;
  flightSearchData;

  constructor(
    private layTripStateStoreService: LayTripStateStoreService,
  ) { }

  ngOnInit() {
    const payload = {
      source_location: 'JAI',
      destination_location: 'DEL',
      departure_date: '2020-12-06',
      flight_class: 'Economy',
      adult_count: 1,
      child_count: 0,
      infant_count: 0,
    };
    this.loading = true;
    // DISPATCH CALL FOR GET FLIGHT SEARCH RESULT
    this.layTripStateStoreService.dispatchGetFlightSearchResult(payload);
    // SELECTOR CALL FOR GET FLIGHT SEARCH RESULT
    this.layTripStateStoreService.selectFlightSearchResult().subscribe(res => {
      // console.log(res);
      if (res && res.items) {
        this.loading = false;
      }
    }, (err) => {
      if (err) {
        this.isNotFound = true;
      }
    });

  }
}
