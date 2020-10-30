import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { environment } from '../../../../../../environments/environment';
import { FlightService } from '../../../../../services/flight.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() flightLists;
  flightList = [];
  flightBookings = [];
  page :1;
  pageSize =10;
  perPageLimitConfig = [10, 25, 50, 100];
  limit: number;
  showPaginationBar: boolean = false;
  totalItems =0;
  showFlightDetails = [];
  loadBaggageDetails:boolean = true;
  loadCancellationPolicy:boolean=false;
  baggageDetails;
  loadMoreCancellationPolicy:boolean=false;
  cancellationPolicy;
  cancellationPolicyArray=[];
  errorMessage;
  isNotFound:boolean= false;
  loading = true;
  pageNumber:number;
  notFoundBaggageDetails = false;

  constructor(   
     private commonFunction: CommonFunction,
     private flightService: FlightService,
     private userService: UserService


  ) { }

  ngOnInit() {
    this.page = 1;
    this.loading = true;
    this.isNotFound = false;
    this.limit = this.perPageLimitConfig[0];
    this.getBookings();
  }

  pageChange(event) {
    window.scroll(0,0);
    this.loading = true;
    this.page = event;    
    this.getBookings();
  }

  showDetails(index) {

    if (typeof this.showFlightDetails[index] === 'undefined') {
      this.showFlightDetails[index] = true;
    } else {
      this.showFlightDetails[index] = !this.showFlightDetails[index];
    }

    this.showFlightDetails = this.showFlightDetails.map((item, i) => {
      return ((index === i) && this.showFlightDetails[index] === true) ? true : false;
    });
  }

  getBookings(){
    this.loading = true;
    this.userService.getBookings(this.page, this.limit).subscribe((res: any) => {
      if (res) {
        this.flightBookings = res.data.map(flight => {
          if(flight.moduleId == 1){
            return {
              tripId : flight.id,
              journey_type : flight.locationInfo.journey_type,
              bookingDate : this.commonFunction.convertDateFormat(flight.bookingDate,'YYYY-MM-DD'),
              departure_time : flight.moduleInfo[0].routes[0].stops[0].departure_time,
              arrival_time : flight.moduleInfo[0].routes[0].stops[0].arrival_time,
              departure_city : flight.moduleInfo[0].routes[0].stops[0].departure_info.city,
              arrival_city : flight.moduleInfo[0].routes[0].stops[0].arrival_info.city,
              duration : flight.moduleInfo[0].routes[0].duration,
              airline_logo : flight.moduleInfo[0].routes[0].stops[0].airline_logo,
              airline_name : flight.moduleInfo[0].routes[0].stops[0].airline_name,
              airline : flight.moduleInfo[0].routes[0].stops[0].airline,
              flight_number : flight.moduleInfo[0].routes[0].stops[0].flight_number,
              instalment_amount : flight.moduleInfo[0].start_price,
              selling_price : flight.moduleInfo[0].selling_price,
              stop_count : flight.moduleInfo[0].instalment_details.stop_count,
              is_refundable : flight.moduleInfo[0].instalment_details.is_refundable,
              routes : flight.moduleInfo[0].routes,
              moduleInfo:flight.moduleInfo[0]
            }
          }
        });
        this.totalItems = res.total_count;
        this.isNotFound = false;
        this.loading = false;
        this.showPaginationBar = true;
      }
    }, err => {
      this.isNotFound = true;
      this.showPaginationBar = this.loading = false;    
    });
  }

  closeFlightDetail() {
    this.showFlightDetails = this.showFlightDetails.map(item => {
      return false;
    });
  }

  getBaggageDetails(routeCode) {
    this.loadBaggageDetails = true;
    this.flightService.getBaggageDetails(routeCode).subscribe(data => {
      this.baggageDetails = data;
      this.loadBaggageDetails =this.notFoundBaggageDetails  = false;      
    }, (err) => {
      this.loadBaggageDetails=false;
      this.notFoundBaggageDetails=true;
      this.errorMessage = err.message;
    });
  }

  getCancellationPolicy(routeCode) {
    console.log(routeCode)
    this.loadCancellationPolicy=true;
    this.loadMoreCancellationPolicy=false;
    this.errorMessage='';
    this.flightService.getCancellationPolicy(routeCode).subscribe((data:any) => {
      this.cancellationPolicyArray = data.cancellation_policy.split('--')
      this.loadCancellationPolicy=false;
      this.cancellationPolicy = data;
    }, (err) => {
      this.loadCancellationPolicy=false;
      this.errorMessage = err.message;
    });
  }

  toggleCancellationContent(){
    this.loadMoreCancellationPolicy=!this.loadMoreCancellationPolicy;
  }
}
