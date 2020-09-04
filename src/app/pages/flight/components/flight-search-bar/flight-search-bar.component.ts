import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
  fromDestinationDate = '';
  toDestinationDate = '';
  fromDestinationCode;
  toDestinationCode;

  searchFlightInfo =
    {
      trip: 'oneway',
      departure: '',
      arrival: '',
      departure_date: moment().add(1, 'months').format("YYYY-MM-DD"),
      // arrival_date: '',
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

  defaultDate = moment().add(1, 'months').format("DD MMM'YY dddd");
  totalPerson = 1;

  fromDestinationData = [];
  toDestinationData = [];

  airportDefaultDestValue;
  airportDefaultArrivalValue;
  departureDate:string;
  searchedValue = [];

  tabchangeValue = 'oneway';

  constructor(
    public fb: FormBuilder,
    private flightService: FlightService,
    public commonFunction: CommonFunction,
    public cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {

    this.departureDate= this.route.snapshot.queryParams["departure_date"];
    this.departureDate = this.commonFunction.convertDateFormat(this.departureDate,'YYYY-MM-DD')
    console.log("this.departureDate",this.departureDate)
    this.flightSearchForm = this.fb.group({
      fromDestination: [[Validators.required]],
      toDestination: [[Validators.required]],
      departureDate: ['', [Validators.required]],
      returnDate: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    let selectedItem = localStorage.getItem('_fligh');
    let info = JSON.parse(selectedItem);
    info.forEach(res => {
      if (res && res.key === 'fromSearch') {
        this.data.push(res.value);
        this.airportDefaultDestValue = `${res.value.city},${res.value.country},(${res.value.code}),${res.value.name}`;
        if (this.airportDefaultDestValue) {
          this.defaultSelected = '';
        }
      }
      if (res && res.key === 'toSearch') {
        this.data.push(res.value);
        this.airportDefaultArrivalValue = `${res.value.city},${res.value.country},(${res.value.code}),${res.value.name}`;
        if (this.airportDefaultArrivalValue) {
          this.defaultSelected = '';
        }
      }
    });

    this.loadJquery(this.tabchangeValue);
  }

  loadJquery(tab) {
    console.log(tab);
    if (tab === 'round-trip') {
      // DEPARTURE DATE
      $('#departure_date_round_trip').dateRangePicker({
        autoClose: true,
        singleDate: true,
        showShortcuts: false,
        singleMonth: true,
        monthSelect: true,
        format: "DD MMM'YY dddd",
        startDate: moment().add(0, 'months').format("DD MMM'YY dddd"),
        // endDate: moment().add(1, 'months').format("DD MMM'YY dddd"),
        extraClass: 'laytrip-datepicker'
      }).bind('datepicker-first-date-selected', function (event, obj) {
        this.getDateWithFormat({ departuredate: obj });
      }.bind(this));

      $('#departure_date_icon_round_trip').click(function (evt) {
        evt.stopPropagation();
        $('#departure_date_round_trip').data('dateRangePicker').open();
      });

      // RETURN DATE
      $('#return_date_round_trip').dateRangePicker({
        autoClose: true,
        singleDate: true,
        showShortcuts: false,
        singleMonth: true,
        format: "DD MMM'YY dddd",
        startDate: moment().subtract(0, 'months').format("DD MMM'YY dddd"),
        // endDate: moment().add(1, 'months').format("DD MMM'YY dddd"),
        extraClass: 'laytrip-datepicker'
      }).bind('datepicker-first-date-selected', function (event, obj) {
        this.returnDate = obj;
        this.getDateWithFormat({ returndate: obj });
      }.bind(this));

      $('#return_date_icon_round_trip').click(function (evt) {
        evt.stopPropagation();
        $('#return_date_round_trip').data('dateRangePicker').open();
      });

      $(".featured_slid").slick({
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
      });
    } else {
      // DEPARTURE DATE
      $('#departure_date').dateRangePicker({
        autoClose: true,
        singleDate: true,
        showShortcuts: false,
        singleMonth: true,
        monthSelect: true,
        format: this.commonFunction.dateFormat('en').date,
        startDate: moment().add(0, 'months').format("DD MMM'YY dddd"),
        // endDate: moment().add(1, 'months').format("DD MMM'YY dddd"),
        extraClass: 'laytrip-datepicker'
      }).bind('datepicker-first-date-selected', function (event, obj) {
        this.getDateWithFormat({ departuredate: obj });
      }.bind(this));

      $('#departure_date_icon').click(function (evt) {
        evt.stopPropagation();
        $('#departure_date').data('dateRangePicker').open();
      });

      // RETURN DATE
      $('#return_date').dateRangePicker({
        autoClose: true,
        singleDate: true,
        showShortcuts: false,
        singleMonth: true,
        format: "DD MMM'YY dddd",
        startDate: moment().subtract(0, 'months').format("DD MMM'YY dddd"),
        // endDate: moment().add(1, 'months').format("DD MMM'YY dddd"),
        extraClass: 'laytrip-datepicker'
      }).bind('datepicker-first-date-selected', function (event, obj) {
        this.returnDate = obj;
        this.getDateWithFormat({ returndate: obj });
      }.bind(this));

      // $('#return_date_icon').click(function (evt) {
      //   evt.stopPropagation();
      //   $('#return_date').data('dateRangePicker').open();
      // });

      $(".featured_slid").slick({
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
      });
    }

    // // DEPARTURE DATE
    // $('#departure_date').dateRangePicker({
    //   autoClose: true,
    //   singleDate: true,
    //   showShortcuts: false,
    //   singleMonth: true,
    //   monthSelect: true,
    //   format: "DD MMM'YY dddd",
    //   startDate: moment().add(0, 'months').format("DD MMM'YY dddd"),
    //   // endDate: moment().add(1, 'months').format("DD MMM'YY dddd"),
    //   extraClass: 'laytrip-datepicker'
    // }).bind('datepicker-first-date-selected', function (event, obj) {
    //   this.getDateWithFormat({ departuredate: obj });
    // }.bind(this));

    // $('#departure_date_icon').click(function (evt) {
    //   evt.stopPropagation();
    //   $('#departure_date').data('dateRangePicker').open();
    // });

    // // RETURN DATE
    // $('#return_date').dateRangePicker({
    //   autoClose: true,
    //   singleDate: true,
    //   showShortcuts: false,
    //   singleMonth: true,
    //   format: "DD MMM'YY dddd",
    //   startDate: moment().subtract(0, 'months').format("DD MMM'YY dddd"),
    //   // endDate: moment().add(1, 'months').format("DD MMM'YY dddd"),
    //   extraClass: 'laytrip-datepicker'
    // }).bind('datepicker-first-date-selected', function (event, obj) {
    //   this.returnDate = obj;
    //   this.getDateWithFormat({ returndate: obj });
    // }.bind(this));

    // // $('#return_date_icon').click(function (evt) {
    // //   evt.stopPropagation();
    // //   $('#return_date').data('dateRangePicker').open();
    // // });

    // $(".featured_slid").slick({
    //   dots: false,
    //   infinite: true,
    //   slidesToShow: 3,
    //   slidesToScroll: 1
    // });
  }

  getDateWithFormat(date) {
    this.searchFlightInfo.departure_date = this.commonFunction.parseDateWithFormat(date).departuredate;
    // this.searchFlightInfo.arrival_date = this.commonFunction.parseDateWithFormat(date).returndate;
  }

  searchAirportDeparture(searchItem) {
    this.loadingDeparture = true;
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      // console.log(response);
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
      // console.log(response);
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
    this.tabchangeValue = value;
    this.loadJquery(this.tabchangeValue);
  }

  selectEvent(event, item) {
    // console.log(event, item);
    if (!event) {
      this.placeHolder1 = this.placeHolder1;
      this.placeHolder2 = this.placeHolder2;
      this.defaultSelected = this.defaultSelected;
    }
    this.selectedAirport = event;
    this.defaultSelected = '';
    if (event && event.code && item.key === 'fromSearch') {
      this.fromDestinationCode = event.code;
      this.searchedValue.push({ key: 'fromSearch', value: event });
    } else if (event && event.code && item.key === 'toSearch') {
      this.toDestinationCode = event.code;
      this.searchedValue.push({ key: 'toSearch', value: event });
    }
    this.searchFlightInfo.departure = this.fromDestinationCode;
    this.searchFlightInfo.arrival = this.toDestinationCode;
  }

  getSwappedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.tempSwapData.leftSideValue = event.value;
    } else if (event && event.key && event.key === 'toSearch') {
      this.tempSwapData.rightSideValue = event.value;
    }
  }

  changeTravellerInfo(event) {
    // console.log(event);
    this.searchFlightInfo.adult = event.adult;
    this.searchFlightInfo.child = event.child;
    this.searchFlightInfo.infant = event.infant;
    this.searchFlightInfo.class = event.class;
    this.totalPerson = event.totalPerson;
  }

  searchFlights() {
    // console.log(this.searchFlightInfo);
    this.searchFlightInfo.child = this.searchFlightInfo.child ? this.searchFlightInfo.child : 0;
    this.searchFlightInfo.infant = this.searchFlightInfo.infant ? this.searchFlightInfo.infant : 0;
    this.searchFlightInfo.class = this.searchFlightInfo.class ? this.searchFlightInfo.class : 'Economy';
    if (this.searchFlightInfo && this.totalPerson &&
      this.searchFlightInfo.departure_date && this.searchFlightInfo.departure && this.searchFlightInfo.arrival) {
      localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
      this.searchBarInfo.emit(this.searchFlightInfo);
    }

  }

}
