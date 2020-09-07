import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
declare var $: any;
import { GenericService } from '../../services/generic.service';
import { ModuleModel, Module } from '../../model/module.model';
import { CommonFunction } from '../../_helpers/common-function';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
    isRoundTrip:boolean=false;
    flightSearchForm: FormGroup;

    // DATE OF FROM_DESTINATION & TO_DESTINATION
    fromDestinationDate = '';
    toDestinationDate = '';
    fromDestinationCode;
    toDestinationCode;

    departureDate;
    returnDate;
    totalPerson = 1;

    // placeholderDate = moment().add(1, 'months').format("DD MMM'YY dddd");
    defaultDate = moment().add(1, 'months').format(this.commonFunction.dateFormat('en').date);

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
        departureDate: ['', [Validators.required]],
        returnDate: ['', [Validators.required]]
      });
    }

    ngOnInit(): void {

      this.getModules();
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
        format: this.commonFunction.dateFormat('en').date,
        startDate: moment().add(0, 'months').format(this.commonFunction.dateFormat('en').date),
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
        format: this.commonFunction.dateFormat('en').date,
        startDate: moment().subtract(0, 'months').format(this.commonFunction.dateFormat('en').date),
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

    tabChange(value) {
      this.searchFlightInfo.trip = value;
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
        this.searchedValue.push({key: 'fromSearch', value: event.value});
      } else if (event && event.key && event.key === 'toSearch') {
        this.toDestinationCode = event.value.code;
        this.searchedValue.push({key: 'toSearch', value: event.value});
      }
      this.searchFlightInfo.departure = this.fromDestinationCode;
      this.searchFlightInfo.arrival = this.toDestinationCode;
    }

    dateChange(event) {
      // console.log(event);
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
      // console.log('swap');
      // this.isSwap = true;
      // if (this.tempSwapData.leftSideValue && this.tempSwapData.rightSideValue) {
      //   this.swapped.push(this.tempSwapData.rightSideValue);
      //   this.swapped.push(this.tempSwapData.leftSideValue);
      //   console.log(this.swapped);
      // }
    }

    changeTravellerInfo(event) {
      this.searchFlightInfo.adult = event.adult;
      this.searchFlightInfo.child = event.child;
      this.searchFlightInfo.infant = event.infant;
      this.searchFlightInfo.class = event.class;
      this.totalPerson = event.totalPerson;
    }

    searchFlights() {
      if (this.searchFlightInfo && this.totalPerson &&
        this.searchFlightInfo.departure_date && this.searchFlightInfo.departure && this.searchFlightInfo.arrival) {
        localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));
        this.router.navigate(['flight/search'], {
          queryParams: {
            trip: this.searchFlightInfo.trip,
            departure: this.searchFlightInfo.departure,
            arrival: this.searchFlightInfo.arrival,
            departure_date: this.searchFlightInfo.departure_date,
            class: this.searchFlightInfo.class ? this.searchFlightInfo.class : 'Economy',
            adult: this.searchFlightInfo.adult,
            child: this.searchFlightInfo.child ? this.searchFlightInfo.child : 0,
            infant: this.searchFlightInfo.infant ? this.searchFlightInfo.infant : 0
          },
          queryParamsHandling: 'merge'
        });
      }

    }

    toggleOnewayRoundTrip(type){

      if(type=='roundtrip')
        this.isRoundTrip=true;
      else
        this.isRoundTrip=false
    }
}
