import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
// import { data } from './airport';


@Component({
  selector: 'app-search-airport',
  templateUrl: './search-airport.component.html',
  styleUrls: ['./search-airport.component.scss']
})
export class SearchAirportComponent implements OnInit, AfterViewChecked {

  @Input() label: string;
  @Input() tabIndex:number;
  @Input() placeHolder: string;
  @Input() defaultSelected: string;
  @Input() id;
  @Input() form: FormGroup;
  @Input() controlName: FormControl;
  @Output() changeValue = new EventEmitter<any>();
  defaultSelectedTemp;
  airportDefaultDestValue;
  departureAirport;

  constructor(
    private flightService: FlightService,
    public cd: ChangeDetectorRef,
    public cookieService:CookieService
  ) {
  }

  selectedAirport = {};
  keyword = 'name';
  data = [];
  loading = false;

  ngOnInit() {
    this.defaultSelectedTemp = this.defaultSelected;
    this.setDefaultAirport();
  }

  ngDocheck() {
  }

  ngAfterViewChecked() {
    
  }

  searchAirport(searchItem) {
    this.loading = true;
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      // console.log(response);
      this.data = response.map(res => {
        this.loading = false;
        return {
          id: res.id,
          name: res.name,
          code: res.code,
          city: res.city,
          country: res.country,
          display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
          parentId: res.parentId
        };
      });
    },
      error => {
        this.loading = false;
      }
    );
  }

  onChangeSearch(event) {
    if (event.term.length > 2) {
      this.searchAirport(event.term);
    }
  }

  selectEvent(event, index) {
    if (!event) {
      this.placeHolder = this.placeHolder;
      this.defaultSelected = this.defaultSelected;
    }
    this.selectedAirport = event;
    this.defaultSelected = '';
    if (event && index && index === 'fromSearch') {
      this.changeValue.emit({ key: 'fromSearch', value: event });
    } else if (event && index && index === 'toSearch') {
      this.changeValue.emit({ key: 'toSearch', value: event });
    }
  }

  onRemove(event) {
    this.selectedAirport = {};
    this.defaultSelected = this.defaultSelectedTemp;
  }

  setDefaultAirport(){
    console.log("Innnn")
    try{
      let location:any = this.cookieService.get('__loc');
      location = JSON.parse(location);
      if(typeof location.airport!=='undefined'){
        /* location.airport.display_name = `${location.city},${location.country},(${location.code}),${location.name}`,
        this.data[0] = location.airport;
        this.airportDefaultDestValue = this.data[0].city;
        this.defaultSelected='';
        this.selectedAirport = this.data[0]; */
      }
    }
    catch(error){

    }
  }
}
