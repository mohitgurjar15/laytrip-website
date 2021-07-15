import { ChangeDetectorRef, Component, Input, OnInit, Output, ViewChild ,EventEmitter} from '@angular/core';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../../services/home.service';

@Component({
  selector: 'app-hotel-search-widget',
  templateUrl: './hotel-search-widget.component.html',
  styleUrls: ['./hotel-search-widget.component.scss'],
})
export class HotelSearchWidgetComponent implements OnInit {

  @ViewChild('dateFilter', /* TODO: add static flag */ undefined) private dateFilter: any;
  s3BucketUrl = environment.s3BucketUrl;
  @Input() currentSlide;
  countryCode: string;
  @Output() currentChangeCounter = new EventEmitter();
  checkInDate = new Date();
  checkOutDate: any = new Date();
  rangeDates: Date[];
  maxDate: any = {};
  minDate: any = {};
  checkInMinDate;
  checkOutMinDate;
  hotelSearchForm: FormGroup;
  validSearch: boolean = true;
  fromDestinationInfo = {
    title: "Cancún, Mexico",
    city: "Cancún",
    state: "",
    city_id: 800026864,
    country: "Mexico",
    type: "city",
    hotel_id: null,
    geo_codes: {
      lat: 21.1613,
      long: -86.8341
    }
  }
  showHotelDropDown: boolean = false;
  hotelSearchFormSubmitted = false;
  searchHotelInfo: any = {
    latitude: null,
    longitude: null,
    check_in: null,
    check_out: null,
    city_id: '',
    city: '',
    occupancies: [
      {
        adults: null,
        children: []
      }
    ],
  };
  progressInterval;  
  selectedGuest = {
    rooms: 1,
    adults: 1,
    child: 0,
    children: []
  };
  $dealLocatoin;

