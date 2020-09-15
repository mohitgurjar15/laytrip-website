import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonFunction } from '../../../../_helpers/common-function';
import { FlightService } from '../../../../services/flight.service';
import { ActivatedRoute } from '@angular/router';
import { airports } from '../../airports';

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
  fromDestinationDate = '';
  toDestinationDate = '';
  fromDestinationCode;
  toDestinationCode;
  isRoundTrip = false;
  searchFlightInfo =
    {
      trip: 'oneway',
      departure: '',
      arrival: '',
      departure_date: moment().add(1, 'months').format('YYYY-MM-DD'),
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
  defaultDate = moment().add(1, 'months').format("DD MMM'YY dddd");
  totalPerson: number = 1;

  fromDestinationData = [];
  toDestinationData = [];

  airportDefaultDestValue;
  airportDefaultArrivalValue;
  selectedTraveller = {
    adultValue: 1,
    childValue: 0,
    infantValue: 0,
    totalPerson: 1,
    class: 'Economy',
  };
  departureDate: string;
  arrivalDate: string;
  searchedValue = [];
  arrivalCode: string;

  locale = {
    format: 'DD/MM/YYYY',
    displayFormat: 'DD/MM/YYYY'
  };

  flightDepartureMinDate: moment.Moment = moment();
  flightReturnMinDate: moment.Moment = moment().add(7, 'days');

  constructor(
    public fb: FormBuilder,
    private flightService: FlightService,
    public commonFunction: CommonFunction,
    public cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {

    this.departureDate = this.route.snapshot.queryParams['departure_date'];
    this.arrivalDate = this.route.snapshot.queryParams['arrival_date'];
    this.searchFlightInfo.departure = this.route.snapshot.queryParams['departure'];
    this.searchFlightInfo.arrival = this.route.snapshot.queryParams['arrival'];
    if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
      this.isRoundTrip = true;
    }
    this.arrivalCode = this.route.snapshot.queryParams['arrival'];
    this.flightSearchForm = this.fb.group({
      fromDestination: [[Validators.required]],
      toDestination: [[Validators.required]],
      departureDate: [{
        startDate: moment(this.departureDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
      }, Validators.required],
      returnDate: [{
        startDate: typeof this.arrivalDate !== 'undefined' ?
          moment(this.arrivalDate, 'YYYY-MM-DD').format('DD/MM/YYYY') : moment(this.departureDate).add(7, 'days')
      }, Validators.required]
    });

    const selectedItem = localStorage.getItem('_fligh');
    if (selectedItem) {
      const info = JSON.parse(selectedItem);
      info[1].value = airports[this.arrivalCode];
      info.forEach(res => {
        if (res && res.key === 'fromSearch') {
          this.data.push(res.value);
          this.airportDefaultDestValue = `${res.value.city}`;
          if (this.airportDefaultDestValue) {
            this.defaultSelected = '';
          }
        }
        if (res && res.key === 'toSearch') {
          res.value.display_name=`${res.value.city},${res.value.country},(${res.value.code}),${res.value.name}`;
          this.data.push(res.value);
          this.airportDefaultArrivalValue = `${res.value.city}`;
          if (this.airportDefaultArrivalValue) {
            this.defaultSelected = '';
          }
        }
      });

    }
  }

  ngOnInit() {
    this.searchFlightInfo.departure = this.route.snapshot.queryParams['departure'];
    this.searchFlightInfo.arrival = this.route.snapshot.queryParams['arrival'];
    // const selectedItem = localStorage.getItem('_fligh');
    // if (selectedItem) {
    //   const info = JSON.parse(selectedItem);
    //   info[1].value = airports[this.arrivalCode];
    //   info.forEach(res => {
    //     if (res && res.key === 'fromSearch') {
    //       this.data.push(res.value);
    //       this.airportDefaultDestValue = `${res.value.city}`;
    //       if (this.airportDefaultDestValue) {
    //         this.defaultSelected = '';
    //       }
    //     }
    //     if (res && res.key === 'toSearch') {
    //       this.data.push(res.value);
    //       this.airportDefaultArrivalValue = `${res.value.city}`;
    //       if (this.airportDefaultArrivalValue) {
    //         this.defaultSelected = '';
    //       }
    //     }
    //   });
    // }

    this.loadJquery();
  }

  loadJquery() {

    /* $(".featured_slid").slick({
      dots: false,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1
    }); */
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
    // this.searchFlightInfo.departure = this.fromDestinationCode;
    // this.searchFlightInfo.arrival = this.toDestinationCode;
    console.log(this.searchFlightInfo.departure, this.searchFlightInfo.arrival);
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
    if (this.route.snapshot.queryParams['trip'] === 'roundtrip') {
      this.searchFlightInfo.trip = 'roundtrip';
      if (this.route.snapshot.queryParams['arrival_date']) {
        this.searchFlightInfo.arrival_date = this.arrivalDate;
      }
    }

    console.log(this.searchFlightInfo);

    if (this.totalPerson &&
      this.searchFlightInfo.departure_date && this.searchFlightInfo.departure && this.searchFlightInfo.arrival
      && this.searchFlightInfo.trip === 'oneway') {
      localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
      this.searchBarInfo.emit(this.searchFlightInfo);
    } else if (this.isRoundTrip && this.totalPerson &&
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
    }
  }

  datesUpdated(event) {

  }

  departureDateUpdate(date) {
    this.flightReturnMinDate = moment(this.flightSearchForm.value.departureDate.startDate);
    this.searchFlightInfo.departure_date = moment(this.flightSearchForm.value.departureDate.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }

}
