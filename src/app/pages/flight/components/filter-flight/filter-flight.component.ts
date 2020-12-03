import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
declare var $: any;
import { Options } from 'ng5-slider';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-filter-flight',
  templateUrl: './filter-flight.component.html',
  styleUrls: ['./filter-flight.component.scss']
})
export class FilterFlightComponent implements OnInit, OnDestroy {

  @Input() filterFlightDetails: any;
  @Input() isResetFilter:string;
  @Output() filterFlight=new EventEmitter();
  depatureTimeSlot;
  arrivalTimeSlot;
  flightStops;
  airlineList;
  arrivalTimeSlotCityName;
  departureTimeSlotCityName;
  currency;
  showMinAirline:number=4;
  airLineCount:number;
  s3BucketUrl = environment.s3BucketUrl;
  form: FormGroup;
  priceSlider: FormGroup = new FormGroup({
    price: new FormControl([20, 80])
  });
  partialPriceSlider: FormGroup = new FormGroup({
    partial_price: new FormControl([20, 80])
  });
  isShowoutbound:boolean=false;
  isShowinbound:boolean=false;

  /* Varibale for filter */
  minPrice:number;
  maxPrice:number;
  airLines=[];
  minPartialPaymentPrice:number;
  maxPartialPaymentPrice:number;
  outBoundDepartureTimeRangeSlots=[];
  outBoundArrivalTimeRangeSlots=[];
  inBoundDepartureTimeRangeSlots=[];
  inBoundArrivalTimeRangeSlots=[];
  outBoundStops=[];
  inBoundStops=[];
  /* End of filter variable */

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
      return `${currency.symbol}${value}`;
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
      return `${currency.symbol}${value}`;
    }
  };

  subscriptions: Subscription[] = [];


  constructor(
  ) { }

  ngOnInit() {
    this.currency = JSON.parse(this._currency);
    
    if (this.filterFlightDetails && this.filterFlightDetails.price_range) {
      // FOR FILTER FLIGHT - PRICE & PARTIAL PRICE
      this.priceValue = this.filterFlightDetails.price_range.min_price ? this.filterFlightDetails.price_range.min_price : 0;
      this.priceHighValue = this.filterFlightDetails.price_range.max_price ? this.filterFlightDetails.price_range.max_price : 0;
      this.priceSlider.controls.price.setValue([Math.floor(this.priceValue),Math.ceil(this.priceHighValue)])
      
      this.minPrice = this.priceValue;
      this.maxPrice = this.priceHighValue ;
      this.priceOptions.floor =
        parseInt(this.filterFlightDetails.price_range.min_price) ?
          parseInt(this.filterFlightDetails.price_range.min_price) : 0;
      this.priceOptions.ceil =
        parseInt(this.filterFlightDetails.price_range.max_price) ?
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
        parseInt(this.filterFlightDetails.partial_payment_price_range.min_price) ?
          parseInt(this.filterFlightDetails.partial_payment_price_range.min_price) : 0;
      this.partialPaymentOptions.ceil =
        parseInt(this.filterFlightDetails.partial_payment_price_range.max_price) ?
          parseInt(this.filterFlightDetails.partial_payment_price_range.max_price) : 0;

      this.partialPriceSlider.controls.partial_price.setValue([Math.floor(this.partialPaymentValue),Math.ceil(this.partialPaymentHighValue)])
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
      this.airLineCount = this.filterFlightDetails.airline_list.length+1; 
      this.airlineList = this.filterFlightDetails.airline_list;
      this.airlineList.forEach(element => {
        return element.isChecked =false;  
      });
    }

    if (this.filterFlightDetails && this.filterFlightDetails.items) {
      this.filterFlightDetails.items.forEach(element => {
        this.departureTimeSlotCityName = element.departure_info.city;
        this.arrivalTimeSlotCityName = element.arrival_info.city;
      });
    }

    this.loadJquery();
  }

  toggleOutbound(){
    this.isShowoutbound= !this.isShowoutbound;
  }

  toggleInbound(){
    this.isShowinbound = !this.isShowinbound;
  }

  loadJquery(){
    //Start REsponsive Fliter js
    $(window).on("scroll", function () {
      if ($(window).width() < 1200) {
          if ($(this).scrollTop() < 10) {
              $('#responsive_filter').slideUp("slow");
          }

          if ($(this).scrollTop() > 10) {
              $('#responsive_filter').slideDown("slow");
          }

          var scrollHeight = $(document).height();
          var scrollPosition = $(window).height() + $(window).scrollTop();
          if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
              $('#responsive_filter').slideUp("slow");
          }
      } else {
          $('#responsive_filter').hide("slow");
      }
    });
    var sheight = $(window).scrollTop();
    var swidth= $(window).width();
    if (sheight > 10 && swidth<991) {
      $('#responsive_filter').slideDown("slow");
    }
    $(".responsive_filter_btn").click(function () {
      $("#responsive_filter_show").slideDown("slow");
      $("body").addClass('overflow-hidden');
    });

    $(".filter_close > a").click(function () {
      $("#responsive_filter_show").slideUp("slow");
      $("body").removeClass('overflow-hidden');
    });
    //Close REsponsive Fliter js
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleAirlines(type){
    this.showMinAirline = (type==='more')?500:4;
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
  filterByAirline(event,index){

    if(event.target.checked===true){
      this.airLines.push(event.target.value)
      
    }
    else{
      this.airLines = this.airLines.filter(airline=>{

        return airline!=event.target.value;
      })
    }

    this.airlineList[index].isChecked=!this.airlineList[index].isChecked;
    this.filterFlights();
  }

  fliterByPartialPayment(event){
    this.minPartialPaymentPrice=event.value;
    this.maxPartialPaymentPrice=event.highValue; 
    this.filterFlights();
  }

  filterByOutBoundDepartureTimeSlot(event,journey,type,slot){
    
    let slotValue:any={
      value : slot,
      journey : journey,
      type : type
    }
    if(event.target.checked){

      this.outBoundDepartureTimeRangeSlots.push(slotValue);
    }
    else{

      this.outBoundDepartureTimeRangeSlots = this.outBoundDepartureTimeRangeSlots.filter(slot=>{
          return JSON.stringify(slot)!==JSON.stringify(slotValue);
      })
    }
    this.filterFlights();
  }

  filterByOutBoundArrivalTimeSlot(event,journey,type,slot){
    
    let slotValue:any={
      value : slot,
      journey : journey,
      type : type
    }
    if(event.target.checked){

      this.outBoundArrivalTimeRangeSlots.push(slotValue);
    }
    else{

      this.outBoundArrivalTimeRangeSlots = this.outBoundArrivalTimeRangeSlots.filter(slot=>{
          return JSON.stringify(slot)!==JSON.stringify(slotValue);
      })
    }
    this.filterFlights();
  }

  filterByInBoundDepartureTimeSlot(event,journey,type,slot){
    
    let slotValue:any={
      value : slot,
      journey : journey,
      type : type
    }
    if(event.target.checked){

      this.inBoundDepartureTimeRangeSlots.push(slotValue);
    }
    else{

      this.inBoundDepartureTimeRangeSlots = this.inBoundDepartureTimeRangeSlots.filter(slot=>{
          return JSON.stringify(slot)!==JSON.stringify(slotValue);
      })
    }

    this.filterFlights();
  }

  filterByInBoundArrivalTimeSlot(event,journey,type,slot){
    
    let slotValue:any={
      value : slot,
      journey : journey,
      type : type
    }
    if(event.target.checked){

      this.inBoundArrivalTimeRangeSlots.push(slotValue);
    }
    else{

      this.inBoundArrivalTimeRangeSlots = this.inBoundArrivalTimeRangeSlots.filter(slot=>{
          return JSON.stringify(slot)!==JSON.stringify(slotValue);
      })
    }

    this.filterFlights();
  }
  
  filterByDepartureStop(event,stopCount){

    if(event.target.checked===true){
      this.outBoundStops.push(stopCount)
    }
    else{
      this.outBoundStops=this.outBoundStops.filter(stop=>{
          return stop!=stopCount
      })
    }
    this.filterFlights();
  }
  
  filterByArrivalStop(event,stopCount){

    if(event.target.checked===true){
      this.inBoundStops.push(stopCount)
    }
    else{
      this.inBoundStops=this.inBoundStops.filter(stop=>{
          return stop!=stopCount
      })
    }

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

        return item.secondary_start_price>=this.minPartialPaymentPrice && item.secondary_start_price<=this.maxPartialPaymentPrice;
      })
    }

    /* Filter based on outbound departure time slot */
    if(this.outBoundDepartureTimeRangeSlots.length){
      filterdFlights=filterdFlights.filter(item=>{
          let journeyIndex;
          let typeIndex;
          let timeValue;
          for(let slot of this.outBoundDepartureTimeRangeSlots){

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

    /* Filter based on outbound arrival time slot */
    if(this.outBoundArrivalTimeRangeSlots.length){
      filterdFlights=filterdFlights.filter(item=>{
          let journeyIndex;
          let typeIndex;
          let timeValue;
          for(let slot of this.outBoundArrivalTimeRangeSlots){

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

    /* Filter based on inbound departure time slot */
    if(this.inBoundDepartureTimeRangeSlots.length){
      filterdFlights=filterdFlights.filter(item=>{
          let journeyIndex;
          let typeIndex;
          let timeValue;
          for(let slot of this.inBoundDepartureTimeRangeSlots){

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

    /* Filter based on inbound arrival time slot */
    if(this.inBoundArrivalTimeRangeSlots.length){
      filterdFlights=filterdFlights.filter(item=>{
          let journeyIndex;
          let typeIndex;
          let timeValue;
          for(let slot of this.inBoundArrivalTimeRangeSlots){

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

    if(this.outBoundStops.length){
      filterdFlights=filterdFlights.filter(item=>{

          return this.outBoundStops.includes(item.stop_count);

      })
    }

    if(this.inBoundStops.length){
      filterdFlights=filterdFlights.filter(item=>{

          return this.inBoundStops.includes(item.inbound_stop_count);

      })
    }

    this.filterFlight.emit(filterdFlights); 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isResetFilter']) {
      this.isResetFilter = changes['isResetFilter'].currentValue;
      this.minPrice=this.filterFlightDetails.price_range.min_price;
      this.maxPrice=this.filterFlightDetails.price_range.max_price;
      this.airLines=[];
      this.minPartialPaymentPrice=0;
      this.maxPartialPaymentPrice=0;
      this.outBoundDepartureTimeRangeSlots=[];
      this.outBoundArrivalTimeRangeSlots=[];
      this.inBoundDepartureTimeRangeSlots=[];
      this.inBoundArrivalTimeRangeSlots=[];
      this.outBoundStops=[];
      this.inBoundStops=[];

      //Reset Price
      this.priceSlider.reset({price: [Math.floor(this.filterFlightDetails.price_range.min_price),Math.ceil(this.filterFlightDetails.price_range.max_price)]});

      //Reset partial payment
      this.partialPriceSlider.reset({partial_price: [Math.floor(this.filterFlightDetails.partial_payment_price_range.min_price),Math.ceil(this.filterFlightDetails.partial_payment_price_range.max_price)]});

      //Reset airlines
      if(typeof this.airlineList!='undefined' && this.airlineList.length){

        this.airlineList.forEach(element => {
          return element.isChecked=false;
        });
      }

      $("input:checkbox").prop('checked', false);
      this.filterFlights();
    }
  }
}
