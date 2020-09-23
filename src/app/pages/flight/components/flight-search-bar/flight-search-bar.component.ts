import { Component, OnInit,  Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonFunction } from '../../../../_helpers/common-function';
import { FlightService } from '../../../../services/flight.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-search-bar',
  templateUrl: './flight-search-bar.component.html',
  styleUrls: ['./flight-search-bar.component.scss']
})
export class FlightSearchBarComponent implements OnInit {

  @Output() searchBarInfo = new EventEmitter<any>();
  s3BucketUrl = environment.s3BucketUrl;
  flightSearchForm: FormGroup;


  // DATE OF FROM_DESTINATION & TO_DESTINATION
  isRoundTrip = false;
  searchFlightInfo =
    {
      trip: 'oneway',
      departure: '',
      arrival: '',
      departure_date:null,
      arrival_date: null,
      class: '',
      adult: 1,
      child: null,
      infant: null
    };

  switchBtnValue = false;
  tempSwapData =
    {
      leftSideValue: {},
      rightSideValue: {}
    };
  swapped = [];
  isSwap = false;
  swapError = '';
  selectedAirport = [];

  loadingDeparture = false;
  loadingArrival = false;
  data = [];
  placeHolder1 = 'New York';
  placeHolder2 = 'Los Angeles';
  defaultSelected = 'NY, United States';

  // tslint:disable-next-line: quotemark
  totalPerson: number = 1;

  airportDefaultDestValue;
  airportDefaultArrivalValue;
  selectedTraveller = {
    adultValue: 1,
    childValue: 0,
    infantValue: 0,
    totalPerson: 1,
    class: 'Economy',
  };
  searchedValue = [];
  arrivalCode: string;
  
  
  flightDepartureMinDate;
  flightReturnMinDate;
  departureDate;
  returnDate;

  constructor(
    public fb: FormBuilder,
    private flightService: FlightService,
    public commonFunction: CommonFunction,
    public cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {

    this.departureDate = this.commonFunction.convertDateFormat(this.route.snapshot.queryParams['departure_date'],'YYYY-MM-DD')
    this.returnDate =this.route.snapshot.queryParams['arrival_date'] ? this.commonFunction.convertDateFormat(this.route.snapshot.queryParams['arrival_date'],'YYYY-MM-DD'):this.commonFunction.convertDateFormat(moment(this.route.snapshot.queryParams['departure_date']).add(1,"days"),'YYYY-MM-DD') ;
    this.searchFlightInfo.departure = this.route.snapshot.queryParams['departure'];
    this.searchFlightInfo.arrival = this.route.snapshot.queryParams['arrival'];
    if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
      this.isRoundTrip = true;
    }
    this.arrivalCode = this.route.snapshot.queryParams['arrival'];
    this.flightSearchForm = this.fb.group({
      fromDestination: [[Validators.required]],
      toDestination: [[Validators.required]]
    });

    const selectedItem = localStorage.getItem('_fligh');
    if (selectedItem) {
      const info = JSON.parse(selectedItem);
      //info[1].value = airports[this.arrivalCode];
      info.forEach(res => {
        if (res && res.key === 'fromSearch') {
          this.data.push(res.value);
          this.airportDefaultDestValue = `${res.value.city}`;
          if (this.airportDefaultDestValue) {
            this.defaultSelected = '';
          }
        }
        if (res && res.key === 'toSearch') {
          res.value.display_name = `${res.value.city},${res.value.country},(${res.value.code}),${res.value.name}`;
          this.data.push(res.value);
          this.airportDefaultArrivalValue = `${res.value.city}`;
          if (this.airportDefaultArrivalValue) {
            this.defaultSelected = '';
          }
        }
      });

    }

    this.flightDepartureMinDate =new Date();
    this.flightReturnMinDate =new Date(this.departureDate);
  }

  ngOnInit() {
    this.searchFlightInfo.departure = this.route.snapshot.queryParams['departure'];
    this.searchFlightInfo.arrival = this.route.snapshot.queryParams['arrival'];
  }

