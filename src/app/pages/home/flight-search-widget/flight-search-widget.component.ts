import { Component, HostListener, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../../model/module.model';
import { environment } from '../../../../environments/environment';
import { airports } from '../../flight/airports';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { CommonFunction } from '../../../_helpers/common-function';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../services/flight.service';
import { HomeService } from '../../../services/home.service';
import { cookieServiceFactory } from 'ngx-cookie';

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
  @Input() calenderPrices: any = [];
  switchBtnValue = false;
  isRoundTrip: boolean = true;
  flightSearchForm: FormGroup;
  flightSearchFormSubmitted = false;
  isCalenderPriceLoading: boolean = true;
  // DATE OF FROM_DESTINATION & TO_DESTINATION
  //fromSearch : any = airports['JFK'];
  fromSearch: any = {};
  countryCode: string;
  monthYearArr = [];
  //toSearch:any = airports['PUJ'];
  toSearch: any = {};

  locale = {
    format: 'MM/DD/YYYY',
    displayFormat: 'MM/DD/YYYY'
  };

  flightDepartureMinDate;
  flightReturnMinDate;
  customStartDateValidation = "2021-06-02";
  customEndDateValidation = "2021-06-09";
  departureDate;
  returnDate: any = new Date(moment(this.customEndDateValidation).format("MM/DD/YYYY"));
  totalPerson: number = 1;
  lowMinPrice: number;
  midMinPrice: number;
  highMinPrice: number;
  calPrices = false;
  routeSearch : boolean = false;

  currentMonth: string;
  currentYear: string;
  showFromAirportSuggestion: boolean = false;
  showToAirportSuggestion: boolean = false;
  thisElementClicked: boolean = false;

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
  searchedFlightData = [];
  constructor(
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private flightService: FlightService,
    private homeService: HomeService
  ) {

    if (typeof this.fromSearch.city != 'undefined') {
      this.fromSearch['display_name'] = `${this.fromSearch.city},${this.fromSearch.country},(${this.fromSearch.code}),${this.fromSearch.name}`;
      this.toSearch['display_name'] = `${this.toSearch.city},${this.toSearch.country},(${this.toSearch.code}),${this.toSearch.name}`;
    }
    this.flightSearchForm = this.fb.group({
      fromDestination: ['', [Validators.required]],
      toDestination: ['', [Validators.required]],
      departureDate: [[Validators.required]],
      returnDate: [[Validators.required]]
    });

    this.setFlightDepartureMinDate();

    this.flightReturnMinDate = this.departureDate;
    this.countryCode = this.commonFunction.getUserCountry();
    this.rangeDates = [this.departureDate, this.returnDate];

  }

  ngOnInit(): void {
    // this.departureDate = moment(this.customStartDateValidation).toDate();

    if (new Date(this.customStartDateValidation) <= new Date()) {
      this.departureDate = moment().add('31', 'days').toDate();
    }

    window.scrollTo(0, 0);
    this.countryCode = this.commonFunction.getUserCountry();
    if (this.calenderPrices.length == 0) {
      this.isCalenderPriceLoading = false;
    }
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0 && window.location.pathname == '/flight/search') {
        //delete BehaviorSubject in the listing page
        this.homeService.removeToString('flight');

        this.calPrices = true;
        this.fromSearch = airports[params['departure']];
        this.toSearch = airports[params['arrival']];
        //this.fromSearch['display_name'] = `${this.fromSearch.city},${this.fromSearch.country},(${this.fromSearch.code}),${this.fromSearch.name}`;
        //this.toSearch['display_name'] = `${this.toSearch.city},${this.toSearch.country},(${this.toSearch.code}),${this.toSearch.name}`;
        this.searchFlightInfo.departure = this.fromSearch.code;
        this.searchFlightInfo.arrival = this.toSearch.code;
        this.toggleOnewayRoundTrip(params['trip']);
        localStorage.setItem('__from', params['departure'])
        localStorage.setItem('__to', params['arrival'])

        this.searchFlightInfo.class = params['class'];
        this.searchFlightInfo.adult = params['adult'];
        this.searchFlightInfo.child = params['child'];
        this.searchFlightInfo.infant = params['infant'];
        this.departureDate = moment(params['departure_date']).toDate();
        // console.log(params['departure_date'], moment(params['departure_date']).format("YYYY-MM-DD"))
        if (moment(this.departureDate).format("YYYY-MM-DD") < this.customStartDateValidation) {
          // this.router.navigate(['/flight/flight-not-found'])
        }
        this.currentMonth = moment(this.departureDate).format("MM");
        this.currentYear = moment(this.departureDate).format("YYYY");
        // this.returnDate = new Date(params['arrival_date']);
        this.returnDate = params['arrival_date'] ? moment(params['arrival_date']).toDate() : new Date(moment(params['departure_date']).add(7, 'days').format('MM/DD/YYYY'));
        this.rangeDates = [this.departureDate, this.returnDate];
      } else {
        this.calPrices = false;
      }
    });

    this.homeService.getToString.subscribe(toSearchString => {
      if (typeof toSearchString != 'undefined' && Object.keys(toSearchString).length > 0) {
        let keys: any = toSearchString;
        localStorage.setItem('__to', keys)
        // this.toSearch = null;   
        this.toSearch = airports[keys];
        this.flightSearchForm.controls.fromDestination.setValue('');
        this.fromSearch = [];
        if (!this.isRoundTrip) {
          // this.departureDate = moment(this.customStartDateValidation).add(31, 'days').toDate();
        } else {
          this.rangeDates = [this.departureDate, moment(this.departureDate).add(7, 'days').toDate()];
          this.searchFlightInfo.arrival = this.toSearch.code;
        }
      }
    });
    //delete BehaviorSubject at the end
    this.homeService.removeToString('flight');
    this.lowMinPrice = this.midMinPrice = this.highMinPrice = 0;

  }

  ngOnChanges(changes: SimpleChanges) {

  }


  setFlightDepartureMinDate() {

    let date = new Date();

    var curretdate = moment().format();
    let juneDate: any = moment(this.customStartDateValidation).format('YYYY-MM-DD');

    let daysDiffFromCurToJune = moment(this.customStartDateValidation, "YYYY-MM-DD").diff(moment(curretdate, "YYYY-MM-DD"), 'days');

    date.setDate(date.getDate() + 31);

    if (curretdate < juneDate && daysDiffFromCurToJune > 31) {
      this.flightDepartureMinDate = moment(juneDate).toDate();
      this.departureDate = this.flightDepartureMinDate;
    } else if (daysDiffFromCurToJune < 31) {
      this.flightDepartureMinDate = date;
      this.departureDate = date;
    } else {
      this.departureDate = date;
      this.flightDepartureMinDate = date;
    }
  }


  destinationChangedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.fromSearch = event.value;
      this.searchedValue.push({ key: 'fromSearch', value: this.fromSearch });
    } else if (event && event.key && event.key === 'toSearch') {
      this.toSearch = event.value;
      this.searchedValue.push({ key: 'toSearch', value: this.toSearch });
    }
    this.searchFlightInfo.departure = this.fromSearch.code;
    this.searchFlightInfo.arrival = this.toSearch.code;
  }

  changeTravellerInfo(event) {
    this.searchFlightInfo.adult = event.adult;
    this.searchFlightInfo.child = event.child;
    this.searchFlightInfo.infant = event.infant;
    this.totalPerson = event.totalPerson;
    this.searchedValue.push({ key: 'travellers', value: event });
  }

  changeEconomyInfo(event) {
    this.searchFlightInfo.class = event;
  }

  searchFlights() {
    this.flightSearchFormSubmitted = true;
    let queryParams: any = {};
    queryParams.trip = this.isRoundTrip ? 'roundtrip' : 'oneway';
    queryParams.departure = this.fromSearch.code ? this.fromSearch.code : this.searchFlightInfo.departure;
    queryParams.arrival = this.toSearch.code ? this.toSearch.code : this.searchFlightInfo.arrival;
    queryParams.departure_date = moment(this.departureDate).format('YYYY-MM-DD');
    if (this.isRoundTrip === true) {
      queryParams.arrival_date = moment(this.returnDate).format('YYYY-MM-DD');
    }
    queryParams.class = this.searchFlightInfo.class ? this.searchFlightInfo.class : 'Economy';
    queryParams.adult = this.searchFlightInfo.adult ? this.searchFlightInfo.adult : 1;
    queryParams.child = this.searchFlightInfo.child ? this.searchFlightInfo.child : 0;
    queryParams.infant = this.searchFlightInfo.infant ? this.searchFlightInfo.infant : 0;
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      
      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if(parms.utm_medium){
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if(parms.utm_campaign){
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
    }
    if (this.searchFlightInfo && this.totalPerson &&
      this.departureDate && this.searchFlightInfo.departure && this.searchFlightInfo.arrival) {
      localStorage.setItem('_fligh', JSON.stringify(this.searchedValue));

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['flight/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
      });
    }

  }

  toggleOnewayRoundTrip(type) {
    if (type === 'roundtrip') {
      this.returnDate = moment(this.departureDate).add(7, 'days').toDate();
      this.rangeDates = [this.departureDate, this.returnDate];
      this.isRoundTrip = true;
    } else {
      this.isRoundTrip = false;
    }
  }


  selectDepartureDate(date) {
    this.departureDate = moment(date).toDate();
    this.returnDate = new Date(date);
    this.flightReturnMinDate = new Date(date);
  }


  swapAirport() {

    let temp = this.searchFlightInfo.departure;

    this.searchFlightInfo.departure = this.searchFlightInfo.arrival;
    this.searchFlightInfo.arrival = temp;


    let tempAirport = this.fromSearch;
    this.fromSearch = this.toSearch;
    this.toSearch = tempAirport;
    if (this.fromSearch.code) {
      localStorage.setItem('__from', this.fromSearch.code)
    }
    if (this.toSearch.code) {
      localStorage.setItem('__to', this.toSearch.code)
    }
  }

  selectReturnDateUpdate(date) {
    // this is only for closing date range picker, after selecting both dates
    if (this.rangeDates[1]) { // If second date is selected
      this.dateFilter.hideOverlay();
    };
    if (this.rangeDates[0] && this.rangeDates[1]) {
      this.departureDate = this.rangeDates[0];
      // this.flightDepartureMinDate = this.rangeDates[0];
      this.returnDate = this.rangeDates[1];
      this.rangeDates = [this.departureDate, this.returnDate];
    }
  }


  getPrice(d, m, y) {

    this.lowMinPrice = this.midMinPrice = this.highMinPrice = 0;
    // this.currentMonth = m.toString().length == 1 ? '0' + m : m;
    // this.currentYear = y;
    let month: any = parseInt(m) + 1;
    let day = d.toString().length == 1 ? '0' + d : d;
    month = month.toString().length == 1 ? '0' + month : month;
    let date = `${day}/${month}/${y}`;
    let price: any = this.calenderPrices.find((d: any) => d.date == date);
    if (price) {
      if (price.secondary_start_price > 0) {
        return `$${price.secondary_start_price.toFixed(2)}`;
      }
      return `$${price.price.toFixed(2)}`;
    }
  }

  getPriceClass(d, m, y) {
    let month: any = parseInt(m) + 1;
    let day = d.toString().length == 1 ? '0' + d : d;
    month = month.toString().length == 1 ? '0' + month : month;
    let date = `${day}/${month}/${y}`;
    let price: any = this.calenderPrices.find((d: any) => d.date == date);
    if (price) {

      if (price.secondary_start_price > 0) {
        return `${price.flag}`;
      }
      return `${price.flag}`;
    }
  }

  changeMonth(event) {

    var currentDate = new Date();
    // 1 June validation apply
    let juneDate: any = moment(this.customStartDateValidation).format('YYYY-MM-DD');

    this.lowMinPrice = this.highMinPrice = this.midMinPrice = 0;

    this.route.queryParams.subscribe(params => {
      this.calPrices = false;
      if (Object.keys(params).length > 0) {
        this.calPrices = true;
      }
    });

    this.currentMonth = event.month.toString().length == 1 ? '0' + event.month : event.month;
    this.currentYear = event.year;
    if (!this.isRoundTrip) {
      let month = event.month;
      month = month.toString().length == 1 ? '0' + month : month;
      let monthYearName = `${month}-${event.year}`;

      if (!this.monthYearArr.includes(monthYearName) && this.calPrices) {
        this.monthYearArr.push(monthYearName);
        let startDate: any = moment([event.year, event.month - 1]);
        let endDate: any = moment(startDate).endOf('month');

        startDate = moment(startDate.toDate()).format("YYYY-MM-DD");
        endDate = moment(endDate.toDate()).format("YYYY-MM-DD");

        if (!moment().isBefore(startDate)) {
          startDate = moment().format("YYYY-MM-DD");
        }

        let payload = {
          source_location: this.route.snapshot.queryParams['departure'],
          destination_location: this.route.snapshot.queryParams['arrival'],
          flight_class: this.route.snapshot.queryParams['class'],
          adult_count: this.route.snapshot.queryParams['adult'],
          child_count: this.route.snapshot.queryParams['child'],
          infant_count: this.route.snapshot.queryParams['infant'],
          start_date: startDate,
          end_date: endDate
        }

        var GivenDate = new Date(endDate);

        if (startDate >= juneDate) { //june calendar validation        
          if (GivenDate > currentDate || currentDate < new Date(startDate)) {
            this.lowMinPrice = this.highMinPrice = this.midMinPrice = 0;
            this.isCalenderPriceLoading = this.calPrices = true;

            this.flightService.getFlightCalenderDate(payload).subscribe((res: any) => {
              this.calenderPrices = [...this.calenderPrices, ...res];
              this.isCalenderPriceLoading = false;
            }, err => {
              this.calPrices = false;
              this.isCalenderPriceLoading = false;
            });
          } else {
            this.calPrices = this.isCalenderPriceLoading = false;
          }
        }
      }
    }
  }


  getPriceLabel(type) {
    this.isCalenderPriceLoading = true;
    if (type == 'lowMinPrice') {

      let lowMinPrice = this.calenderPrices.filter(item => item.flag === 'low' && this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM') && this.currentYear == moment(item.date, 'DD/MM/YYYY').format('YYYY'));
      if (typeof lowMinPrice != 'undefined' && lowMinPrice.length) {
        this.lowMinPrice = this.getMinPrice(lowMinPrice)
      }
      this.isCalenderPriceLoading = false;
      return this.lowMinPrice.toFixed(2);
    }
    if (type == 'midMinPrice') {

      let midMinPrice = this.calenderPrices.filter(item => item.flag === 'medium' && this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM') && this.currentYear == moment(item.date, 'DD/MM/YYYY').format('YYYY'));
      if (typeof midMinPrice != 'undefined' && midMinPrice.length) {
        this.midMinPrice = this.getMinPrice(midMinPrice)
      }
      this.isCalenderPriceLoading = false;
      return this.midMinPrice.toFixed(2);
    }
    if (type == 'highMinPrice') {
      let highMinPrice = this.calenderPrices.filter(item => item.flag === 'high' && this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM') && this.currentYear == moment(item.date, 'DD/MM/YYYY').format('YYYY'));
      if (typeof highMinPrice != 'undefined' && highMinPrice.length) {
        this.highMinPrice = this.getMinPrice(highMinPrice)
      }
      this.isCalenderPriceLoading = false;
      return this.highMinPrice.toFixed(2);
    }
  }

  getMinPrice(prices) {
    if (prices.length > 0) {
      let values = prices.map(function (v) {
        if (v.secondary_start_price > 0) {
          if (v.secondary_start_price < 5) {
            return '$5.00';
          }
          return v.secondary_start_price;
        } else {
          if (v.price < 5) {
            return '$5.00';
          }
          return v.price;
        }
      });
      return Math.min.apply(null, values);
    } else {
      return 0;
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('__from');
    localStorage.removeItem('__to');
  }

  showAirportSuggestion(type) {
    this.showFromAirportSuggestion = false;
    this.showToAirportSuggestion = false;
    if (type == 'from') {
      this.showFromAirportSuggestion = true;
    }
    if (type == 'to') {
      this.showToAirportSuggestion = true;
    }
  }

  closeAirportSuggestion(type) {

    if (type == 'from') {
      this.showFromAirportSuggestion = false;
    }

    if (type == 'to') {
      this.showToAirportSuggestion = false;
    }
  }

  @HostListener('document:click')
  clickOutside() {
    if (!this.thisElementClicked) {
      this.showFromAirportSuggestion = false;
      this.showToAirportSuggestion = false;
    }
    this.thisElementClicked = false;
  }

  @HostListener('click')
  clickInside() {
    this.thisElementClicked = true;
  }

  searchAirport(event) {
    // console.log("event", event)
  }

  searchItem(data) {
    if (data.type == 'fromSearch') {
      if (data.key.length > 0) {
        this.showFromAirportSuggestion = false;
      }
      else {
        this.showFromAirportSuggestion = true;
      }
    }
    else {
      if (data.key.length > 0) {
        this.showToAirportSuggestion = false;
      }
      else {
        this.showToAirportSuggestion = true;
      }
    }
  }

  airportValueChange(event) {
    if (event.key == 'fromSearch') {
      this.fromSearch = event.value;
      this.searchedValue.push({ key: 'fromSearch', value: this.fromSearch });
    }
    else {
      this.toSearch = event.value;
      this.searchedValue.push({ key: 'toSearch', value: this.toSearch });
    }
    this.searchFlightInfo.departure = this.fromSearch.code;
    this.searchFlightInfo.arrival = this.toSearch.code;
  }

  getflightSearchRoutes(event){   
    this.showFromAirportSuggestion = true;
    this.searchedFlightData = event; 
    this.routeSearch = true; 
  }
  getflightToSearchRoutes(event){   
    this.showToAirportSuggestion = true;
    this.searchedFlightData = event; 
    this.routeSearch = true; 
  }
}
