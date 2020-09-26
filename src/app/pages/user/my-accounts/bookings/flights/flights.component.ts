import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { environment } from '../../../../../../environments/environment';

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

  constructor(   
     private commonFunction: CommonFunction
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

}
