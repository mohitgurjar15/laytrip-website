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
  @Input() list;
  historys: [];
  item: any;
  listLength=0;
  constructor(
    private commonFunction:CommonFunction,
    private flightCommonFunction :FlightCommonFunction
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.list = changes.historyResult.currentValue;
    if(this.list && this.list != 'undefined'){
      this.listLength = this.list.length; 
    }
  }

  viewDetailClick(item) {
    this.item = item;
  } 


}
