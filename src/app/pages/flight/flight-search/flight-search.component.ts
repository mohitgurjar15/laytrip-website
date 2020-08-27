import { Component, OnInit } from '@angular/core';
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

  constructor(
    private layTripStateStoreService: LayTripStateStoreService
  ) { }

  ngOnInit() {
    this.loadJquery();
    const payload = {
      source_location: 'JAI',
      destination_location: 'DEL',
      departure_date: '2020-12-06',
      flight_class: 'Economy',
      adult_count: 1,
      child_count: 0,
      infant_count: 0,
    };
    // DISPATCH CALL FOR GET FLIGHT SEARCH RESULT
    this.layTripStateStoreService.dispatchGetFlightSearchResult(payload);
    // SELECTOR CALL FOR GET FLIGHT SEARCH RESULT
    this.layTripStateStoreService.selectFlightSearchResult().subscribe(res => {
      // console.log(res);
    });

  }

  loadJquery() {
    // Start Flight Price By Day slider js
    $('.price_day_slider').slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 7,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
    // Close Flight Price By Day slider js
  }


}
