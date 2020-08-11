import { Component, OnInit, Input } from '@angular/core';
//import { FlightService } from 'src/app/services/flight.service';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-search-airport',
  templateUrl: './search-airport.component.html',
  styleUrls: ['./search-airport.component.scss']
})
export class SearchAirportComponent implements OnInit {

  @Input() label:string;
  @Input() placeHolder:string;
  @Input() defaultSelected:string;
  constructor(
    private flightService:FlightService
  ) { }
  
  historyHeading: string = 'Recently selected';
  selectedAirport:any={};
  keyword = 'name';
  data=[];

  ngOnInit() {
  }

  searchAirport(searchItem){
    this.flightService.searchAirport(searchItem).subscribe((response:any)=>{
      this.data = response;
    },
    error=>{

    }
    )
  }

  onChangeSearch(event){
    this.searchAirport(event)
  }

  selectEvent(event){
    this.selectedAirport=event;
  }

  onFocused(event){
    console.log("focus",event)
  }

}
