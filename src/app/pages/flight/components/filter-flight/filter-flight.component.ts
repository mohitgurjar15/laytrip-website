import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
declare var $: any;
import { Options } from 'ng5-slider';
import { LayTripStoreService } from '../../../../state/layTrip/layTrip-store.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

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
  @Output() filterFlight=new EventEmitter();
  depatureTimeSlot;
  arrivalTimeSlot;
  flightStops;
  airlineList;
  arrivalTimeSlotCityName;
  departureTimeSlotCityName;
  currency;

  /* Varibale for filter */
  minPrice:number;
  maxPrice:number;
  airLines=[];
  minPartialPaymentPrice:number;
  maxPartialPaymentPrice:number;
  timeRangeSlots=[];
  journeyType:string;
  type:string;

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

      this.minPrice = this.priceValue;
      this.maxPrice = this.priceHighValue ;
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
      this.minPartialPaymentPrice=this.partialPaymentValue;

      this.partialPaymentHighValue =
        this.filterFlightDetails.partial_payment_price_range.max_price ? this.filterFlightDetails.partial_payment_price_range.max_price : 0;

      this.maxPartialPaymentPrice =this.partialPaymentHighValue;
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

  /**
   * Filter by price range
   * @param event 
   */
  fliterByPrice(event){
    this.minPrice=event.value;
    this.maxPrice=event.highValue; 
    this.filterFlights();
  }

  /**
   * Filetr by airlines
   * @param event 
   */
  filterByAirline(event){

    if(event.target.checked===true){
      this.airLines.push(event.target.value)
    }
    else{
      this.airLines = this.airLines.filter(airline=>{

        return airline!=event.target.value;
      })
    }
    this.filterFlights();
  }

  fliterByPartialPayment(event){
    this.minPartialPaymentPrice=event.value;
    this.maxPartialPaymentPrice=event.highValue; 
    this.filterFlights();
  }

  filterByTimeSlot(event,journey,type,slot){
    
    let slotValue:any={
      value : slot,
      journey : journey,
      type : type
    }
    if(event.target.checked){

      this.timeRangeSlots.push(slotValue);
    }
    else{

      this.timeRangeSlots = this.timeRangeSlots.filter(slot=>{
          //console.log(JSON.stringify(slot),slotValue)
          return JSON.stringify(slot)!==JSON.stringify(slotValue);
      })
    }
    console.log(this.timeRangeSlots)
    this.filterFlights();
  }

  /**
   * Comman function to process filtration of flight
   */
  filterFlights(){

    let filterdFlights=this.filterFlightDetails.items;

    /* Filter flight based on min & max price */
    if(this.minPrice && this.maxPrice){
      
      filterdFlights=filterdFlights.filter(item=>{

        return item.selling_price>=this.minPrice && item.selling_price<=this.maxPrice;
      })
    }

    /* Filter flight based on airline selected */
    if(this.airLines.length){
      filterdFlights=filterdFlights.filter(item=>{

        return this.airLines.includes(item.airline);
      }) 
    }

    /* Filter flight based on min & max partial payment price */
    if(this.minPartialPaymentPrice && this.maxPartialPaymentPrice){
      
      filterdFlights=filterdFlights.filter(item=>{

        return item.start_price>=this.minPartialPaymentPrice && item.start_price<=this.maxPartialPaymentPrice;
      })
    }

    if(this.timeRangeSlots.length){
      filterdFlights=filterdFlights.filter(item=>{
          console.log(JSON.stringify(this.timeRangeSlots))
          let journeyIndex;
          let typeIndex;
          let timeValue;
          for(let slot of this.timeRangeSlots){

              journeyIndex = slot.journey=='outbound'?0:1;
              typeIndex =slot.type=='departure'?0:item.routes[journeyIndex].stops.length-1;
              timeValue =slot.type=='departure'?'departure_time':'arrival_time';

              if(
                moment(item.routes[journeyIndex].stops[typeIndex][timeValue],'hh:mm A').
                  isBetween(
                    moment(slot.value.from_time,'hh:mm a'),
                    moment(slot.value.to_time,'hh:mm a'))
              ){
                  return true;
              }
          }
      })
    }

    console.log("filterdFlights",filterdFlights)
    this.filterFlight.emit(filterdFlights); 
  }
}
