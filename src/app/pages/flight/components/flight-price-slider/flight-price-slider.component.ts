import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
declare var $: any;
import * as moment from 'moment'

@Component({
  selector: 'app-flight-price-slider',
  templateUrl: './flight-price-slider.component.html',
  styleUrls: ['./flight-price-slider.component.scss']
})
export class FlightPriceSliderComponent implements OnInit {

  ​flexibleNotFound:boolean=false;
  departureDate:string;
  departure_date:string;
  arrivalDate:string;
  trip:string;
  departure:string;
  arrival:string;
  class:string;
  adult:number;
  child:number;
  infant:number;

  slides = [
    {img: "http://placehold.it/350x150/000000"},
    {img: "http://placehold.it/350x150/111111"},
    {img: "http://placehold.it/350x150/333333"},
    {img: "http://placehold.it/350x150/666666"},
    {img: "http://placehold.it/350x150/000000"},
    {img: "http://placehold.it/350x150/111111"},
    {img: "http://placehold.it/350x150/333333"},
    {img: "http://placehold.it/350x150/666666"}
  ];
  slideConfig = {"slidesToShow": 7, "slidesToScroll": 1};

  @Input() flexibleLoading:boolean=false;
  @Input() dates=[];

  constructor(
    private commonFunction:CommonFunction,
    private route:ActivatedRoute
  ) { 
    this.departureDate = this.route.snapshot.queryParams['departure_date'];
    this.departureDate = this.commonFunction.convertDateFormat(this.departureDate,'YYYY-MM-DD')
    this.trip      = this.route.snapshot.queryParams['trip'];
    if(this.trip == 'roundtrip'){
      this.arrivalDate = this.route.snapshot.queryParams['arrival_date'];
      this.arrivalDate = this.commonFunction.convertDateFormat(this.arrivalDate,'YYYY-MM-DD')
    }
    this.departure = this.route.snapshot.queryParams['departure'];
    this.arrival = this.route.snapshot.queryParams['arrival'];
    this.class = this.route.snapshot.queryParams['class'];
    this.adult = this.route.snapshot.queryParams['adult'];
    this.child = this.route.snapshot.queryParams['child'];
    this.infant = this.route.snapshot.queryParams['infant'];
  }

  ngOnInit() {
   // this.loadJquery();
  }
  breakpoint(e) {
    console.log('breakpoint', e);
  }
 

  loadJquery() {
    // Start Flight Price By Day slider js

    if(this.dates.length>0){
      let count = this.dates.length;
      $('.price_day_slider').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: count>=7?7:count,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: count>=6?6:count,
              slidesToScroll: 1,
              infinite: true,
              dots: false
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: count>=3?3:count,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: count>=1?3:count,
              slidesToScroll: 1
            }
          }
        ]
      });
      // Close Flight Price By Day slider js
    }
    
  }

  ngOnChanges(changes: SimpleChanges) {
   
    if(changes['dates'].currentValue.length){
    //  setTimeout(()=>{this.loadJquery();},100)
      /* if(this.trip == 'oneway'){
        this.flipDates(this.dates)
      }
      else{
        if(window.screen.width<=600){
          let targetIndex=2;
          this.dates = this.arrayRotate(this.dates,targetIndex);
          console.log("this.dates",this.dates)
        }
      } */
      this.flipDates(this.dates)
    }
  }

  flipDates(dates){
    let result =[]
    let sourceIndex = dates.findIndex(date=>{ return moment(date.date,"DD/MM/YYYY").format("YYYY-MM-DD") === this.route.snapshot.queryParams['departure_date'] })
    let targetIndex = 3;
    if(window.screen.width<=600){
      targetIndex=1;
      /* targetIndex=dates.length-sourceIndex+1;
      this.dates = this.rotateArray1(dates,targetIndex) */
    }
    let startIndex=sourceIndex-targetIndex;

    for(let i=startIndex; i<dates.length;i++){
      result.push(dates[i])
    }

    for(let i=0; i<startIndex;i++){
      result.push(dates[i])
    }

    this.dates = result;
    /* else{
      this.dates = this.arrayRotate(this.dates,targetIndex);
    } */
    /* if(targetIndex > sourceIndex){

      targetIndex=5;
      for(let i=targetIndex; i < this.dates.length; i++){
        result.push(this.dates[i])
      }
      for(let i=0; i < targetIndex; i++){
        result.push(this.dates[i])
      }

    }
    else{

      for(let i=targetIndex; i <= sourceIndex; i++){
        
        result.push(this.dates[i])
      }
      
      for(let i=sourceIndex+1; i < this.dates.length; i++){
        result.push(this.dates[i])
      }
      
      for(let i=0; i < targetIndex; i++){
        result.push(this.dates[i])
      }

      
    }
    this.dates = result; */
  }

  rotateArray1(dates, k) {

    for (let i = 0; i < k; i++) {
        dates.unshift(dates.pop());
    }
  
    return dates;
  }

  arrayRotate(arr, count) {
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));
    return arr;
  }

  getPrice(item){

    let price;
    if(item.secondary_start_price>0){
      if(item.secondary_start_price<5){
        price='5.00';
      }
      else{
        price = item.secondary_start_price;
      }
    }
    else{
      price = item.price
    }
    return price;
  }

  getFlexibleArivalDate(date){
    var startDate = moment(this.departureDate,'MMM DD, YYYY');
    var  endDate = moment(this.arrivalDate,'MMM DD, YYYY');  
    var intervalDay = endDate.diff(startDate,'days');
    var arrivalDate = moment(date, "DD/MM/YYYY").add(intervalDay, 'days');
    return this.commonFunction.convertDateFormat(arrivalDate,"DD/MM/YYYY");
  } 

  checkDateValidation(date){
    let  juneDate :any =  moment('2021-06-01').format('YYYY-MM-DD');
    var selectedDate = moment(date,'DD/MM/YYYY').format('YYYY-MM-DD');
    if(selectedDate < juneDate ){
      return true;
    } else {    
      return false;
    }

  }
}
