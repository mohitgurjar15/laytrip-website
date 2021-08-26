import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../../model/module.model';
import { environment } from '../../../../environments/environment';
import { airports } from '../../flight/airports';
import * as moment from 'moment';
import { CommonFunction } from '../../../_helpers/common-function';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../services/flight.service';
import { HomeService } from '../../../services/home.service';
import { CalendarTranslations } from 'src/app/_helpers/generic.helper';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-flight-search-widget',
  templateUrl: './flight-search-widget.component.html',
  styleUrls: ['./flight-search-widget.component.scss']
})
export class FlightSearchWidgetComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @ViewChild('dateFilter', /* TODO: add static flag */ undefined) private dateFilter: any;
  rangeDates: Date[];
  @Output() currentChangeCounter = new EventEmitter();
  modules: Module[];
  moduleList: any = {};
  @Input() calenderPrices: any = [];
  @Input() currentSlide;
  switchBtnValue = false;
  @Input() currentTabName : string = 'hotel';
  isRoundTrip: boolean = true;
  flightSearchForm: FormGroup;
  flightSearchFormSubmitted = false;
  isCalenderPriceLoading: boolean = true;
  fromSearch: any = {};
  countryCode: string;
  monthYearArr = [];
  toSearch: any = {};

  locale = {
    format: 'MM/DD/YYYY',
    displayFormat: 'MM/DD/YYYY'
  };

  flightDepartureMinDate;
  flightReturnMinDate;
  departureDate;
  returnDate;
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
  counterChangeVal :number = 0;
  isDatePickerOpen : boolean = false;
  progressInterval;

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
  isRefferal = this.commonFunction.isRefferal();
  calendersFullPaymentLength = 0;

  cal_locale = CalendarTranslations["en"];
  cal_loaded: boolean = true;
  
  constructor(
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private flightService: FlightService,
    private homeService: HomeService,
    private translate: TranslateService
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

    this.setDefaultDate();

    this.flightReturnMinDate = this.departureDate;
    this.countryCode = this.commonFunction.getUserCountry();
    this.rangeDates = [this.departureDate, this.returnDate];

    translate.onLangChange.subscribe(lang => this.setCalendarLocale());
  }

  ngOnInit(): void {
    this.fromSearch = [];

    this.setCalendarLocale();
  
    if(this.commonFunction.isRefferal()){
      this.homeService.getSlideOffers.subscribe(currentSlide => {
        if (typeof currentSlide != 'undefined' && Object.keys(currentSlide).length > 0) {
          let slide: any = currentSlide;
          this.fromSearch = Object.assign({},airports[slide.location.from.airport_code]);            
            this.toSearch =  Object.assign({},airports[slide.location.to.airport_code]);          
            this.searchFlightInfo.departure = this.fromSearch.code;
            this.departureDate = moment().add(91, 'days').toDate();
            this.searchFlightInfo.arrival = this.toSearch.code;

            if (this.isRoundTrip) {
              this.returnDate =  moment().add(97, 'days').toDate();
              this.rangeDates = [this.departureDate, this.returnDate];
            }
          }
        })
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
        
        this.currentMonth = moment(this.departureDate).format("MM");
        this.currentYear = moment(this.departureDate).format("YYYY");
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

        this.fromSearch = airports['NYC'];
        this.searchFlightInfo.departure = this.fromSearch.code;
        this.toSearch = airports[keys];
        this.departureDate = this.isRefferal ? moment().add(91, 'days').toDate() : moment().add(2, 'days').toDate();
        this.searchFlightInfo.arrival = this.toSearch.code;

        if (this.isRoundTrip) {
          this.rangeDates = [this.departureDate, this.isRefferal ? moment().add(97, 'days').toDate() : moment(this.departureDate).add(7, 'days').toDate()];
        } 
      }
    });
    //delete BehaviorSubject at the end
    this.homeService.removeToString('flight');
    this.lowMinPrice = this.midMinPrice = this.highMinPrice = 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    //if tab changed then show round-trip default || get tabname with change value 
    if(changes['currentTabName'] && changes['currentTabName'].currentValue != 'undefined'){
      this.isRoundTrip = true;    
    }
    if (changes['calenderPrices'] && changes['calenderPrices'].currentValue != 'undefined'){
      //get calender installemnt length
      this.calendersFullPaymentLength = this.calenderPrices.filter(item => item.isPriceInInstallment == false).length;
    }
  }

  setDefaultDate() {

    this.departureDate = this.flightDepartureMinDate = this.isRefferal ? moment().add(91, 'days').toDate() :moment().add(2, 'days').toDate();     
    this.returnDate = this.isRefferal ? moment(this.departureDate).add(97, 'days').toDate() : moment(this.departureDate).add(7, 'days').toDate();

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
    this.currentChangeCounter.emit(this.counterChangeVal += 1);

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
    //for stop landing slider 
    this.currentChangeCounter.emit(this.counterChangeVal += 1);
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
  datePickerShow(event){
    this.currentChangeCounter.emit(this.counterChangeVal += 1);
  }
  selectReturnDateUpdate(date) {
    this.currentChangeCounter.emit(this.counterChangeVal += 1);

    // this is only for closing date range picker, after selecting both dates
    if (this.rangeDates[1]) { // If second date is selected
      this.dateFilter.hideOverlay(); 
    };
    if (this.rangeDates[0] && this.rangeDates[1]) {
      this.returnDate = this.rangeDates[1];
      this.departureDate = this.rangeDates[0];
      if (!moment(this.rangeDates[1]).isAfter(moment(this.rangeDates[0]))) {
        this.returnDate = moment(this.rangeDates[0]).add(7, 'days').toDate();
      }
      this.rangeDates = [this.departureDate, this.returnDate];
    }
  }


  getPrice(d, m, y) {

    this.lowMinPrice = this.midMinPrice = this.highMinPrice = 0;
    let month: any = parseInt(m) + 1;
    let day = d.toString().length == 1 ? '0' + d : d;
    month = month.toString().length == 1 ? '0' + month : month;
    let date = `${day}/${month}/${y}`;
    let price: any = this.calenderPrices.find((d: any) => d.date == date);
    if (price && price.isPriceInInstallment ) {
      if (price.start_price > 0) {
        return `$${price.secondary_start_price.toFixed(2)}`;
      }
      // return `$${price.price.toFixed(2)}`;
    }
  }

  getPriceClass(d, m, y) {
    let month: any = parseInt(m) + 1;
    let day = d.toString().length == 1 ? '0' + d : d;
    month = month.toString().length == 1 ? '0' + month : month;
    let date = `${day}/${month}/${y}`;
    let price: any = this.calenderPrices.find((d: any) => d.date == date);
    if (price) {

      if (price.start_price > 0 && price.isPriceInInstallment) {
        return `${price.flag}`;
      } else {
        return 'full_payment';
      }
      // return `${price.flag}`;
    } else {
      // console.log('no')
    }
  }
  
  timer=0;
  changeMonth(event) {

    var currentDate = new Date();
    // 1 June validation apply
    
    this.lowMinPrice = this.highMinPrice = this.midMinPrice = 0;

    this.route.queryParams.subscribe(params => {
      this.calPrices = false;
      if (Object.keys(params).length > 0) {
        this.calPrices = true;
      }
    });

    this.currentMonth = event.month.toString().length == 1 ? '0' + event.month : event.month;
    this.currentYear = event.year;
    //&& moment().format('MM') <= this.currentMonth
    let currCalYYMM = moment(this.currentMonth+'-'+this.currentYear,'MM-YY').add(1,'years').format("YYYY-MM");
    let calApplyDiff = moment(currCalYYMM, "YYYY-MM").diff(moment().format( "YYYY-MM"), 'days')
        
    if (!this.isRoundTrip && (calApplyDiff > 0  || calApplyDiff <= 365)  ) {
      let month = event.month;
      month = month.toString().length == 1 ? '0' + month : month;
      let monthYearName = `${month}-${event.year}`;
      
      // if (!this.isRoundTrip && moment(moment(currCalYYMM, "YYYY-MM")).diff(moment().format( "YYYY-MM"), 'days') < 0) {//&& moment().format('MM') <= this.currentMonth
      //   let month = event.month;
      //   month = month.toString().length == 1 ? '0' + month : month;
      //   let monthYearName = `${month}-${event.year}`;
      
      //   if (moment(calLastYYMM, "YYYY-MM").diff(moment(currCalYYMM, "YYYY-MM"), 'days') > 0 && this.calPrices) {
      if  (this.calPrices) {
        this.monthYearArr.push(monthYearName);
        let startDate: any = moment([event.year, event.month - 1]);
        let endDate: any = moment(startDate).endOf('month');

        startDate = moment(startDate.toDate()).format("YYYY-MM-DD");
        endDate = moment(endDate.toDate()).format("YYYY-MM-DD");

        if (!moment().isBefore(startDate)) {
          startDate = moment().add(2, 'days').format("YYYY-MM-DD");
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
        if (GivenDate > currentDate || currentDate < new Date(startDate)) {
          this.lowMinPrice = this.highMinPrice = this.midMinPrice = 0;
          this.isCalenderPriceLoading = this.calPrices = true;

          this.flightService.getFlightCalenderDate(payload).subscribe((res: any) => {
            this.calenderPrices = [...this.calenderPrices, ...res];
            this.isCalenderPriceLoading = false;

            //get calender installemnt length
            this.calendersFullPaymentLength = this.calenderPrices.filter(item => item.isPriceInInstallment == false && this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM')).length;
          }, err => {
            this.calPrices = false;
            this.isCalenderPriceLoading = false;
          });
        } else {
          this.calPrices = this.isCalenderPriceLoading = false;
        }      
      } else {
        //get calender installemnt length
        this.calendersFullPaymentLength =  this.calenderPrices.filter(item => item.isPriceInInstallment == false && this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM')).length;
       }
    } 
  }
  

  getPriceLabel(type) {
    this.isCalenderPriceLoading = true;
    if (type == 'lowMinPrice') {

      let lowMinPrice = this.calenderPrices.filter(item => item.isPriceInInstallment == true && item.flag === 'low' && this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM') && this.currentYear == moment(item.date, 'DD/MM/YYYY').format('YYYY'));
      if (typeof lowMinPrice != 'undefined' && lowMinPrice.length) {
        this.lowMinPrice = this.getMinPrice(lowMinPrice)
      }
      this.isCalenderPriceLoading = false;
      return this.lowMinPrice.toFixed(2);
    }
    if (type == 'midMinPrice') {

      let midMinPrice = this.calenderPrices.filter(item => item.isPriceInInstallment == true &&  item.flag === 'medium' && this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM') && this.currentYear == moment(item.date, 'DD/MM/YYYY').format('YYYY'));
      if (typeof midMinPrice != 'undefined' && midMinPrice.length) {
        this.midMinPrice = this.getMinPrice(midMinPrice)
      }
      this.isCalenderPriceLoading = false;
      return this.midMinPrice.toFixed(2);
    }
    if (type == 'highMinPrice') {
      let highMinPrice = this.calenderPrices.filter(item => item.isPriceInInstallment == true &&  item.flag === 'high' && this.currentMonth == moment(item.date, 'DD/MM/YYYY').format('MM') && this.currentYear == moment(item.date, 'DD/MM/YYYY').format('YYYY'));
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
        if (v.start_price > 0) {
          if (v.secondary_start_price < 5) {
            return '$5.00';
          }
          return v.secondary_start_price;
        } /* else {
          if (v.price < 5) {
            return '$5.00';
          }
          return v.price;
        } */
      });
      return Math.min.apply(null, values) ? Math.min.apply(null, values) : 0;
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
    console.log(type)
    if (type == 'from') {
      this.showFromAirportSuggestion = true;
    }
    if (type == 'to') {
      this.showToAirportSuggestion = true;
    }
  }

  closeAirportSuggestion(type) {
    this.searchedFlightData = [];
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
    this.currentChangeCounter.emit(this.counterChangeVal += 1);

  }
  getflightToSearchRoutes(event) {
    this.showToAirportSuggestion = true;
    this.searchedFlightData = event; 
    this.routeSearch = true; 
  }

  counterValueChanged(event) {  
    this.currentChangeCounter.emit(event);
  }
  
  datepickerShow(){
    this.isDatePickerOpen = true;  
    if(this.commonFunction.isRefferal()){
      this.progressInterval = setInterval(() => {
        if(this.isDatePickerOpen){
          this.currentChangeCounter.emit(this.counterChangeVal += 1);
        } else {
          clearInterval(this.progressInterval);
        }
      }, 1000);   
    }
  }

  datepickerClose(){      
    this.isDatePickerOpen = false;
  }

  // Author: xavier | 2021/8/17
  // Description: Calendar localization
  // The input field does not refresh when changing the locale:
  //  https://github.com/primefaces/primeng/issues/1706
  // Probably a better approach?
  //  https://github.com/primefaces/primeng/issues/5151#issuecomment-763918829
  setCalendarLocale() {
    this.cal_loaded = false;
    let userLang = JSON.parse(localStorage.getItem('_lang'));
    if(userLang == null) {
      this.cal_locale = CalendarTranslations["en"];
    } else {
      this.cal_locale = CalendarTranslations[userLang.iso_1Code];
    }
    setTimeout(() => this.cal_loaded = true, 0);
  }
}
