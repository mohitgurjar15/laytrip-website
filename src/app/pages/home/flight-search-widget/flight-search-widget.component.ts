import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../../model/module.model';
import { environment } from '../../../../environments/environment';
import { airports } from '../../flight/airports';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { CommonFunction } from '../../../_helpers/common-function';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-flight-search-widget',
  templateUrl: './flight-search-widget.component.html',
  styleUrls: ['./flight-search-widget.component.scss']
})
export class FlightSearchWidgetComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @ViewChild('dateFilter', /* TODO: add static flag */ undefined) private dateFilter: any;
  rangeDates: Date[];
  modules: Module[];
  moduleList: any = {};
  switchBtnValue = false;
  isRoundTrip: boolean = false;
  flightSearchForm: FormGroup;
  flightSearchFormSubmitted = false;
  // DATE OF FROM_DESTINATION & TO_DESTINATION
  fromSearch = airports['JFK'];
  //fromDestinationCode = this.fromSearch.code;
  //departureCity = this.fromSearch.city;
  //departureAirportCountry =`${this.fromSearch.code}, ${this.fromSearch.country}`
  //fromAirport = airports[this.fromDestinationCode];
  countryCode: string;

  toSearch=airports['PUJ'];
  //toDestinationCode = this.toSearch.code;
  //arrivalCity = this.toSearch.city;
  //arrivalAirportCountry = `${this.toSearch.code}, ${this.toSearch.country}`;
  //toAirport = airports[this.toDestinationCode];

  locale = {
    format: 'MM/DD/YYYY',
    displayFormat: 'MM/DD/YYYY'
  };

  flightDepartureMinDate;
  flightReturnMinDate;

  departureDate = new Date(moment().add(31, 'days').format("MM/DD/YYYY"));
  returnDate = new Date(moment().add(38, 'days').format("MM/DD/YYYY"))
  
  totalPerson: number = 1;

  searchFlightInfo =
    {
      trip: 'oneway',
      departure: this.fromSearch.code,
      arrival: this.toSearch.code,
      departure_date: moment().add(1, 'months').format("YYYY-MM-DD"),
      arrival_date: '',
      class: 'Economy',
      adult: 1,
      child: null,
      infant: null
    };

  searchedValue = [];

  constructor(
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) {

    this.fromSearch['display_name'] = `${this.fromSearch.city},${this.fromSearch.country},(${this.fromSearch.code}),${this.fromSearch.name}`;
    this.toSearch['display_name'] = `${this.toSearch.city},${this.toSearch.country},(${this.toSearch.code}),${this.toSearch.name}`;
    this.flightSearchForm = this.fb.group({
      fromDestination: ['', [Validators.required]],
      toDestination: ['', [Validators.required]],
      departureDate: [[Validators.required]],
      returnDate: [[Validators.required]]
    });

    this.flightDepartureMinDate = new Date();
    this.flightReturnMinDate = this.departureDate;
    this.countryCode = this.commonFunction.getUserCountry();
    this.rangeDates = [this.departureDate, this.returnDate];
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.countryCode = this.commonFunction.getUserCountry();

    this.route.queryParams.subscribe(params => {
       if(Object.keys(params).length > 0){      
          this.fromSearch = airports[params['departure']];
          //this.fromDestinationCode = this.fromSearch.code;
          //this.departureCity = this.fromSearch.city;
          //this.departureAirportCountry =`${this.fromSearch.code}, ${this.fromSearch.country}`
          //this.fromAirport = airports[this.fromDestinationCode];

          this.toSearch = airports[params['arrival']];
          //this.toDestinationCode = this.toSearch.code;
          //this.arrivalCity = this.toSearch.city;
          //this.arrivalAirportCountry = `${this.toSearch.code}, ${this.toSearch.country}`;
          //this.toAirport = airports[this.toDestinationCode];
          this.toggleOnewayRoundTrip(params['trip']);
          
          this.searchFlightInfo.class = params['class'];

          this.departureDate = new Date(params['departure_date'])
          this.returnDate = new Date(params['arrival_date'])
          this.rangeDates = [this.departureDate, this.returnDate];

      }
    });


  }


  destinationChangedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      //this.fromDestinationCode = event.value.code;
      this.fromSearch = event.value;
      //this.departureCity = this.fromSearch.city;
      //this.departureAirportCountry = `${this.fromSearch.code}, ${this.fromSearch.country}`;
      this.searchedValue.push({ key: 'fromSearch', value: this.fromSearch });
    } else if (event && event.key && event.key === 'toSearch') {
      this.toSearch = event.value;
      //this.arrivalCity = this.toSearch.city;
      //this.arrivalAirportCountry = `${this.toSearch.code}, ${this.toSearch.country}`;
      this.searchedValue.push({ key: 'toSearch', value: this.toSearch });
    }
    this.searchFlightInfo.departure = this.fromSearch.code;
    this.searchFlightInfo.arrival = this.toSearch.code;
  }

  getDateWithFormat(date) {
    this.searchFlightInfo.departure_date = this.commonFunction.parseDateWithFormat(date).departuredate;
    // this.searchFlightInfo.arrival_date = this.commonFunction.parseDateWithFormat(date).returndate;
  }

  changeTravellerInfo(event) {
    this.searchFlightInfo.adult = event.adult;
    this.searchFlightInfo.child = event.child;
    this.searchFlightInfo.infant = event.infant;
    this.totalPerson = event.totalPerson;
    this.searchedValue.push({ key: 'travellers', value: event });
  }

  changeEconomyInfo(event){
    this.searchFlightInfo.class = event;
  }

  searchFlights() {
    this.flightSearchFormSubmitted = true;
    let queryParams: any = {};
    queryParams.trip = this.isRoundTrip ? 'roundtrip' : 'oneway';
    queryParams.departure = this.searchFlightInfo.departure;
    queryParams.arrival = this.searchFlightInfo.arrival;
    queryParams.departure_date = moment(this.departureDate).format('YYYY-MM-DD');
    if (this.isRoundTrip === true) {
      queryParams.arrival_date = moment(this.returnDate).format('YYYY-MM-DD');
    }
    queryParams.class = this.searchFlightInfo.class ? this.searchFlightInfo.class : 'Economy';
    queryParams.adult = this.searchFlightInfo.adult;
    queryParams.child = this.searchFlightInfo.child ? this.searchFlightInfo.child : 0;
    queryParams.infant = this.searchFlightInfo.infant ? this.searchFlightInfo.infant : 0;

    if (this.searchFlightInfo && this.totalPerson &&
      this.departureDate && this.searchFlightInfo.departure && this.searchFlightInfo.arrival) {
      localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
      this.router.navigate(['flight/search'], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
    }

  }

  toggleOnewayRoundTrip(type) {

    if (type === 'roundtrip') {
      this.isRoundTrip = true;
    } else {
      this.isRoundTrip = false;
    }
  }


  departureDateUpdate(date) {
    this.returnDate = new Date(date);
    this.flightReturnMinDate = new Date(date);
  }

  dateChange(type, direction) {

    if (type == 'departure') {
      if (direction === 'previous') {
        if (moment(this.departureDate).isAfter(moment(new Date()))) {
          this.departureDate = new Date(moment(this.departureDate).subtract(1, 'days').format('MM/DD/YYYY'))
        }
      }

      else {
        this.departureDate = new Date(moment(this.departureDate).add(1, 'days').format('MM/DD/YYYY'))
        if (moment(this.departureDate).isAfter(this.returnDate)) {
          this.returnDate = new Date(moment(this.returnDate).add(1, 'days').format('MM/DD/YYYY'))
        }
      }
      this.flightReturnMinDate = new Date(this.departureDate)
    }

    if (type == 'arrival') {

      if (direction === 'previous') {
        if (moment(this.departureDate).isBefore(this.returnDate)) {
          this.returnDate = new Date(moment(this.returnDate).subtract(1, 'days').format('MM/DD/YYYY'))
        }
      }
      else {
        this.returnDate = new Date(moment(this.returnDate).add(1, 'days').format('MM/DD/YYYY'))
      }
    }
  }

  swapAirport() {

    let temp = this.searchFlightInfo.departure;

    this.searchFlightInfo.departure = this.searchFlightInfo.arrival;
    this.searchFlightInfo.arrival = temp;

    /* let tempCity = this.departureCity;
    this.departureCity = this.arrivalCity;
    this.arrivalCity = tempCity; */

    let tempAirport = this.fromSearch;
    this.fromSearch = this.toSearch;
    this.toSearch = tempAirport;
  }

  returnDateUpdate(date) {
    // this is only for closing date range picker, after selecting both dates
    if (this.rangeDates[1]) { // If second date is selected
      this.dateFilter.hideOverlay();
    };
    if (this.rangeDates[0] && this.rangeDates[1]) {
       this.departureDate = this.rangeDates[0];
       this.flightDepartureMinDate = this.rangeDates[0];
       this.returnDate = this.rangeDates[1];
       this.rangeDates = [this.departureDate,this.returnDate];
      // this.checkOutDate = this.rangeDates[1];
      // this.checkOutMinDate = this.rangeDates[1];
      // this.searchHotelInfo.check_in = this.checkInDate;
      // this.searchHotelInfo.check_out = this.checkOutDate;
    }
  }

}
