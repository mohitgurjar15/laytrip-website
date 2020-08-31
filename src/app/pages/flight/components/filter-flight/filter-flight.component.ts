import { Component, OnInit, OnDestroy } from '@angular/core';
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
    this.subscriptions.push(this.layTripStoreService.selectFlightSearchResult().subscribe(res => {
      if (res && res.price_range) {
        // FOR FILTER FLIGHT - PRICE & PARTIAL PRICE
        this.priceValue = res.price_range.min_price ? res.price_range.min_price : 0;
        this.priceHighValue = res.price_range.max_price ? res.price_range.max_price : 0;
        // tslint:disable-next-line: radix
        this.priceOptions.floor = parseInt(res.price_range.min_price) ? parseInt(res.price_range.min_price) : 0;
        // tslint:disable-next-line: radix
        this.priceOptions.ceil = parseInt(res.price_range.max_price) ? parseInt(res.price_range.max_price) : 0;
      }
      if (res && res.partial_payment_price_range) {
        this.partialPaymentValue = res.partial_payment_price_range.min_price ? res.partial_payment_price_range.min_price : 0;
        this.partialPaymentHighValue = res.partial_payment_price_range.max_price ? res.partial_payment_price_range.max_price : 0;
        this.partialPaymentOptions.floor =
          // tslint:disable-next-line: radix
          parseInt(res.partial_payment_price_range.min_price) ?
            // tslint:disable-next-line: radix
            parseInt(res.partial_payment_price_range.min_price) : 0;
        this.partialPaymentOptions.ceil =
          // tslint:disable-next-line: radix
          parseInt(res.partial_payment_price_range.max_price) ?
            // tslint:disable-next-line: radix
            parseInt(res.partial_payment_price_range.max_price) : 0;
      }
      if (res && res.arrival_time_slot || res && res.depature_time_slot) {
        // FOR FILTER FLIGHT - ARRIVAL TIME & DEPATURE TIME
        this.arrivalTimeSlot = res.arrival_time_slot;
        this.depatureTimeSlot = res.depature_time_slot;
      }
      if (res && res.stop_data) {
        // FOR FLIGHT STOPS
        this.flightStops = res.stop_data;
      }
      if (res && res.airline_list) {
        // FOR FLIGHT AIRLINE - AIRLINE
        this.airlineList = res.airline_list;
      }
      // console.log(res.items);
      if (res && res.items) {
        res.items.forEach(element => {
          this.departureTimeSlotCityName = element.departure_info.city;
          this.arrivalTimeSlotCityName = element.arrival_info.city;
        });
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
