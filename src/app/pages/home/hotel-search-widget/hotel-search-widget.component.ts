import { Component, OnInit, ViewChild } from '@angular/core';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-hotel-search-widget',
  templateUrl: './hotel-search-widget.component.html',
  styleUrls: ['./hotel-search-widget.component.scss'],
})
export class HotelSearchWidgetComponent implements OnInit {

  @ViewChild('dateFilter', /* TODO: add static flag */ undefined) private dateFilter: any;
  s3BucketUrl = environment.s3BucketUrl;
  countryCode: string;
  checkInDate = new Date();
  checkOutDate = new Date();
  rangeDates: Date[];
  maxDate: any = {};
  minDate: any = {};
  checkInMinDate;
  checkOutMinDate;
  isPrevButton = false;
  hotelSearchForm: FormGroup;
  //defaultCity = 'New York';
  //defaultHotelCountry = 'NY, United States';
  //fromDestinationTitle = 'New York, United States';
  fromDestinationInfo={
    title: "Cancún, Mexico",
    city: "Cancún",
    state: "",
    country: "Mexico",
    type: "city",
    hotel_id: null,
    geo_codes: {
      lat: 21.1613,
      long: -86.8341
    }
  }
  showHotelDropDown:boolean=false;
  hotelSearchFormSubmitted = false;
  searchHotelInfo: any = {
    latitude: null,
    longitude: null,
    check_in: null,
    check_out: null,
    occupancies: [
      {
        adults: null,
        children: []
      }
    ],
  };
  selectedGuest = 
    {
      rooms:1,
      adults: 1,
      child: 0,
      children: []
    }
  ;
  $dealLocatoin;

  showCommingSoon: boolean = false;
  customStartDateValidation = "2021-06-02";
  customEndDateValidation = "2021-06-03";

  constructor(
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private homeService: HomeService

  ) {
    this.hotelSearchForm = this.fb.group({
      fromDestination: ['', [Validators.required]],
    });
    
    this.setHotelDate();
    this.checkOutMinDate = this.checkInDate;

    this.checkOutDate = moment(this.checkInDate).add(1,'days').toDate();
    this.rangeDates = [this.checkInDate, this.checkOutDate];
    this.searchHotelInfo =
    {
      latitude: null,
      longitude: null,
      check_in: this.checkInDate,
      check_out: this.checkOutDate,
      location:{},
      occupancies: 
        {
          adults: null,
          children: []
        },
    };

    let host = window.location.origin;
    if (host.includes("staging")) {
      this.showCommingSoon = true;
    }
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.checkInDate = moment(this.customStartDateValidation).toDate();
    
    if(new Date(this.customStartDateValidation) <= new Date() ){
      this.checkInDate = moment().add('31','days').toDate();      
    }

    this.countryCode = this.commonFunction.getUserCountry();

    if (this.route && this.route.snapshot.queryParams['check_in']) {
      // this.$dealLocatoin.unsubscribe();  
      this.homeService.removeToString('hotel'); 

      this.checkInDate = new Date(this.route.snapshot.queryParams['check_in']);
      this.checkInMinDate = this.checkInDate;
      this.checkOutDate = new Date(this.route.snapshot.queryParams['check_out']);
      this.checkOutMinDate = this.checkOutDate;
      this.rangeDates = [this.checkInDate, this.checkOutDate];

      if (this.route && this.route.snapshot && this.route.snapshot.queryParams) {
        let info;
        this.searchHotelInfo =
        {
          latitude: this.route.snapshot.queryParams['latitude'],
          longitude: this.route.snapshot.queryParams['longitude'],
          check_in: moment(this.route.snapshot.queryParams['check_in']).format('MM/DD/YYYY'),
          check_out: moment(this.route.snapshot.queryParams['check_out']).format('MM/DD/YYYY'),
        };
        if (this.route.snapshot.queryParams['location']) {
          info = JSON.parse(atob(this.route.snapshot.queryParams['location']));
          this.searchHotelInfo.location=info;
          if (info) {
            this.fromDestinationInfo.title = info.title;
            this.fromDestinationInfo.city = info.city;
            this.fromDestinationInfo.country = info.country;
            this.searchHotelInfo.city = info.city;
            this.searchHotelInfo.country = info.country;
          }
        }
        if (this.route.snapshot.queryParams['itenery']) {
          info = JSON.parse(atob(this.route.snapshot.queryParams['itenery']));
          this.searchHotelInfo.occupancies = info;
          
        }
        console.log("this.searchHotelInfo",this.searchHotelInfo)
      }
    }
    else {
      this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat;
      this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long;
      this.searchHotelInfo.location=this.fromDestinationInfo;
    }
    this.$dealLocatoin = this.homeService.getLocationForHotelDeal.subscribe(hotelInfo=> {
      if(typeof hotelInfo != 'undefined' && Object.keys(hotelInfo).length > 0){      
        this.fromDestinationInfo.city = this.fromDestinationInfo.title = hotelInfo.city;
        this.searchHotelInfo.check_in =  this.checkInDate = moment().add(31,'days').toDate();
        this.searchHotelInfo.check_out = this.checkOutMinDate = this.checkOutDate = moment(this.searchHotelInfo.check_in).add(1,'days').toDate();
        this.searchHotelInfo.latitude =   hotelInfo.lat;
        this.searchHotelInfo.longitude = hotelInfo.long;
        
      this.checkInMinDate = moment(this.customStartDateValidation).toDate();

      this.rangeDates = [this.checkInDate, this.checkOutDate];
      }
    });
    this.homeService.removeToString('hotel'); 

    if (this.selectedGuest) {
      this.searchHotelInfo.occupancies = this.selectedGuest;
    }
  }

