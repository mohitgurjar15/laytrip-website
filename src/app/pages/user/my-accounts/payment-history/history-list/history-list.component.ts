import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightCommonFunction } from '../../../../../_helpers/flight-common-function';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})

export class HistoryListComponent implements OnInit {
  @Output() bookingData = new EventEmitter();
  s3BucketUrl = environment.s3BucketUrl;
  @Input() historyResult;
  @Input() list : any = [];
  historys: [];
  item: any;
  listLength=0;
  pageSize =10;
  page :1;
  perPageLimitConfig = [10, 25, 50, 100];
  limit: number;
  showPaginationBar: boolean = false;

  constructor(
    private commonFunction:CommonFunction,
    private flightCommonFunction :FlightCommonFunction
  ) { }

  ngOnInit() {
    this.page = 1;        
    this.limit = this.perPageLimitConfig[0];
  }

  
  ngOnChanges(changes: SimpleChanges) {     
    this.list = changes.historyResult.currentValue;
  }

  ngAfterContentChecked() {
    if(this.list && this.list.length ){
      this.listLength = this.list.length; 
      if(this.listLength > 0 ){
        this.showPaginationBar = true; 
      }    
    }  
  }

  pageChange(event) {
    this.page = event;    
  }

  viewDetailClick(item) {
    this.item = item;
  } 

}
