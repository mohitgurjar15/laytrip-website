import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';
declare var $: any;
import * as moment from 'moment'
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { FlightService } from 'src/app/services/flight.service';

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
  flexibleInstallmentLength = 0;
  singleFlexLoader: boolean = false;


  constructor(
    private commonFunction: CommonFunction,
    private route: ActivatedRoute,
    private flightService: FlightService

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
    }
    /* if (changes['flexibleLoading'].currentValue) {
      console.log(this.flexibleLoading)
    } */
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

    this.flexibleInstallmentLength =  this.dates.filter(date => date.isPriceInInstallment == true).length;
  }

  arrayRotate(arr, count) {
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));
    return arr;
  }

  getPrice(item) {

    let price;
    if (item.secondary_start_price > 0) {
      if (item.secondary_start_price < 5) {
        price = '5.00';
      }
      else {
        price = item.secondary_start_price;
      }
    }
    else {
      price = item.price
    }
    return { price: price > 0 ? '$' + price.toFixed(2) : 'Flights Unavailable', className: price > 0 ? 'price_availabe' : 'price_unavailabe' };
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
    this.slickModal.slickPrev();
  }

  next(dates) {
    if (this.trip == 'oneway') {
      this.singleFlexLoader = true;
      setTimeout(() => {
        this.slickModal.slickNext();
      }, 1000);
      var payload = {
        source_location: this.departure,
        destination_location: this.arrival,
        departure_date: moment(dates.slice(-1)[0].date,'DD/MM/YYYY').format('YYYY-MM-DD'),
        flight_class: this.class,
        adult_count: this.adult,
        child_count: this.child,
        infant_count: this.infant,
        request_date: moment(dates.slice(-1)[0].date, 'DD/MM/YYYY').add(1, 'days').format('YYYY-MM-DD'),
      };
      this.flightService.getFlightFlexibleDates(payload).subscribe((res: any) => {
        if (res) {
          this.singleFlexLoader = false;
          // this.slickModal.slickNext();
          this.dates.push(res[0]);          
        }
      }, err => {
        this.singleFlexLoader = false;
      });
    }
    
  }

}
