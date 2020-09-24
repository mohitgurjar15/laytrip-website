import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightCommonFunction } from '../../../../../_helpers/flight-common-function';


@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {
  @Output() bookingData = new EventEmitter();
  @Input() historyResult;
  @Input() list;
  historys: [];
  item: any;

  constructor(
    private commonFunction:CommonFunction,
    private flightCommonFunction :FlightCommonFunction
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.list = changes.historyResult.currentValue;

    if(this.list && this.list != 'undefined'){
    }
  }

  viewDetailClick(item) {
    this.item = item;
  }
  


}
