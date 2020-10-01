import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightCommonFunction } from '../../../../../_helpers/flight-common-function';

import { environment } from '../../../../../../environments/environment';
import { timeout } from 'rxjs/operators';


@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {
  @Output() bookingData = new EventEmitter();
  s3BucketUrl = environment.s3BucketUrl;
  @Input() historyResult;
  @Input() list;
  historys: [];
  item: any;
  listLength=0;
  pageSize =10;
  page :1;
  perPageLimitConfig = [10, 25, 50, 100];
  limit: number;
  showPaginationBar: boolean = false;
  loading:boolean=true;
  notFound:boolean=false;

  constructor(
    private commonFunction:CommonFunction,
    private flightCommonFunction :FlightCommonFunction
  ) { }

  ngOnInit() {
    console.log('ngOnInit')
    this.page = 1;
    this.loading = true;
    this.notFound = false;
    this.limit = this.perPageLimitConfig[0];
    setTimeout(function () {
        if(!this.list || this.list === 'undefined'){
          this.loading = this.showPaginationBar =false;
        }    
    },1000);
  }

  ngOnChanges(changes: SimpleChanges) { 
   this.showPaginationBar = false

    this.list = changes.historyResult.currentValue;

    if(this.list && this.list != 'undefined'){
      this.listLength = this.list.length;         
    } 
    if(this.listLength === 0) {
      this.notFound = true;
      this.showPaginationBar = this.loading = false;
    } else {
      this.loading = false;  
    }
    
  }


  ngAfterContentChecked() { }

  pageChange(event) {
    this.loading = true;
    this.page = event;    
  }

  viewDetailClick(item) {
    this.item = item;
  } 
  ngDoCheck(){
    setTimeout(function () {
    if(this.listLength === 'undefined' || this.listLength < 0) {
      this.notFound = true;
      this.showPaginationBar = false;
    } else {
      this.loading = false;  
    }
    if(this.listLength > 0){
      this.notFound = false;  
    }
    },1000);
    console.log(this.loading,this.listLength )
  }


}
