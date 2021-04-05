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
  defaultCity = 'New York';
  defaultHotelCountry = 'NY, United States';
  fromDestinationTitle = 'New York, United States';
  fromDestinationInfo = {
    city: 'New York',
    country: 'United States',
    hotel_id: null,
    title: 'New York',
    type: 'city',
    geo_codes: { lat: 40.7681, long: -73.9819 },
  };
  searchedValue = [];
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
  customStartDateValidation = "2021-05-03";
  customEndDateValidation = "2021-05-04";

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
          if (info) {
            this.fromDestinationInfo.city = info.city;
            this.fromDestinationInfo.country = info.country;
            this.searchHotelInfo.city = info.city;
            this.searchHotelInfo.country = info.country;
          }
        }
        if (this.route.snapshot.queryParams['itenery']) {
          info = JSON.parse(atob(this.route.snapshot.queryParams['itenery']));
          if (info) {
            this.searchHotelInfo.occupancies = info;
          }
        }
      }
    }

   
    if (this.fromDestinationInfo) {
      this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat;
      this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long;
      this.searchedValue.push({ key: 'fromSearch', value: this.fromDestinationInfo });
    }
    this.$dealLocatoin = this.homeService.getLocationForHotelDeal.subscribe(toSearchString=> {
      if(typeof toSearchString != 'undefined' && Object.keys(toSearchString).length > 0){       
        console.log(toSearchString)
      this.fromDestinationInfo.city = 'Miami from deal';
      this.searchHotelInfo.latitude =  40.7681;
      this.searchHotelInfo.longitude =-73.9819;
      }
    });
    this.homeService.removeToString('hotel'); 

    if (this.selectedGuest) {
      this.searchedValue.push({ key: 'guest', value: this.selectedGuest });
    }
  }

  setHotelDate(){

    var curretdate = moment().format();

    let  juneDate :any =  moment(this.customStartDateValidation).format('YYYY-MM-DD');
    
    let daysDiffFromCurToJune = moment(this.customEndDateValidation, "YYYY-MM-DD").diff(moment(curretdate, "YYYY-MM-DD"), 'days');

    if(curretdate < juneDate && daysDiffFromCurToJune > 30 ){    
      this.checkInDate =  moment(juneDate).toDate();
       this.checkInMinDate = this.checkInDate; 
      } else if(daysDiffFromCurToJune < 30){
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
    if (this.rangeDates[0] && this.rangeDates[1]) {
      this.checkInDate = new Date();
      this.checkInMinDate = new Date();
      this.checkOutDate = this.rangeDates[1];
      this.checkOutMinDate = this.rangeDates[1];
      this.searchHotelInfo.check_in = this.rangeDates[0];
      this.searchHotelInfo.check_out = this.rangeDates[1];
    }
  }

  changeGuestInfo(event) {
    if (this.searchedValue && this.searchedValue.find(i => i.key === 'guest')) {
      this.searchedValue[1]['value'] = event;
      this.searchHotelInfo.occupancies = event;
      console.log(this.searchHotelInfo.occupancies)
    }
  }

  destinationChangedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      this.searchedValue[0]['value'] = event.value;
      this.fromDestinationTitle = event.value.title;
      this.searchHotelInfo.latitude = event.value.geo_codes.lat;
      this.searchHotelInfo.longitude = event.value.geo_codes.long;
    }
  }

  searchHotels() {
    this.hotelSearchFormSubmitted = true;
    let queryParams: any = {};
    queryParams.check_in = moment(this.searchHotelInfo.check_in).format('YYYY-MM-DD');
    queryParams.check_out = moment(this.searchHotelInfo.check_out).format('YYYY-MM-DD');
    queryParams.latitude = parseFloat(this.searchHotelInfo.latitude);
    queryParams.longitude = parseFloat(this.searchHotelInfo.longitude);
    queryParams.itenery = btoa(JSON.stringify(this.searchedValue[1]['value']));
    queryParams.location = btoa(JSON.stringify(this.searchedValue[0]['value']));
    console.log("queryParams",this.searchedValue[1]['value'])
    if (this.searchHotelInfo && this.searchHotelInfo.latitude && this.searchHotelInfo.longitude &&
      this.searchHotelInfo.check_in && this.searchHotelInfo.check_out && this.searchHotelInfo.occupancies) {
      // localStorage.setItem('_hote', JSON.stringify(this.searchedValue));
      // this.router.navigate(['hotel/search'], {
      //   queryParams: queryParams,
      //   queryParamsHandling: 'merge'
      // });
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['hotel/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
      });
    }
  }

}
