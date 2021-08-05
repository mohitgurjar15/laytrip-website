import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Input() routeSearch;
  @Input() searchedFlightData;
  data:any=[];
  @Output() closeAirportSuggestion=new EventEmitter();
  @Output() changeValue = new EventEmitter<any>();
  s3BucketUrl = environment.s3BucketUrl;
  loading:boolean=false;
  isType = false;
  
  constructor(
    private flightService: FlightService,
  ) { }

  ngOnInit() {
    this.getAirports();
  }

  closeAirportDropDown(type){
    this.closeAirportSuggestion.emit(type)
  }
  
  
  ngOnChanges(changes: SimpleChanges) {
    this.data=[];
    let airportArray=[];
    if (changes['searchedFlightData'].currentValue){
      this.loading=this.isType = false;
  
      airportArray = changes['searchedFlightData'].currentValue;
      for(let i=0; i < airportArray.length; i++){
        airportArray[i].display_name = `${airportArray[i].city},${airportArray[i].country},(${airportArray[i].code}),${airportArray[i].name}`     
      }
      this.data = airportArray;
    } 
  }

  getAirports() {
    this.data = [];
    let from = localStorage.getItem('__from') || '';
    let to = localStorage.getItem('__to') || '';
    if(from=='' && to==''){
      this.loading = true;
      this.flightService.searchAirports(this.type).subscribe((result:any)=>{
        this.loading = false;
        for (let i = 0; i < result.length; i++) {
          result[i].display_name = `${result[i].city},${result[i].country},(${result[i].code}),${result[i].name}`
        }
        this.data=result;
      }, error => {
        this.loading=false;
        this.data=[];
      })
    }
    else{
      let isFromLocation=this.type=='from'?'yes':'no';
      let alternateLocation='';
      if(this.type=='from'){
        alternateLocation=localStorage.getItem('__to') || '';
      }
      else{
        alternateLocation=localStorage.getItem('__from') || '';
      }
      this.loading=true;
      this.flightService.searchRoute('',isFromLocation,alternateLocation).subscribe((response: any) => {
        this.loading=false;
        for (let i = 0; i < response.length; i++){
          response[i].display_name = `${response[i].city},${response[i].country},(${response[i].code}),${ response[i].name}`
        }
        this.data = response;
      },
        error => {
          this.data=[];
          this.loading=false;
        }
      );
    }
  }

  selectAirport(event) {
    this.closeAirportSuggestion.emit(this.type)
    if(this.type=='from'){
      this.changeValue.emit({ key: 'fromSearch', value: event });
      localStorage.setItem('__from',event.code)
    }
    else{
      this.changeValue.emit({ key: 'toSearch', value: event });
      localStorage.setItem('__to',event.code)
    }
  }

  isSuggestionWithCountry(code){
    
    if(code == 'SCL'){
      return true;
    } else if(code == 'STI'){
      return true;
    } else {
      return false;
    }
  }
}
