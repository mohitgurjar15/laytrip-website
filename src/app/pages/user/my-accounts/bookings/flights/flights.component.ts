import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from 'src/app/_helpers/common-function';
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

  
  constructor(    private commonFunction: CommonFunction
    ) { }

  ngOnInit() {

  }
 
  ngOnChanges(changes:SimpleChanges){
    this.flightList = changes.flightLists.currentValue;
  }

  ngAfterContentChecked() {
    this.flightBookings = this.flightList;
  }

}
