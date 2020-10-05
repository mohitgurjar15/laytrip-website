import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { FormControl, FormGroup } from '@angular/forms';
// import { data } from './airport';

@Component({
  selector: 'app-search-airport',
  templateUrl: './search-airport.component.html',
  styleUrls: ['./search-airport.component.scss']
})
export class SearchAirportComponent implements OnInit, AfterViewChecked {

  @Input() label: string;
  @Input() placeHolder: string;
  @Input() defaultSelected: string;
  @Input() id;
  @Input() swappedData;
  @Input() form: FormGroup;
  @Input() controlName: FormControl;
  @Output() changeValue = new EventEmitter<any>();
  @Output() getSwapValue = new EventEmitter<any>();

  constructor(
    private flightService: FlightService,
    public cd: ChangeDetectorRef
  ) {
  }

  selectedAirport = [];
  keyword = 'name';
  data = [];
  loading = false;

  ngOnInit() {

  }

  ngDocheck() {
  }

  ngAfterViewChecked() {
    if (this.swappedData) {
      // console.log(this.swappedData);
      // this.data = this.swappedData.map(res => {
      //   // console.log(res);
      //   return {
      //     id: res.id,
      //     name: res.name,
      //     code: res.code,
      //     city: res.city,
      //     country: res.country,
      //     display_name: `${res.city},${res.country},(${res.code}),${res.name}`,
      //   };
      // });
    }
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
    // if (event && index && index === 'fromSearch') {
    //   this.getSwapValue.emit({ key: 'fromSearch', value: event });
    // } else if (event && index && index === 'toSearch') {
    //   this.getSwapValue.emit({ key: 'toSearch', value: event });
    // }
  }
}
