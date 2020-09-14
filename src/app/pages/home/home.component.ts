import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
declare var $: any;
import { GenericService } from '../../services/generic.service';
import { ModuleModel, Module } from '../../model/module.model';
import { CommonFunction } from '../../_helpers/common-function';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;
  s3BucketUrl = environment.s3BucketUrl;

  modules: Module[];
  moduleList: any = {};
  switchBtnValue = false;
  tempSwapData =
    {
      leftSideValue: {},
      rightSideValue: {}
    };
  swapped = [];
  isSwap = false;
  swapError = '';
  isRoundTrip: boolean = false;
  flightSearchForm: FormGroup;

  // DATE OF FROM_DESTINATION & TO_DESTINATION
  fromDestinationCode;
  toDestinationCode;

  locale = {
    format: 'DD/MM/YYYY',
    displayFormat: 'DD/MM/YYYY'
  };

  flightDepartureMinDate: moment.Moment = moment();
  flightReturnMinDate: moment.Moment = moment().add(7, 'days');

  totalPerson: number = 1;

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

  searchedValue = [];

  constructor(
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router
  ) {
    this.flightSearchForm = this.fb.group({
      fromDestination: [[Validators.required]],
      toDestination: [[Validators.required]],
      departureDate: [{
        startDate: moment().add(30, 'days')
      }, Validators.required],
      returnDate: [{
        startDate: moment().add(37, 'days')
      }, Validators.required]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getModules();
    this.loadJquery();
  }

  loadJquery() {


    $(".featured_slid").slick({
      dots: false,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1
    });

    // Start Featured List Js
    $(".deals_slid").slick({
      dots: false,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
    // Close Featured List Js
  }


  /**
   * Get All module like (hotel, flight & VR)
   */
  getModules() {
    this.genericService.getModules().subscribe(
      (response: ModuleModel) => {

        response.data.forEach(module => {
          this.moduleList[module.name] = module.status;
        });
        // console.log(this.moduleList);
      },
      (error) => {

      }
    );
  }

  destinationChangedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.fromDestinationCode = event.value.code;
      this.searchedValue.push({ key: 'fromSearch', value: event.value });
    } else if (event && event.key && event.key === 'toSearch') {
      this.toDestinationCode = event.value.code;
      this.searchedValue.push({ key: 'toSearch', value: event.value });
    }
    this.searchFlightInfo.departure = this.fromDestinationCode;
    this.searchFlightInfo.arrival = this.toDestinationCode;
  }

  openDatePicker(event) {
    // this.pickerDirective.open(event);
  }

  getDateWithFormat(date) {
    this.searchFlightInfo.departure_date = this.commonFunction.parseDateWithFormat(date).departuredate;
    // this.searchFlightInfo.arrival_date = this.commonFunction.parseDateWithFormat(date).returndate;
  }

  getSwappedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.tempSwapData.leftSideValue = event.value;
    } else if (event && event.key && event.key === 'toSearch') {
      this.tempSwapData.rightSideValue = event.value;
    }
  }

  switchDestination() {

  }

  changeTravellerInfo(event) {
    this.searchFlightInfo.adult = event.adult;
    this.searchFlightInfo.child = event.child;
    this.searchFlightInfo.infant = event.infant;
    this.searchFlightInfo.class = event.class;
    this.totalPerson = event.totalPerson;
    this.searchedValue.push({ key: 'travellers', value: event });
  }

  searchFlights() {
    let queryParams: any = {};
    queryParams.trip = this.isRoundTrip ? 'roundtrip' : 'oneway';
    queryParams.departure = this.searchFlightInfo.departure;
    queryParams.arrival = this.searchFlightInfo.arrival;
    queryParams.departure_date = moment(this.flightSearchForm.value.departureDate.startDate).format('YYYY-MM-DD');
    if (this.isRoundTrip === true) {
      queryParams.arrival_date = moment(this.flightSearchForm.value.returnDate.startDate).format('YYYY-MM-DD');
    }
    queryParams.class = this.searchFlightInfo.class ? this.searchFlightInfo.class : 'Economy';
    queryParams.adult = this.searchFlightInfo.adult;
    queryParams.child = this.searchFlightInfo.child ? this.searchFlightInfo.child : 0;
    queryParams.infant = this.searchFlightInfo.infant ? this.searchFlightInfo.infant : 0;
    if (this.searchFlightInfo && this.totalPerson &&
      this.flightSearchForm.value.departureDate.startDate && this.searchFlightInfo.departure && this.searchFlightInfo.arrival) {
      localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
      this.router.navigate(['flight/search'], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
    }

  }

  toggleOnewayRoundTrip(type) {

    if (type == 'roundtrip')
      this.isRoundTrip = true;
    else
      this.isRoundTrip = false
  }

  datesUpdated(event) {

  }

  departureDateUpdate(date) {
    this.flightReturnMinDate = moment(this.flightSearchForm.value.departureDate.startDate)
  }
}
