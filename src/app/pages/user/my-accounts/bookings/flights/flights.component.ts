import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { environment } from '../../../../../../environments/environment';
import { FlightService } from '../../../../../services/flight.service';

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
  page :number;
  pageSize = 12;
  perPageLimitConfig = [12, 25, 50, 100];
  limit: number;
  showPaginationBar: boolean = false;
  totalItems;
  showFlightDetails = [];
  loadBaggageDetails:boolean = true;
  loadCancellationPolicy:boolean=false;
  baggageDetails;


  constructor(   
     private commonFunction: CommonFunction,
     private flightService: FlightService,

  ) { }

  ngOnInit() {
    this.page = 1;
    this.limit = this.perPageLimitConfig[0];
  }
 
  ngOnChanges(changes:SimpleChanges){    
    this.flightList = changes.flightLists.currentValue;
    this.showPaginationBar = true;
  }

  ngAfterContentChecked() {
    this.flightBookings = this.flightList;
    this.totalItems = this.flightBookings.length;
    this.showPaginationBar = true;
  }

  pageChange(event) {
    this.showPaginationBar = false;
    this.page = event;    
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

  closeFlightDetail() {
    this.showFlightDetails = this.showFlightDetails.map(item => {
      return false;
    });
  }
  getBaggageDetails(routeCode) {

    this.loadBaggageDetails = true;
    this.flightService.getBaggageDetails(routeCode).subscribe(data => {
      this.baggageDetails = data;
      console.log(this.baggageDetails)
      this.loadBaggageDetails = false;
    });
  }
}
