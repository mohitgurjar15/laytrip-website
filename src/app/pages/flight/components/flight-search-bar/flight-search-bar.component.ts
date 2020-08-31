import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonFunction } from '../../../../_helpers/common-function';
import { FlightService } from '../../../../services/flight.service';

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

  loading = false;
  data = [];
  placeHolder1 = 'New York';
  placeHolder2 = 'Los Angeles';
  defaultSelected = 'NY, United States';

  defaultDate = moment().add(1, 'months').format("DD MMM'YY dddd");
  totalPerson = 1;

  constructor(
    public fb: FormBuilder,
    private flightService: FlightService,
    public commonFunction: CommonFunction,
  ) {
    this.flightSearchForm = this.fb.group({
      fromDestination: [[Validators.required]],
      toDestination: [[Validators.required]],
      departureDate: ['', [Validators.required]],
      returnDate: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // let selectedItem = localStorage.getItem('_fligh');
    // let data = JSON.parse(selectedItem);
    // this.selectedAirport.push(data.value);
    this.loadJquery();
  }

  loadJquery() {

    // DEPARTURE DATE
    $('#departure_date').dateRangePicker({
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

  getDateWithFormat(date) {
    this.searchFlightInfo.departure_date = this.commonFunction.parseDateWithFormat(date).departuredate;
    // this.searchFlightInfo.arrival_date = this.commonFunction.parseDateWithFormat(date).returndate;
  }

  searchAirport(searchItem) {
    this.loading = true;
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      // console.log(response);
      this.data = response.map(res => {
        this.loading = false;
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
        this.loading = false;
      }
    );
  }

  onChangeSearch(event) {
    if (event.term.length > 2) {
      this.searchAirport(event.term);
    }
  }

  tabChange(value) {
    this.searchFlightInfo.trip = value;
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
    } else if (event && event.code && item.key === 'toSearch') {
      this.toDestinationCode = event.code;
    }
    this.searchFlightInfo.departure = this.fromDestinationCode;
    this.searchFlightInfo.arrival = this.toDestinationCode;
    console.log(this.searchFlightInfo);
  }

  getSwappedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.tempSwapData.leftSideValue = event.value;
    } else if (event && event.key && event.key === 'toSearch') {
      this.tempSwapData.rightSideValue = event.value;
    }
  }

  changeTravellerInfo(event) {
    console.log(event);
    this.searchFlightInfo.adult = event.adult;
    this.searchFlightInfo.child = event.child;
    this.searchFlightInfo.infant = event.infant;
    this.searchFlightInfo.class = event.class;
    this.totalPerson = event.totalPerson;
  }

  searchFlights() {
    console.log(this.searchFlightInfo);
    if (this.searchFlightInfo && this.totalPerson &&
      this.searchFlightInfo.departure_date && this.searchFlightInfo.departure && this.searchFlightInfo.arrival) {
      this.searchBarInfo.emit(this.searchFlightInfo);
    }

  }

}
