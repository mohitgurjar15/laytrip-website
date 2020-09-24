import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from 'src/app/_helpers/common-function';
import { FlightCommonFunction } from 'src/app/_helpers/flight-common-function';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() item;
  list:any;
  constructor(    
    private commonFunction:CommonFunction,
    private flightCommonFunction :FlightCommonFunction

  ) { }

  ngOnInit() {}

  ngOnChanges(changes:SimpleChanges){
    this.list = changes.item.currentValue;
    if(this.list &&  this.list != 'undefined' ){
    }
  }

  
}
