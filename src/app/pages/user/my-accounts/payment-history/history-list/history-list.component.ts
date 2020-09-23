import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {
  @Input() historyResult;
  @Input() list;
  historys:[];
  
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes:SimpleChanges){
    this.list = changes.historyResult.currentValue;
    if(this.list &&  this.list != 'undefined' ){
    }
  }
  
  

  
}
