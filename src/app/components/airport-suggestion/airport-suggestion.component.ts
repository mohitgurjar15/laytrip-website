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
    if(changes['searchedFlightData']){
      this.loading=this.isType = false;
    
      // this.data = this.searchedFlightData;
      let opResult = this.groupByKey(changes['searchedFlightData'].currentValue,'key')
      let airportArray=[];
  
      for (const [key, value] of Object.entries(opResult)) {
        airportArray.push({
          key : key,
          value : value
        })
      }
      airportArray = airportArray.sort((a, b) => a.key.localeCompare(b.key));
      for(let i=0; i <airportArray.length; i++){
        for(let j=0; j<airportArray[i].value.length; j++){
          airportArray[i].value[j].display_name = `${airportArray[i].value[j].city},${ airportArray[i].value[j].country},(${airportArray[i].value[j].code}),${ airportArray[i].value[j].name}`
        }
      }
      this.data=airportArray;
    } else {
      // console.log('here')
    }
  }

  getAirports(){
    this.data = [];
    let from = localStorage.getItem('__from') || '';
    let to = localStorage.getItem('__to') || '';
    if(from=='' && to==''){
      this.loading = true;
      this.flightService.searchAirports(this.type).subscribe((result:any)=>{
        this.loading=false;
        for(let i=0; i <result.length; i++){
          for(let j=0; j<result[i].value.length; j++){
            if(result[i].value[j].code != 'AMD'){
              result[i].value[j].display_name = `${result[i].value[j].city},${ result[i].value[j].country},(${result[i].value[j].code}),${ result[i].value[j].name}`
            }
          }
        }
        this.data=result;
      },error=>{
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
        let opResult = this.groupByKey(response,'key')
        let airportArray=[];
		
        for (const [key, value] of Object.entries(opResult)) {
          airportArray.push({
            key : key,
            value : value
          })
        }
        airportArray = airportArray.sort((a, b) => a.key.localeCompare(b.key));
        for(let i=0; i <airportArray.length; i++){
          for(let j=0; j<airportArray[i].value.length; j++){
            airportArray[i].value[j].display_name = `${airportArray[i].value[j].city},${ airportArray[i].value[j].country},(${airportArray[i].value[j].code}),${ airportArray[i].value[j].name}`
          }
        }
        this.data=airportArray;
      },
        error => {
          this.data=[];
          this.loading=false;
        }
      );
    }
  }

  groupByKey(array, key) {
		return array
		  .reduce((hash, obj) => {
			if(obj[key] === undefined) return hash; 
			return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
		  }, {})
	 }

  selectAirport(event){
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
