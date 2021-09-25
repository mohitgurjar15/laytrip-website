import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
declare var $: any;
import * as moment from 'moment'
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { FlightService } from 'src/app/services/flight.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-flight-price-slider',
  templateUrl: './flight-price-slider.component.html',
  styleUrls: ['./flight-price-slider.component.scss']
})
export class FlightPriceSliderComponent implements OnInit {
  @ViewChild('slickModal', { static: false }) slickModal: SlickCarouselComponent;

  flexibleNotFound: boolean = false;
  departureDate: string;
  departure_date: string;
  arrivalDate: string;
  trip: string;
  departure: string;
  arrival: string;
  class: string;
  adult: number;
  child: number;
  infant: number;
  transformValue:number=0;
  minDate:string='';

  slideConfig = {
    dots: false,
    arrows: false,
    autoplay:false,
    infinite: true,
    speed: 300,
    slidesToShow: 7,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 7,
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
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  }

  @Input() flexibleLoading: boolean = false;
  @Input() dates = [];
  flexibleFullPaymentLength = 0;
  singleFlexLoader: boolean = false;

  constructor(
    private commonFunction: CommonFunction,
    private route: ActivatedRoute,
    private flightService: FlightService,
    private translate: TranslateService
  ) {
    this.departureDate = this.route.snapshot.queryParams['departure_date'];
    this.departureDate = this.commonFunction.convertDateFormat(this.departureDate, 'YYYY-MM-DD')
    this.trip = this.route.snapshot.queryParams['trip'];
    if (this.trip == 'roundtrip') {
      this.arrivalDate = this.route.snapshot.queryParams['arrival_date'];
      this.arrivalDate = this.commonFunction.convertDateFormat(this.arrivalDate, 'YYYY-MM-DD')
    }
    this.departure = this.route.snapshot.queryParams['departure'];
    this.arrival = this.route.snapshot.queryParams['arrival'];
    this.class = this.route.snapshot.queryParams['class'];
    this.adult = this.route.snapshot.queryParams['adult'];
    this.child = this.route.snapshot.queryParams['child'];
    this.infant = this.route.snapshot.queryParams['infant'];
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['dates'].currentValue.length) {
      this.flipDates(this.dates)
      //this.dates.unshift({"date":"09/10/2020","net_rate":30.15,"price":31.05,"unique_code":"4f4db0e337ddc6cd9057fad6a58b01e0","start_price":0,"secondary_start_price":0,"isPriceInInstallment":false,"selling_price":31.05})
      //this.dates.push({"date":"07/10/2021","net_rate":30.15,"price":31.05,"unique_code":"4f4db0e337ddc6cd9057fad6a58b01e0","start_price":0,"secondary_start_price":0,"isPriceInInstallment":false,"selling_price":31.05})
    }
    /* if (changes['flexibleLoading'].currentValue) {
      console.log(this.flexibleLoading)
    } */
    //this.minDate=moment(this.dates[0].date, 'DD/MM/YYYY').format('YYYY-MM-DD');

  }
 
 

  flipDates(dates) {
    let result = []
    let sourceIndex = dates.findIndex(date => { return moment(date.date, "DD/MM/YYYY").format("YYYY-MM-DD") === this.route.snapshot.queryParams['departure_date'] });

    let targetIndex = 3;
    if (window.screen.width <= 600) {
      targetIndex = 1;
    }
    let startIndex = sourceIndex - targetIndex;

    for (let i = startIndex; i < dates.length; i++) {
      result.push(dates[i])
    }

    for (let i = 0; i < startIndex; i++) {
      result.push(dates[i])
    }

    this.dates = result;
    this.dates = this.dates.filter(function (element) {
      return element !== undefined;
    });

    this.flexibleFullPaymentLength = this.dates.filter(date => date.isPriceInInstallment == false).length;
  }

  arrayRotate(arr, count) {
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));
    return arr;
  }

  getPrice(item) {
    let price;
    let labelClass = 'price_availabe';
    if (item.isPriceInInstallment) {
      if (item.start_price < 5) {
        price = '5.00';
      }
      else {
        price = item.start_price;
      }
    } else {
      price = item.selling_price;
      labelClass = price > 0 ? 'full_payment' : 'price_unavailabe';
    }

    // Author: xavier | 2021/9/8
    // Description: Translate 'Flights Unavailable'
    let msg: string = this.translate.instant('flights_unavailable');
    
    return { price: price > 0 ? '$' + parseFloat(price).toFixed(2) : msg, className : labelClass};
  }

  getFlexibleArivalDate(date) {
    var startDate = moment(this.departureDate, 'MMM DD, YYYY');
    var endDate = moment(this.arrivalDate, 'MMM DD, YYYY');
    var intervalDay = endDate.diff(startDate, 'days');
    var arrivalDate = moment(date, "DD/MM/YYYY").add(intervalDay, 'days');
    return this.commonFunction.convertDateFormat(arrivalDate, "DD/MM/YYYY");
  }

  checkDateValidation(date) {
    let juneDate: any = moment('2021-06-01').format('YYYY-MM-DD');
    var selectedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if (selectedDate < juneDate) {
      return true;
    } else {
      return false;
    }
  }

  prev() {
    
    let requestDate = moment(this.dates[0].date, 'DD/MM/YYYY').subtract('1', 'days').format('YYYY-MM-DD');
    let index = this.dates.findIndex(x => x.date == requestDate);
    var begin = moment(requestDate);
    var end = moment().add(2, 'days');
    
    if (index == -1 && (moment(begin).isAfter(end, 'days') || moment(begin).isSame(end, 'days')))  {
      /* if(moment(requestDate).isAfter(this.minDate)){
        this.transformValue+=100;
      } */
      this.minDate = moment(this.minDate,'YYYY-MM-DD').subtract('1','days').format("YYYY-MM-DD");
      this.getFlexiableDate(requestDate,'prev')
    }
    
  }

  next() {
    let requestDate = moment(this.dates.slice(-1)[0].date,'DD/MM/YYYY').add('+1','days').format('YYYY-MM-DD');
    this.minDate = moment(this.minDate,'YYYY-MM-DD').add('+1','days').format("YYYY-MM-DD");
    console.log("this.minDate",this.minDate)
    let index = this.dates.findIndex(x=>x.date ==requestDate);
    if(index==-1){
      this.transformValue-=100;
      this.getFlexiableDate(requestDate,'next')
    }
  }

  getFlexiableDate(requestDate,direction){
    console.log(direction,"===")
    if (this.trip == 'oneway') {
      this.singleFlexLoader=true;
      var payload = {
        source_location: this.departure,
        destination_location: this.arrival,
        departure_date: moment(this.dates.slice(-1)[0].date,'DD/MM/YYYY').format('YYYY-MM-DD'),
        flight_class: this.class,
        adult_count: this.adult,
        child_count: this.child,
        infant_count: this.infant,
        request_date: requestDate,
      };
      this.flightService.getFlightFlexibleDates(payload).subscribe((res: any) => {
        if (res) {
          this.singleFlexLoader = false;
          if(direction=='next'){
            this.dates.push(res[0]);
          }
          else{
            this.dates.unshift(res[0])
          }
        }
      }, err => {
        this.singleFlexLoader = false;
      });
    }
    else{
        this.singleFlexLoader=true;
        var roundtripPayLoad = {
          source_location: this.departure,
          destination_location: this.route.snapshot.queryParams['arrival'],
          departure_date: this.route.snapshot.queryParams['departure_date'],
          arrival_date:this.route.snapshot.queryParams['arrival_date'],
          flight_class: this.class,
          adult_count: this.adult,
          child_count: this.child,
          infant_count: this.infant,
          request_date: requestDate,
        };
        this.flightService.getFlightFlexibleDatesRoundTrip(roundtripPayLoad).subscribe((res: any) => {
          if (res) {
            this.singleFlexLoader = false;
            if(direction=='next'){
              this.dates.push(res[0]);
            }
            else{
              this.dates.unshift(res[0])
            }
          }
        }, err => {
          this.singleFlexLoader = false;
        });
    }
  }

}
