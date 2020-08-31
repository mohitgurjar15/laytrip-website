import { Component, OnInit, Input } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flight-search-bar',
  templateUrl: './flight-search-bar.component.html',
  styleUrls: ['./flight-search-bar.component.scss']
})
export class FlightSearchBarComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  flightSearchForm: FormGroup;

  // DATE OF FROM_DESTINATION & TO_DESTINATION
  fromDestinationDate = '';
  toDestinationDate = '';
  fromDestinationCode;
  toDestinationCode;

  searchFlightInfo =
    {
      trip: 'oneway',
      departure: '',
      arrival: '',
      departure_date: moment().add(1, 'months').format("YYYY-MM-DD"),
      // arrival_date: '',
      class: '',
      adult: 1,
      child: null,
      infant: null
    };

  switchBtnValue = false;
  tempSwapData =
    {
      leftSideValue: {},
      rightSideValue: {}
    };
  swapped = [];
  isSwap = false;
  swapError = '';
  selectedValue;

  constructor(
    public fb: FormBuilder,
  ) {
    this.flightSearchForm = this.fb.group({
      fromDestination: [[Validators.required]],
      toDestination: [[Validators.required]],
      departureDate: ['', [Validators.required]],
      returnDate: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    console.log(localStorage.getItem('_fligh'));
    // this.selectedValue = {
    //   id: this.flightSearchInfo.id,
    //   name: this.flightSearchInfo.name,
    //   code: res.code,
    //   city: res.city,
    //   country: res.country,
    //   display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
    // };
  }

  destinationChangedValue(event) {
    // console.log(event.value.code);
    if (event && event.key && event.key === 'fromSearch') {
      this.fromDestinationCode = event.value.code;
    } else if (event && event.key && event.key === 'toSearch') {
      this.toDestinationCode = event.value.code;
    }
    this.searchFlightInfo.departure = this.fromDestinationCode;
    this.searchFlightInfo.arrival = this.toDestinationCode;
  }

  getSwappedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.tempSwapData.leftSideValue = event.value;
    } else if (event && event.key && event.key === 'toSearch') {
      this.tempSwapData.rightSideValue = event.value;
    }
  }

}