  setHotelDate(){

    var curretdate = moment().format();

    let  customStartDate :any =  moment(this.customStartDateValidation).format('YYYY-MM-DD');
    
    let daysDiff = moment(this.customEndDateValidation, "YYYY-MM-DD").diff(moment(curretdate, "YYYY-MM-DD"), 'days');
    if(curretdate < customStartDate && daysDiff > 30 ){    
      this.checkInDate =  moment(customStartDate).toDate();
       this.checkInMinDate = this.checkInDate; 
      } else if(daysDiff < 30){
        this.checkInDate =  moment(curretdate).add(31,'days').toDate();
        this.checkInMinDate = this.checkInDate; 
        // this.departureDate = date; 
      } else {
        this.checkInDate = moment(curretdate).add(31,'days').toDate(); 
        this.checkInMinDate = this.checkInDate; 
      // this.flightDepartureMinDate =  date;
    }
  }

  checkInDateUpdate(date) {
    // this is only for closing date range picker, after selecting both dates
    if (this.rangeDates[1]) { // If second date is selected
      this.dateFilter.hideOverlay();
    };
    let daysDiff = this.rangeDates[0] ? moment(this.rangeDates[1], "YYYY-MM-DD").diff(moment(this.rangeDates[0], "YYYY-MM-DD"), 'days') : 0;
    if(daysDiff == 0 ){
      // this.checkInMinDate = moment(this.rangeDates[0],'YYYY-MM-DD').add(1,'days').toDate();
      this.checkOutDate =  moment(this.rangeDates[0]).add(1,'days').toDate();
      this.rangeDates[1]= this.searchHotelInfo.check_out = this.checkOutDate;
    }
   
  }

  changeGuestInfo(event) {
     this.searchHotelInfo.occupancies = event;
  }


  searchHotels() {
    this.hotelSearchFormSubmitted = true;
    let queryParams: any = {};
    queryParams.check_in = moment(this.rangeDates[0]).format('YYYY-MM-DD');
    queryParams.check_out = moment(this.rangeDates[1]).format('YYYY-MM-DD');
    queryParams.latitude = parseFloat(this.searchHotelInfo.latitude);
    queryParams.longitude = parseFloat(this.searchHotelInfo.longitude);
    queryParams.itenery = btoa(JSON.stringify(this.searchHotelInfo.occupancies));
    queryParams.location = btoa(JSON.stringify(this.searchHotelInfo.location));
    console.log(queryParams,this.searchHotelInfo.occupancies)
    if (this.searchHotelInfo && this.searchHotelInfo.latitude && this.searchHotelInfo.longitude &&
      this.searchHotelInfo.check_in && this.searchHotelInfo.check_out && this.searchHotelInfo.occupancies) {
     
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['hotel/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
      });
    }
  }

  selectedHotel(event) {

    this.searchHotelInfo.location = event;
    this.searchHotelInfo.latitude = event.geo_codes.lat;
    this.searchHotelInfo.longitude = event.geo_codes.long;
  }
}
