import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
declare var $: any;
import { GenericService } from '../../services/generic.service';
import { ModuleModel, Module } from '../../model/module.model';
import { CommonFunction } from 'src/app/_helpers/common-function';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

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

  flightSearchForm: FormGroup;

  // DATE OF FROM_DESTINATION & TO_DESTINATION
  fromDestinationDate = '';
  toDestinationDate = '';
  fromDestinationCode;
  toDestinationCode;

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
      format: "DD MMM'YY dddd",
      extraClass: 'laytrip-datepicker',
    }).bind('datepicker-first-date-selected', function (event, obj) {
      console.log(obj);
    });

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
      extraClass: 'laytrip-datepicker'
    }).bind('datepicker-first-date-selected', function (event, obj) {
      console.log(obj);
    });

    $('#return_date_icon').click(function (evt) {
      evt.stopPropagation();
      $('#return_date').data('dateRangePicker').open();
    });

    $(".featured_slid").slick({
      dots: false,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1
    });
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
        console.log(this.moduleList);
      },
      (error) => {

      }
    );
  }

  destinationChangedValue(event) {
    console.log(event.value.code);

    if (event && event.key && event.key === 'fromSearch') {
      this.fromDestinationCode = event.value.code;
    } else if (event && event.key && event.key === 'toSearch') {
      this.toDestinationCode = event.value.code;
    }
  }

  dateChange(event) {
    console.log(event);
  }

  getDateWithFormat(date) {
    this.commonFunction.parseDateWithFormat(date);
  }

  getSwappedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.tempSwapData.leftSideValue = event.value;
    } else if (event && event.key && event.key === 'toSearch') {
      this.tempSwapData.rightSideValue = event.value;
    }
  }

  switchDestination() {
    console.log('swap');
    // this.isSwap = true;
    // if (this.tempSwapData.leftSideValue && this.tempSwapData.rightSideValue) {
    //   this.swapped.push(this.tempSwapData.rightSideValue);
    //   this.swapped.push(this.tempSwapData.leftSideValue);
    //   console.log(this.swapped);
    // }
  }

  searchFlights() {
    let search = 'search?BOM-LAX-01/09/2020_LAX-BOM-06/10/2020&tripType=R&paxType=A-1_C-0_I-0&intl=true&cabinClass=E';
    this.router.navigate(['flight']);
  }

}