  searchAirportDeparture(searchItem) {
    this.loadingDeparture = true;
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      this.data = response.map(res => {
        this.loadingDeparture = false;
        return {
          id: res.id,
          name: res.name,
          code: res.code,
          city: res.city,
          country: res.country,
          display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
        };
      });
    },
      error => {
        this.loadingDeparture = false;
      }
    );
  }

  searchAirportArrival(searchItem) {
    this.loadingArrival = true;
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      this.data = response.map(res => {
        this.loadingArrival = false;
        return {
          id: res.id,
          name: res.name,
          code: res.code,
          city: res.city,
          country: res.country,
          display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
        };
      });
    },
      error => {
        this.loadingArrival = false;
      }
    );
  }

  changeSearchDeparture(event) {
    if (event.term.length > 2) {
      this.searchAirportDeparture(event.term);
    }
  }

  changeSearchArrival(event) {
    if (event.term.length > 2) {
      this.searchAirportArrival(event.term);
    }
  }

  tabChange(value) {
    this.searchFlightInfo.trip = value;
  }

  selectEvent(event, item) {

    if (!event) {
      this.placeHolder1 = this.placeHolder1;
      this.placeHolder2 = this.placeHolder2;
      this.defaultSelected = this.defaultSelected;
    }
    this.selectedAirport = event;
    this.defaultSelected = '';
    if (event && event.code && item.key === 'fromSearch') {
      this.searchFlightInfo.departure = event.code;
      this.searchedValue.push({ key: 'fromSearch', value: event });
    } else if (event && event.code && item.key === 'toSearch') {
      this.searchFlightInfo.arrival = event.code;
      this.searchedValue.push({ key: 'toSearch', value: event });
    }
  }

  getSwappedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.tempSwapData.leftSideValue = event.value;
    } else if (event && event.key && event.key === 'toSearch') {
      this.tempSwapData.rightSideValue = event.value;
    }
  }

  changeTravellerInfo(event) {
    this.searchFlightInfo.adult = event.adult;
    this.searchFlightInfo.child = event.child;
    this.searchFlightInfo.infant = event.infant;
    this.searchFlightInfo.class = event.class;
    this.totalPerson = event.totalPerson;
  }

  searchFlights() {
    this.searchFlightInfo.child = this.searchFlightInfo.child ? this.searchFlightInfo.child : 0;
    this.searchFlightInfo.infant = this.searchFlightInfo.infant ? this.searchFlightInfo.infant : 0;
    this.searchFlightInfo.class = this.searchFlightInfo.class ? this.searchFlightInfo.class : 'Economy';
    this.searchFlightInfo.departure_date =moment(this.departureDate, 'MM/DD/YYYY').format('YYYY-MM-DD')

    if (this.isRoundTrip === true) {
      this.searchFlightInfo.trip = 'roundtrip';
      this.searchFlightInfo.arrival_date =moment(this.returnDate, 'MM/DD/YYYY').format('YYYY-MM-DD')
    }


    if (!this.isRoundTrip && this.totalPerson &&
      this.searchFlightInfo.departure_date && this.searchFlightInfo.departure && this.searchFlightInfo.arrival
      && this.searchFlightInfo.trip === 'oneway') {
      localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
      this.searchBarInfo.emit(this.searchFlightInfo);
    } else if (this.isRoundTrip === true && this.totalPerson &&
      this.searchFlightInfo.departure_date && this.searchFlightInfo.arrival_date
      && this.searchFlightInfo.departure && this.searchFlightInfo.arrival
      && this.searchFlightInfo.trip === 'roundtrip') {
      localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
      this.searchBarInfo.emit(this.searchFlightInfo);
    }
  }

  toggleOnewayRoundTrip(type) {
    if (type === 'roundtrip') {
      this.isRoundTrip = true;
      this.searchFlightInfo.trip = 'roundtrip';
    } else {
      this.isRoundTrip = false;
      this.searchFlightInfo.trip = 'oneway';
    }
  }

  departureDateUpdate(date) {
    this.returnDate = new Date(date)
    this.flightReturnMinDate=new Date(date)
  }

  dateChange(type,direction) {

    if(type=='departure'){
      if (direction === 'previous') {
        if(moment(this.departureDate).isAfter(moment(new Date()))){
          this.departureDate = new Date(moment(this.departureDate).subtract(1,'days').format('MM/DD/YYYY'))
        }
      }

      else{
        this.departureDate = new Date(moment(this.departureDate).add(1,'days').format('MM/DD/YYYY'))
        if(moment(this.departureDate).isAfter(this.returnDate)){
          this.returnDate = new Date(moment(this.returnDate).add(1,'days').format('MM/DD/YYYY'))
        }
      }
      this.flightReturnMinDate = new Date(this.departureDate)
    }
    
    if(type=='arrival'){

      if (direction === 'previous') {
        if(moment(this.departureDate).isBefore(this.returnDate)){
          this.returnDate = new Date(moment(this.returnDate).subtract(1,'days').format('MM/DD/YYYY'))
        }
      }
      else{
        this.returnDate = new Date(moment(this.returnDate).add(1,'days').format('MM/DD/YYYY'))
      }
    }
  }

}
