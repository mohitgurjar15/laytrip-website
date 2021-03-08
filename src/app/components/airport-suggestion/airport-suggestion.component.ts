import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-airport-suggestion',
  templateUrl: './airport-suggestion.component.html',
  styleUrls: ['./airport-suggestion.component.scss']
})
export class AirportSuggestionComponent implements OnInit {

  @Input() type:string;
  @Input() airport;
  data:any=[];
  @Output() closeAirportSuggestion=new EventEmitter();
  s3BucketUrl = environment.s3BucketUrl;
  
  
  constructor(
    private flightService: FlightService,
  ) { }

  ngOnInit() {
    this.getAirports();
  }

  closeAirportDropDown(type){
    this.closeAirportSuggestion.emit(type)
  }

  ngOnChanges(change:SimpleChange){
    
  }

  getAirports(){

    this.flightService.searchAirports(this.type).subscribe(result=>{
      this.data=result;
      console.log("this.data",this.data)
    },error=>{

    })
  }

}
