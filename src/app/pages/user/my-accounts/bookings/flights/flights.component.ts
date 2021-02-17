import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';


@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() cartItem={};

  constructor(
    private commonFunction: CommonFunction

  ) {
  }

  ngOnInit() {
     
  }
  ngOnChanges(changes: SimpleChanges) {
    if(typeof changes['cartItem'].currentValue!='undefined'){
      this.cartItem=changes['cartItem'].currentValue;
    }
  }

  convertHHMM(time){
    return moment(time).format('HH:MM');   // 5:04 PM
  }
}
