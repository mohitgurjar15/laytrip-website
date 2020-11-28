import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { environment } from '../../../../../../environments/environment';
import { FlightService } from '../../../../../services/flight.service';
import { UserService } from '../../../../../services/user.service';
import { BookingStatus } from '../../../../../constant/booking-status.const';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { redirectToLogin } from '../../../../../_helpers/jwt.helper';


@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() flightLists;
  @Input() result;
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
  public filterData={};
  filterInfo={};
  bookingStatus;
  currency;
  closeResult = '';
  modalReference: any;

  constructor(   
     private commonFunction: CommonFunction,
     private flightService: FlightService,
     private userService: UserService,
     private modalService: NgbModal

  ) { 
    this.bookingStatus =  BookingStatus;
  }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.page = 1;
    this.loading = true;
    this.isNotFound = false;
    this.limit = this.perPageLimitConfig[0];
    this.getBookings();
  }

  pageChange(event) {
    this.showPaginationBar = false;
    window.scroll(0,0);
    this.loading = true;
    this.page = event;    
    this.getBookings();
  }

  ngOnChanges(changes: SimpleChanges) {   
    this.filterData = changes.result.currentValue;

    if(this.filterData){
      this.showPaginationBar = false;
      this.getBookings();
    }
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
    if(this.filterData != 'undefined'){     
      this.filterInfo = this.filterData;
    }
    this.userService.getBookings(this.page, this.limit,this.filterInfo).subscribe((res: any) => {
      if (res) {
        this.flightBookings = res.data.map(flight => {
          if(flight.moduleId == 1){
            return {
              tripId : flight.laytripBookingId,
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
              selling_price : flight.bookingType ==2 ? flight.moduleInfo[0].secondary_selling_price :flight.moduleInfo[0].selling_price,
              stop_count : flight.moduleInfo[0].instalment_details.stop_count,
              is_refundable : flight.moduleInfo[0].instalment_details.is_refundable,
              routes : flight.moduleInfo[0].routes,
              moduleInfo:flight.moduleInfo[0],
              travelers:flight.travelers,
              bookingType:flight.bookingType,
              bookingStatus:flight.bookingStatus,
              bookingInstalments:flight.bookingInstalments
            }
          }
        });
        this.totalItems = res.total_count;
        this.isNotFound = false;
        this.loading = false;
        this.showPaginationBar = true;
      }
    }, err => {
      redirectToLogin();
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

  open(content) {
    console.log(content)
    this.modalReference = this.modalService.open(content, { windowClass: 'cancle_alert_modal',centered: true });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.getTravelers();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult)
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