  showCommingSoon: boolean = false;
  isDatePickerOpen : boolean = false;
  isRefferal = this.commonFunction.isRefferal();
  constructor(
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private homeService: HomeService,
    public cd: ChangeDetectorRef

  ) {

    this.hotelSearchForm = this.fb.group({
      fromDestination: ['', [Validators.required]],
    });

    this.checkInDate = this.checkInMinDate = this.checkOutMinDate= moment().add(2, 'days').toDate(); 
    this.checkOutDate = moment(this.checkInDate).add(1, 'days').toDate();
    this.rangeDates = [this.checkInDate, this.checkOutDate];
    
    this.searchHotelInfo =
    {
      latitude: null,
      longitude: null,
      check_in: this.checkInDate,
      check_out: this.checkOutDate,
      location: {},
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
    this.homeService.getSlideOffers.subscribe(currentSlide => {
      if (this.commonFunction.isRefferal()) {        
        this.dealDateValidation();
        if (typeof currentSlide == 'undefined') {
          //Condition apply when page is init first time and by default show miami
          this.fromDestinationInfo.city = 'Miami Beach';
          this.fromDestinationInfo.title = 'Miami Beach, Florida, United States';
          this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat = 25.7903;
          this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long = -80.1303;
          this.searchHotelInfo.city_id = this.fromDestinationInfo.city_id = 800047419;
          this.searchHotelInfo.location = this.fromDestinationInfo;
          this.validateSearch(true);
        }
        if (typeof currentSlide != 'undefined' && Object.keys(currentSlide).length > 0) {

          let keys: any = currentSlide;
          this.fromDestinationInfo.title = keys.location.to.hotel_option.title;          
          this.fromDestinationInfo.city = this.searchHotelInfo.city = keys.location.to.hotel_option.city;
          this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat = keys.location.to.hotel_option.geo_codes.lat;
          this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long = keys.location.to.hotel_option.geo_codes.long;
          this.searchHotelInfo.city_id = this.fromDestinationInfo.city_id = keys.location.to.hotel_option.city_id;
          this.searchHotelInfo.location = this.fromDestinationInfo;
          this.validateSearch(true);
        }
      }
    });
    this.countryCode = this.commonFunction.getUserCountry();

    if (this.route && this.route.snapshot.queryParams['check_in']) {
      this.homeService.removeToString('hotel');

      this.checkInDate = moment(this.route.snapshot.queryParams['check_in']).toDate();
      
      this.checkInMinDate = this.isRefferal ? moment().add(31, 'days').toDate() : moment().add(2, 'days').toDate();
      this.checkOutDate = moment(this.route.snapshot.queryParams['check_out']).isValid() ? moment(this.route.snapshot.queryParams['check_out']).toDate() : moment(this.route.snapshot.queryParams['check_in']).add(1, 'days').toDate();
      
      this.checkOutMinDate = this.checkOutDate;
      this.rangeDates = [this.checkInDate, this.checkOutDate];

      let info;
      this.searchHotelInfo =
      {
        latitude: this.route.snapshot.queryParams['latitude'],
        longitude: this.route.snapshot.queryParams['longitude'],
        check_in: moment(this.route.snapshot.queryParams['check_in']).format('MM/DD/YYYY'),
        check_out: moment(this.checkOutDate).format('MM/DD/YYYY'),
        city_id: this.route.snapshot.queryParams['city_id'],
        city_name: this.route.snapshot.queryParams['city_name'],
        hotel_id: this.route.snapshot.queryParams['hotel_id'],
      };
      if (this.route.snapshot.queryParams['hotel_name']) {
        this.searchHotelInfo.hotel_name  = this.route.snapshot.queryParams['hotel_name'];
      }
      if (this.route.snapshot.queryParams['location']) {
        info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['location'])));
        this.searchHotelInfo.location = info;
        if (info) {
          this.fromDestinationInfo.title = info.title;
          this.fromDestinationInfo.city = info.city;
          this.fromDestinationInfo.country = info.country;
          this.searchHotelInfo.city = info.city;
          this.searchHotelInfo.country = info.country;
        }
      }
      if (this.route.snapshot.queryParams['itenery']) {
        info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['itenery'])));
        this.searchHotelInfo.occupancies = info;
      }
    } else {
      this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat;
      this.searchHotelInfo.city_id = this.fromDestinationInfo.city_id;
      this.searchHotelInfo.city = this.fromDestinationInfo.city;
      this.searchHotelInfo.hotel_id = this.fromDestinationInfo.hotel_id;
      this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long;
      this.searchHotelInfo.location = this.fromDestinationInfo;
      this.searchHotelInfo.occupancies = this.selectedGuest;
    }
    this.$dealLocatoin = this.homeService.getLocationForHotelDeal.subscribe(hotelInfo => {
      if (typeof hotelInfo != 'undefined' && Object.keys(hotelInfo).length > 0) {
        this.dealDateValidation();
        this.fromDestinationInfo.title = hotelInfo.title;
        this.fromDestinationInfo.city = this.searchHotelInfo.city =hotelInfo.city;
        this.searchHotelInfo.latitude = this.fromDestinationInfo.geo_codes.lat = hotelInfo.lat;
        this.searchHotelInfo.longitude = this.fromDestinationInfo.geo_codes.long = hotelInfo.long;
        this.searchHotelInfo.city_id = this.fromDestinationInfo.city_id = hotelInfo.city_id;
        this.searchHotelInfo.location = this.fromDestinationInfo;

        this.validateSearch(true);
      }
    });
    this.homeService.removeToString('hotel');
  }

  dealDateValidation() {
    if (!this.commonFunction.isRefferal()) {
      this.searchHotelInfo.check_in = this.checkInDate = moment().add(2, 'days').toDate();
    } else {
      this.searchHotelInfo.check_in = this.checkInDate = moment().add(91, 'days').toDate();
    }        
    this.searchHotelInfo.check_out = this.checkOutMinDate = this.checkOutDate = moment(this.searchHotelInfo.check_in).add(1, 'days').toDate();
    this.rangeDates = [this.checkInDate, this.checkOutDate];
  } 

  selectCheckInDateUpdate(date) {
    // this is only for closing date range picker, after selecting both dates
    if (this.rangeDates[1]) { // If second date is selected
      this.dateFilter.hideOverlay();
    };
    let daysDiff = this.rangeDates[0] ? moment(this.rangeDates[1], "YYYY-MM-DD").diff(moment(this.rangeDates[0], "YYYY-MM-DD"), 'days') : 0;
    if (daysDiff == 0) {
      this.checkOutDate = moment(this.rangeDates[0]).add(1, 'days').toDate();
      this.rangeDates[1] = this.searchHotelInfo.check_out = this.checkOutDate;
    }

  }

  changeGuestInfo(event) {
    this.searchHotelInfo.occupancies = event;
  }
  fromBinary(encoded) {
    var binary = atob(encoded)
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
  }

  toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
  }

  searchHotels() {
    this.hotelSearchFormSubmitted = true;
    if ($('.hotel_desination').val() == '') {
      this.validSearch = false;
    }
    let queryParams: any = {};

    queryParams.check_in = moment(this.rangeDates[0]).format('YYYY-MM-DD');
    queryParams.check_out = moment(this.rangeDates[1]).isValid() ? moment(this.rangeDates[1]).format('YYYY-MM-DD') : moment(this.rangeDates[0]).add(1, 'days').format('YYYY-MM-DD');
    queryParams.check_out = moment(this.rangeDates[1]).format('YYYY-MM-DD');
    queryParams.latitude = parseFloat(this.searchHotelInfo.latitude);
    queryParams.longitude = parseFloat(this.searchHotelInfo.longitude);
    queryParams.city_id = parseFloat(this.searchHotelInfo.city_id);
    queryParams.city_name = this.searchHotelInfo.city.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-')
    if (this.searchHotelInfo.hotel_name) {
      queryParams.hotel_name = this.searchHotelInfo.hotel_name;      
    }
    queryParams.hotel_id = this.searchHotelInfo.type == "hotel" ? parseFloat(this.searchHotelInfo.hotel_id) : '';
    queryParams.itenery = btoa(encodeURIComponent(JSON.stringify(this.searchHotelInfo.occupancies)));
    queryParams.location = btoa(encodeURIComponent(JSON.stringify(this.searchHotelInfo.location))).replace(/\=+$/, '');
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();

      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if (parms.utm_medium) {
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if (parms.utm_campaign) {
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
    }
    if (this.validSearch && this.searchHotelInfo && this.searchHotelInfo.latitude && this.searchHotelInfo.longitude &&
      this.searchHotelInfo.check_in && this.searchHotelInfo.check_out && this.searchHotelInfo.occupancies) {

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['hotel/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
      });
    } else {
      this.validSearch = false;
    }
  }

  selectedHotel(event) {
    if(event.type == 'city'){
      this.searchHotelInfo.city_id = event.city_id;
    } else {
      this.searchHotelInfo.hotel_id = event.hotel_id;      
    }
    this.searchHotelInfo.type = event.type;      
    this.searchHotelInfo.city = event.city;      
    this.searchHotelInfo.location = event;
    this.searchHotelInfo.latitude = event.geo_codes.lat;
    this.searchHotelInfo.longitude = event.geo_codes.long;
    if (event && event.city_id == '' && event.objType === 'invalid') {
      this.fromDestinationInfo = event;
      this.validateSearch(true);
    }
  }

  counterChangeVal :number = 0;
  validateSearch(event) {    
    this.currentChangeCounter.emit(this.counterChangeVal += 1);
    this.validSearch = event;
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

}
