import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: any;
import { Options } from 'ng5-slider';
import { LayTripStateStoreService } from '../../../../state/layTripState/layTripState-store.service';
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

  priceValue = 0;
  priceHighValue = 0;
  priceOptions: Options = {
    floor: 0,
    ceil: 0,
    step: 1
  };

  partialPaymentValue = 0;
  partialPaymentHighValue = 0;
  partialPaymentOptions: Options = {
    floor: 0,
    ceil: 0,
    step: 1
  };

  subscriptions: Subscription[] = [];


  constructor(
    private layTripStateStoreService: LayTripStateStoreService
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.subscriptions.push(this.layTripStateStoreService.selectFlightSearchResult().subscribe(res => {
      if (res && res.price_range) {
        // FOR FILTER FLIGHT - PRICE & PARTIAL PRICE
        this.priceValue = res.price_range.min_price;
        this.priceHighValue = res.price_range.max_price;
        this.priceOptions.floor = parseInt(res.price_range.min_price);
        this.priceOptions.ceil = parseInt(res.price_range.max_price);
      }
      if (res && res.partial_payment_price_range) {
        this.partialPaymentValue = res.partial_payment_price_range.min_price;
        this.partialPaymentHighValue = res.partial_payment_price_range.max_price;
        this.partialPaymentOptions.floor = parseInt(res.partial_payment_price_range.min_price);
        this.partialPaymentOptions.ceil = parseInt(res.partial_payment_price_range.max_price);
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
