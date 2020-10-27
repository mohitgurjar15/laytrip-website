import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
declare var $: any;

@Component({
  selector: 'app-flight-price-slider',
  templateUrl: './flight-price-slider.component.html',
  styleUrls: ['./flight-price-slider.component.scss']
})
export class FlightPriceSliderComponent implements OnInit {


  ​flexibleLoading:boolean=false;
  ​flexibleNotFound:boolean=false;
  departureDate:string;
  departure_date:string;
  trip:string;
  departure:string;
  arrival:string;
  class:string;
  adult:number;
  child:number;
  infant:number;

  @Input() dates:[]=[];

  constructor(
    private commonFunction:CommonFunction,
    private route:ActivatedRoute
  ) { 
    this.departureDate = this.route.snapshot.queryParams['departure_date'];
    this.departureDate = this.commonFunction.convertDateFormat(this.departureDate,'YYYY-MM-DD')
    this.trip      = this.route.snapshot.queryParams['trip'];
    this.departure = this.route.snapshot.queryParams['departure'];
    this.arrival = this.route.snapshot.queryParams['arrival'];
    this.class = this.route.snapshot.queryParams['class'];
    this.adult = this.route.snapshot.queryParams['adult'];
    this.child = this.route.snapshot.queryParams['child'];
    this.infant = this.route.snapshot.queryParams['infant'];
  }

  ngOnInit() {
    this.loadJquery();
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
              slidesToShow: count>=1?1:count,
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
      setTimeout(()=>{this.loadJquery();},100)
    }
  }
}
