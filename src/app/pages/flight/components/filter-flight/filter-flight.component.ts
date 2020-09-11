import { Component, OnInit, OnDestroy, Input } from '@angular/core';
declare var $: any;
import { Options } from 'ng5-slider';
import { LayTripStoreService } from '../../../../state/layTrip/layTrip-store.service';
import { Subscription } from 'rxjs';

interface SliderDetails {
  value: number;
  highValue: number;
  floor: number;
  ceil: number;
}

@Component({
  selector: 'app-filter-flight',
  templateUrl: './filter-flight.component.html',
  styleUrls: ['./filter-flight.component.scss']
})
export class FilterFlightComponent implements OnInit, OnDestroy {

  @Input() filterFlightDetails: any;

  depatureTimeSlot;
  arrivalTimeSlot;
  flightStops;
  airlineList;
  arrivalTimeSlotCityName;
  departureTimeSlotCityName;
  currency;

  // tslint:disable-next-line: variable-name
  _currency = localStorage.getItem('_curr');

  priceValue = 0;
  priceHighValue = 0;
  priceOptions: Options = {
    floor: 0,
    ceil: 0,
    step: 1,
    translate: (value: number): any => {
      const currency = JSON.parse(this._currency);
      return `${currency.symbol} ${value}`;
    }
  };

  partialPaymentValue = 0;
  partialPaymentHighValue = 0;
  partialPaymentOptions: Options = {
    floor: 0,
    ceil: 0,
    step: 1,
    translate: (value: number): any => {
      const currency = JSON.parse(this._currency);
      return `${currency.symbol} ${value}`;
    }
  };

  subscriptions: Subscription[] = [];


  constructor(
    private layTripStoreService: LayTripStoreService
  ) { }

  ngOnInit() {
    // let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(this._currency);
    // this.subscriptions.push(this.layTripStoreService.selectFlightSearchResult().subscribe(res => {

    // }));
    if (this.filterFlightDetails && this.filterFlightDetails.price_range) {
      // FOR FILTER FLIGHT - PRICE & PARTIAL PRICE
      this.priceValue = this.filterFlightDetails.price_range.min_price ? this.filterFlightDetails.price_range.min_price : 0;
      this.priceHighValue = this.filterFlightDetails.price_range.max_price ? this.filterFlightDetails.price_range.max_price : 0;
      // tslint:disable-next-line: radix
      this.priceOptions.floor =
        // tslint:disable-next-line: radix
        parseInt(this.filterFlightDetails.price_range.min_price) ?
          // tslint:disable-next-line: radix
          parseInt(this.filterFlightDetails.price_range.min_price) : 0;
      // tslint:disable-next-line: radix
      this.priceOptions.ceil =
        // tslint:disable-next-line: radix
        parseInt(this.filterFlightDetails.price_range.max_price) ?
          // tslint:disable-next-line: radix
          parseInt(this.filterFlightDetails.price_range.max_price) : 0;
    }
    if (this.filterFlightDetails && this.filterFlightDetails.partial_payment_price_range) {
      this.partialPaymentValue =
        this.filterFlightDetails.partial_payment_price_range.min_price ? this.filterFlightDetails.partial_payment_price_range.min_price : 0;
      this.partialPaymentHighValue =
        this.filterFlightDetails.partial_payment_price_range.max_price ? this.filterFlightDetails.partial_payment_price_range.max_price : 0;
      this.partialPaymentOptions.floor =
        // tslint:disable-next-line: radix
        parseInt(this.filterFlightDetails.partial_payment_price_range.min_price) ?
          // tslint:disable-next-line: radix
          parseInt(this.filterFlightDetails.partial_payment_price_range.min_price) : 0;
      this.partialPaymentOptions.ceil =
        // tslint:disable-next-line: radix
        parseInt(this.filterFlightDetails.partial_payment_price_range.max_price) ?
          // tslint:disable-next-line: radix
          parseInt(this.filterFlightDetails.partial_payment_price_range.max_price) : 0;
    }
    if (this.filterFlightDetails && this.filterFlightDetails.arrival_time_slot || this.filterFlightDetails
      && this.filterFlightDetails.depature_time_slot) {
      // FOR FILTER FLIGHT - ARRIVAL TIME & DEPATURE TIME
      this.arrivalTimeSlot = this.filterFlightDetails.arrival_time_slot;
      this.depatureTimeSlot = this.filterFlightDetails.depature_time_slot;
    }
    if (this.filterFlightDetails && this.filterFlightDetails.stop_data) {
      // FOR FLIGHT STOPS
      this.flightStops = this.filterFlightDetails.stop_data;
    }
    if (this.filterFlightDetails && this.filterFlightDetails.airline_list) {
      // FOR FLIGHT AIRLINE - AIRLINE
      this.airlineList = this.filterFlightDetails.airline_list;
    }
    // console.log(this.filterFlightDetails.items);
    if (this.filterFlightDetails && this.filterFlightDetails.items) {
      this.filterFlightDetails.items.forEach(element => {
        this.departureTimeSlotCityName = element.departure_info.city;
        this.arrivalTimeSlotCityName = element.arrival_info.city;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
