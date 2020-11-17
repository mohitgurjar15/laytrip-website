import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightCommonFunction } from '../../../../../_helpers/flight-common-function';
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
  currencySymbol='';
  constructor(    
    private commonFunction:CommonFunction,
    private flightCommonFunction :FlightCommonFunction

  ) { }

  ngOnInit() {
    // console.log("this.list",this.item)
  }

  ngOnChanges(changes:SimpleChanges){
    this.list = changes.item.currentValue;
    if(this.list){
      this.currencySymbol =  this.list.currency2.symbol ? this.list.currency2.symbol : '$';
    }
    if(this.list &&  this.list != 'undefined' ){
    }
  }
  
  dateConvert(date){
    return this.commonFunction.convertDateFormat(new Date(date),"MM/DD/YYYY")
  }
  
}
