import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { CommonFunction } from '../../_helpers/common-function';


@Component({
  selector: 'app-search-airport',
  templateUrl: './search-airport.component.html',
  styleUrls: ['./search-airport.component.scss']
})
export class SearchAirportComponent implements OnInit {

  @Input() label: string;
  @Input() tabIndex: number;
  @Input() placeHolder: string;
  @Input() defaultSelected: string;
  @Input() id;
  @Input() form: FormGroup;
  @Input() controlName: FormControl;
  @Output() changeValue = new EventEmitter<any>();
  @Output() searchItem : any = new EventEmitter<any>();
  @Output() flightSearchRoute = new EventEmitter<any>();
  @Input() defaultCity: any;
  @Input() airport;
  @Input() inputName;
  @Output() currentChangeCounter = new EventEmitter();
  progressInterval;
  counterChangeVal=0;
  isInputFocus : boolean = false;

  constructor(
    private flightService: FlightService,
    public cd: ChangeDetectorRef,
    public cookieService: CookieService,
    public commonFunction: CommonFunction,
  ) {
  }

  selectedAirport: any = {};
  keyword = 'name';
  data = [];
  loading = false;

  ngOnInit() {
    this.data[0] = this.airport ? this.airport : [];
    if(Object.keys(this.airport).length==0){
      this.data=[];
    }
  }


  onChangeSearch(event) {
     if (event.term.length > 2) {
      // this.searchRoute(event.term);
      this.searchAirport(event.term);      
    } 
  }

  searchRoute(searchItem) {
    this.loading = true;
    let isFromLocation = this.id == 'fromSearch' ? 'yes' : 'no';
    let alternateLocation = '';
    if (this.id == 'fromSearch') {
      alternateLocation = localStorage.getItem('__to') || '';
    }
    else {
      alternateLocation = localStorage.getItem('__from') || '';
    }
    this.flightService.searchRoute(searchItem, isFromLocation, alternateLocation).subscribe((response: any) => {
      this.flightSearchRoute.emit(response);
      this.data = response.map(res => {
        this.loading = false;
        var searchRoute = {
          id: res.id,
          name: res.name,
          code: res.code,
          city: res.city,
          country: res.country,
          display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
          parentId: 0
        };

        return searchRoute;
      });
    },
      error => {
        this.flightSearchRoute.emit([]);
        this.data = [];
        this.loading = false;
      }
    );
  }

  onInputClick() {
    // data if set null if it is set in from search.
    if (this.id == 'toSearch') {
      this.flightSearchRoute.emit({});
      this.data = [];
    }
  }

  searchAirport(searchItem) {
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      
      /* this.flightSearchRoute.emit(response); */
      this.data = response.map(res => {
        if (localStorage.getItem('__from') != res.code) {
          this.flightSearchRoute.emit(response);
          this.loading = false;
          var searchRoute = {
            id: res.id,
            name: res.name,
            code: res.code,
            city: res.city,
            country: res.country,
            display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
            parentId: 0
          };

          return searchRoute;
        } else {
          console.log(localStorage.getItem('__from'), res.code)

          console.log('here')
        }
      });
    },
      error => {
        this.loading = false;
      }
    );
  }

  selectEvent(event, index) {
    if (!event) {
      this.placeHolder = this.placeHolder;
    }
    if(typeof event=='undefined'){
      if (index === 'fromSearch') {
        localStorage.removeItem('__from')
      } else if (index === 'toSearch') {
        localStorage.removeItem('__to')
      }
    }
    this.selectedAirport = event;
    if (event && index && index === 'fromSearch') {
      this.changeValue.emit({ key: 'fromSearch', value: event });
      localStorage.setItem('__from',this.selectedAirport.code)
    } else if (event && index && index === 'toSearch') {
      localStorage.setItem('__to',this.selectedAirport.code)
      this.changeValue.emit({ key: 'toSearch', value: event });
    }
    this.cd.detectChanges();
  }

  onRemove(event) {
    this.selectedAirport = {};
  }
 

  setDefaultAirport() {
    try {
      let location: any = this.cookieService.get('__loc');
      location = JSON.parse(location);
      if (typeof location.airport !== 'undefined') {
      }
    }
    catch (error) {

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['airport'] && typeof changes['airport'].currentValue != 'undefined') {
      this.defaultCity = Object.keys(changes['airport'].currentValue).length > 0 ?  changes['airport'].currentValue.city : [];     
      this.data = Object.keys(changes['airport'].currentValue).length > 0 ? Object.assign([],[changes['airport'].currentValue]) : [];
    }
  }

  onFocus(){
    this.isInputFocus = true;
    if(this.commonFunction.isRefferal()){
      this.progressInterval = setInterval(() => {
        if(this.isInputFocus){
          this.currentChangeCounter.emit(this.counterChangeVal += 1);
        } else {
          clearInterval(this.progressInterval);
        }
      }, 1000); 
    }
  }
 
  onClose(event){
    this.isInputFocus = false;
  }
}
