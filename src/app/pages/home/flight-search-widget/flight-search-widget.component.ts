import { Component, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Module } from '../../../model/module.model';
import { environment } from '../../../../environments/environment';
import { airports } from '../../flight/airports';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { CommonFunction } from '../../../_helpers/common-function';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../services/flight.service';
import { start } from 'repl';
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
  @Input() calenderPrices:any=[];
  switchBtnValue = false;
  isRoundTrip: boolean = false;
  flightSearchForm: FormGroup;
  flightSearchFormSubmitted = false;
  isCalenderPriceLoading:boolean=true;
  // DATE OF FROM_DESTINATION & TO_DESTINATION
  fromSearch = airports['JFK'];
  //fromDestinationCode = this.fromSearch.code;
  //departureCity = this.fromSearch.city;
  //departureAirportCountry =`${this.fromSearch.code}, ${this.fromSearch.country}`
  //fromAirport = airports[this.fromDestinationCode];
  countryCode: string;
  monthYearArr=[];
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
  lowMinPrice:number;
  midMinPrice:number;
  highMinPrice:number;
  calPrices = false;
  
  currentMonth;
  currentYear;

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
    private renderer: Renderer2,
    private flightService: FlightService,
    private homeService: HomeService
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

  data = '[{"date":"01/02/2021","net_rate":127.57,"price":172.22,"unique_code":"161d26c9ea484f4f6067b576207c0be3","start_price":0,"secondary_start_price":0,"flag":"high"},{"date":"02/02/2021","net_rate":127.58,"price":172.23,"unique_code":"78eb671592ee14cb793e89c8973f52bf","start_price":0,"secondary_start_price":0,"flag":"high"},{"date":"03/02/2021","net_rate":127.58,"price":172.23,"unique_code":"78eb671592ee14cb793e89c8973f52bf","start_price":0,"secondary_start_price":0,"flag":"high"},{"date":"04/02/2021","net_rate":126.08,"price":170.21,"unique_code":"2df410f5fc51f81ea2e15bfe57fca526","start_price":0,"secondary_start_price":0,"flag":"low"},{"date":"05/02/2021","net_rate":127.57,"price":172.22,"unique_code":"161d26c9ea484f4f6067b576207c0be3","start_price":0,"secondary_start_price":0,"flag":"high"},{"date":"06/02/2021","net_rate":127.57,"price":172.22,"unique_code":"161d26c9ea484f4f6067b576207c0be3","start_price":68.89,"secondary_start_price":51.66},{"date":"07/02/2021","net_rate":126.08,"price":170.21,"unique_code":"2df410f5fc51f81ea2e15bfe57fca526","start_price":68.08,"secondary_start_price":51.06},{"date":"08/02/2021","net_rate":127.57,"price":172.22,"unique_code":"161d26c9ea484f4f6067b576207c0be3","start_price":68.89,"secondary_start_price":51.66},{"date":"09/02/2021","net_rate":127.58,"price":172.23,"unique_code":"e59a4b86bb30b3f68478796382a8544b","start_price":68.89,"secondary_start_price":51.67},{"date":"10/02/2021","net_rate":127.58,"price":172.23,"unique_code":"061fd033b952f31b6940928546bad2a8","start_price":68.89,"secondary_start_price":51.67},{"date":"11/02/2021","net_rate":127.58,"price":172.23,"unique_code":"061fd033b952f31b6940928546bad2a8","start_price":68.89,"secondary_start_price":34.45},{"date":"12/02/2021","net_rate":127.57,"price":172.22,"unique_code":"c4212d5f2c5c31a39b6bcc453310b3ca","start_price":68.89,"secondary_start_price":34.44},{"date":"13/02/2021","net_rate":127.57,"price":172.22,"unique_code":"13bd4a7acc0749800243eafd35d55299","start_price":68.89,"secondary_start_price":34.44},{"date":"14/02/2021","net_rate":127.58,"price":172.23,"unique_code":"78eb671592ee14cb793e89c8973f52bf","start_price":68.89,"secondary_start_price":34.45},{"date":"15/02/2021","net_rate":126.08,"price":170.21,"unique_code":"47b72306707568014e2976740a124450","start_price":68.08,"secondary_start_price":34.04},{"date":"16/02/2021","net_rate":127.57,"price":172.22,"unique_code":"13bd4a7acc0749800243eafd35d55299","start_price":68.89,"secondary_start_price":34.44},{"date":"17/02/2021","net_rate":127.57,"price":172.22,"unique_code":"13bd4a7acc0749800243eafd35d55299","start_price":68.89,"secondary_start_price":34.44},{"date":"18/02/2021","net_rate":127.58,"price":172.23,"unique_code":"41eb586968c46040c6514480d1e7bbd9","start_price":68.89,"secondary_start_price":25.83},{"date":"19/02/2021","net_rate":127.58,"price":172.23,"unique_code":"b353f680a39ce224c14235ac56efd185","start_price":68.89,"secondary_start_price":25.83},{"date":"20/02/2021","net_rate":127.57,"price":172.22,"unique_code":"13bd4a7acc0749800243eafd35d55299","start_price":68.89,"secondary_start_price":25.83},{"date":"21/02/2021","net_rate":127.58,"price":172.23,"unique_code":"b353f680a39ce224c14235ac56efd185","start_price":68.89,"secondary_start_price":25.83},{"date":"22/02/2021","net_rate":127.58,"price":172.23,"unique_code":"b353f680a39ce224c14235ac56efd185","start_price":68.89,"secondary_start_price":25.83},{"date":"23/02/2021","net_rate":127.57,"price":172.22,"unique_code":"13bd4a7acc0749800243eafd35d55299","start_price":68.89,"secondary_start_price":25.83},{"date":"25/02/2021","net_rate":127.58,"price":172.23,"unique_code":"b353f680a39ce224c14235ac56efd185","start_price":68.89,"secondary_start_price":20.67},{"date":"26/02/2021","net_rate":127.57,"price":172.22,"unique_code":"13bd4a7acc0749800243eafd35d55299","start_price":68.89,"secondary_start_price":20.67},{"date":"28/02/2021","net_rate":127.58,"price":172.23,"unique_code":"b353f680a39ce224c14235ac56efd185","start_price":68.89,"secondary_start_price":20.67},{"date":"01/03/2021","net_rate":128.61,"price":173.62,"unique_code":"b353f680a39ce224c14235ac56efd185","start_price":69.45,"secondary_start_price":20.83,"flag":"high"},{"date":"02/03/2021","net_rate":128.6,"price":173.61,"unique_code":"13bd4a7acc0749800243eafd35d55299","start_price":69.44,"secondary_start_price":20.83,"flag":"high"},{"date":"03/03/2021","net_rate":128.6,"price":173.61,"unique_code":"13bd4a7acc0749800243eafd35d55299","start_price":69.44,"secondary_start_price":20.83,"flag":"high"},{"date":"04/03/2021","net_rate":128.61,"price":173.62,"unique_code":"524107c5f43547d4dfbaf9b3b69227cc","start_price":69.45,"secondary_start_price":17.36,"flag":"medium"},{"date":"05/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":17.36,"flag":"medium"},{"date":"06/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":17.36,"flag":"medium"},{"date":"07/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":17.36,"flag":"medium"},{"date":"08/03/2021","net_rate":128.61,"price":173.62,"unique_code":"524107c5f43547d4dfbaf9b3b69227cc","start_price":69.45,"secondary_start_price":17.36,"flag":"medium"},{"date":"09/03/2021","net_rate":128.61,"price":173.62,"unique_code":"524107c5f43547d4dfbaf9b3b69227cc","start_price":69.45,"secondary_start_price":17.36,"flag":"medium"},{"date":"10/03/2021","net_rate":128.61,"price":173.62,"unique_code":"524107c5f43547d4dfbaf9b3b69227cc","start_price":69.45,"secondary_start_price":17.36,"flag":"medium"},{"date":"11/03/2021","net_rate":128.6,"price":173.61,"unique_code":"49764a9d81b8e077f508100690f006ce","start_price":69.44,"secondary_start_price":14.88,"flag":"medium"},{"date":"12/03/2021","net_rate":128.6,"price":173.61,"unique_code":"52a78c0097ebecb9572dbc376ba96d66","start_price":69.44,"secondary_start_price":14.88,"flag":"medium"},{"date":"13/03/2021","net_rate":128.6,"price":173.61,"unique_code":"49764a9d81b8e077f508100690f006ce","start_price":69.44,"secondary_start_price":14.88,"flag":"medium"},{"date":"14/03/2021","net_rate":128.61,"price":173.62,"unique_code":"e5bdac81511967b35efbd3919dc51e60","start_price":69.45,"secondary_start_price":14.88,"flag":"medium"},{"date":"15/03/2021","net_rate":128.61,"price":173.62,"unique_code":"524107c5f43547d4dfbaf9b3b69227cc","start_price":69.45,"secondary_start_price":14.88,"flag":"medium"},{"date":"16/03/2021","net_rate":128.61,"price":173.62,"unique_code":"524107c5f43547d4dfbaf9b3b69227cc","start_price":69.45,"secondary_start_price":14.88,"flag":"medium"},{"date":"17/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":14.88,"flag":"medium"},{"date":"18/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":13.02,"flag":"low"},{"date":"19/03/2021","net_rate":132.84,"price":179.33,"unique_code":"e5bdac81511967b35efbd3919dc51e60","start_price":71.73,"secondary_start_price":13.45,"flag":"low"},{"date":"20/03/2021","net_rate":128.61,"price":173.62,"unique_code":"4bda5f68ee331a9317c5ea53b7727497","start_price":69.45,"secondary_start_price":13.02,"flag":"low"},{"date":"21/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":13.02,"flag":"low"},{"date":"22/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":13.02,"flag":"low"},{"date":"23/03/2021","net_rate":128.61,"price":173.62,"unique_code":"524107c5f43547d4dfbaf9b3b69227cc","start_price":69.45,"secondary_start_price":13.02,"flag":"low"},{"date":"24/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":13.02,"flag":"low"},{"date":"25/03/2021","net_rate":128.61,"price":173.62,"unique_code":"524107c5f43547d4dfbaf9b3b69227cc","start_price":69.45,"secondary_start_price":11.57,"flag":"low"},{"date":"26/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":11.57,"flag":"low"},{"date":"27/03/2021","net_rate":128.6,"price":173.61,"unique_code":"b7b373c1f20ba3f1c3bb863994e15747","start_price":69.44,"secondary_start_price":11.57,"flag":"low"},{"date":"28/03/2021","net_rate":128.61,"price":173.62,"unique_code":"a39576b910dc3dcd168a41769e6701f6","start_price":69.45,"secondary_start_price":11.57,"flag":"low"},{"date":"29/03/2021","net_rate":128.61,"price":173.62,"unique_code":"be25e65dcd8e95264547487ac0e550d3","start_price":69.45,"secondary_start_price":11.57,"flag":"low"},{"date":"30/03/2021","net_rate":128.61,"price":173.62,"unique_code":"f1aa035bf8f8293cd36578e3e5c0db37","start_price":69.45,"secondary_start_price":11.57,"flag":"low"},{"date":"31/03/2021","net_rate":128.61,"price":173.62,"unique_code":"a39576b910dc3dcd168a41769e6701f6","start_price":69.45,"secondary_start_price":11.57,"flag":"low"}]';

  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.homeService.getToString.subscribe(toSearchString=>{
      if(typeof toSearchString != 'undefined' && Object.keys(toSearchString).length > 0){        
        let keys : any = toSearchString;
        this.toSearch = null;    
        // if(typeof this.toSearch != 'undefined'){
          this.toSearch = airports[keys];
          // this.toSearch['getDates'] = `${this.toSearch.city},${this.toSearch.country},(${this.toSearch.code}),${this.toSearch.name}`;
          this.searchFlightInfo.arrival = this.toSearch.code;

        // }
      }
    });

    this.countryCode = this.commonFunction.getUserCountry();
    if(this.calenderPrices.length == 0){
      this.isCalenderPriceLoading=false;
    }
    this.route.queryParams.subscribe(params => {
      
      if(Object.keys(params).length > 0){ 
        this.calPrices = true;     
          this.fromSearch = airports[params['departure']];
          //this.fromDestinationCode = this.fromSearch.code;
          //this.departureCity = this.fromSearch.city;toSearch
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
          // this.returnDate = new Date(params['arrival_date']);
          this.returnDate = params['arrival_date'] ? new Date(params['arrival_date']) : new Date(moment(params['departure_date']).add(7, 'days').format('MM/DD/YYYY'));
          this.rangeDates = [this.departureDate, this.returnDate];
      } else {
        this.calPrices = false;
      }
    });
   
    this.lowMinPrice= this.midMinPrice = this.highMinPrice = 0;      
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if(typeof changes['calenderPrices'].currentValue !='undefined' && changes['calenderPrices'].firstChange==false){
      // this.isCalenderPriceLoading=false;
      // this.getMinimumPricesList(changes['calenderPrices'].currentValue);
    }
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
      /* this.router.navigate(['flight/search'], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }); */
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['flight/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
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
  ngAfterViewChecked(){
    setTimeout(() => {
      this.isCalenderPriceLoading = false;
    }, 2000);
  }

  getPrice(d,m,y){
   this.isCalenderPriceLoading = true;
    this.lowMinPrice= this.midMinPrice = this.highMinPrice = 0;      
    this.currentMonth = m ==1 ? '0'+m : m;
    this.currentYear = y;
    let month:any=parseInt(m)+1;
    let day  = d.toString().length==1 ? '0'+d : d;
    month    = month.toString().length==1 ? '0'+month : month;
    let date = `${day}/${month}/${y}`;
    let price:any = this.calenderPrices.find((d:any)=> d.date == date);
   
    this.getMinimumPricesList(this.calenderPrices);
    var event = {"month":m,"year":y};
    if(price){
      // this.isCalenderPriceLoading = false;
      
      if(price.secondary_start_price>0){
        if(price.secondary_start_price<5){
          return '5.00';
        }
        return `$${price.secondary_start_price.toFixed(2)}`;
      }
      return `$${price.price.toFixed(2)}`;
    }
  }

  getPriceClass(d,m,y){
    let month:any=parseInt(m)+1;
    let day  = d.toString().length==1 ? '0'+d : d;
    month    = month.toString().length==1 ? '0'+month : month;
    let date = `${day}/${month}/${y}`;
    let price:any = this.calenderPrices.find((d:any)=> d.date == date);
    if(price){

      if(price.secondary_start_price>0){
        return `${price.flag}`;
      }
      return `${price.flag}`;
    }
  }

  changeMonth(event){
    this.lowMinPrice= this.highMinPrice = this.midMinPrice = 0;
    
    this.route.queryParams.subscribe(params => {      
      this.calPrices = false;
      if(Object.keys(params).length > 0){ 
        this.calPrices = true;
      } 
    });

    this.currentMonth = event.month.length ==1 ? '0'+event.month : event.month;
    this.currentYear = event.year;

    if(!this.isRoundTrip){
      let month=event.month;
      month = month.toString().length==1?'0'+month:month;
      let monthYearName = `${month}-${event.year}`;
      
      if(!this.monthYearArr.includes(monthYearName) && this.calPrices){
        this.monthYearArr.push(monthYearName);
        let startDate:any = moment([event.year,event.month-1]);
        let endDate:any =  moment(startDate).endOf('month');
        
        startDate = moment(startDate.toDate()).format("YYYY-MM-DD");
        endDate = moment(endDate.toDate()).format("YYYY-MM-DD");

        if(!moment().isBefore(startDate)){
          startDate = moment().format("Y@YYY-MM-DD");
        }

        let payload={
          source_location: this.route.snapshot.queryParams['departure'],
          destination_location: this.route.snapshot.queryParams['arrival'],
          flight_class: this.route.snapshot.queryParams['class'],
          adult_count: this.route.snapshot.queryParams['adult'],
          child_count: this.route.snapshot.queryParams['child'],
          infant_count: this.route.snapshot.queryParams['infant'],
          start_date :startDate,
          end_date :endDate
        }
        var CurrentDate = new Date();
        var GivenDate = new Date(endDate);

        if(GivenDate > CurrentDate || CurrentDate < new Date(startDate)){
          this.lowMinPrice= this.highMinPrice = this.midMinPrice = 0;
          this.isCalenderPriceLoading = this.calPrices = true;
            
          this.flightService.getFlightCalenderDate(payload).subscribe((res:any) => {
              this.calenderPrices = [...this.calenderPrices,...res];
              this.getMinimumPricesList(this.calenderPrices);

              this.isCalenderPriceLoading = false;
          }, err => {
            this.calPrices = false;
            this.isCalenderPriceLoading = false;
          });
        } else {
          this.calPrices =  this.isCalenderPriceLoading=  false;
        }
      }
    }
  }

  getMinimumPricesList(prices){  
  
    this.lowMinPrice = this.getMinPrice(prices.filter(item => item.flag === 'low' && this.currentMonth == moment(item.date, 'YYYY-MM-DD').format('MM')  && this.currentYear == new Date(item.date).getFullYear()));// /* && this.currentMonth === item.date.getMonth() && this.currentYear === item.date.getYear() */));
    this.midMinPrice =  this.getMinPrice(prices.filter(item => item.flag === 'medium' && this.currentMonth == moment(item.date, 'YYYY-MM-DD').format('MM')  && this.currentYear == new Date(item.date).getFullYear()));///* && this.currentMonth === item.date.getMonth() && this.currentYear === item.date.getYear() */));
    this.highMinPrice =  this.getMinPrice(prices.filter(item => item.flag === 'high' && this.currentMonth == moment(item.date, 'YYYY-MM-DD').format('MM')  && this.currentYear == new Date(item.date).getFullYear()));// /* && this.currentMonth === book.date.getMonth() && this.currentYear === book.date.getYear() */));
    // console.log(this.lowMinPrice,this.midMinPrice,this.highMinPrice)
  }

  getMinPrice(prices){
    if(prices.length > 0){    
      let values  = prices.map(function(v) {
        if(v.secondary_start_price > 0 ){
          if(v.secondary_start_price < 5){
            return '5.00';
          }
          return v.secondary_start_price;
        } else {
          if(v.price < 5){
            return '5.00';
          }
          return v.price;
        }
      });
    
      return Math.min.apply( null, values );
    } else {
      return 0;
    }
 }

}
