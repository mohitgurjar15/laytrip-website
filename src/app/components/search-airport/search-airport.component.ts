import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked, HostListener } from '@angular/core';
// import { FlightService } from 'src/app/services/flight.service';
import { FlightService } from '../../services/flight.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { sampleData } from './airport';
import { KeyCode } from './custom-select-types';

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
  @Input() clearable;
  @Output() changeValue = new EventEmitter<any>();
  @Output() getSwapValue = new EventEmitter<any>();

  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {
  //   console.log(event);
  // }

  constructor(
    private flightService: FlightService,
    public cd: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {

  }

  selectedAirport = [];
  keyword = 'name';
  data = [];
  loading = false;

  showDropDown = false;

  ngOnInit() {
  }

  openDropDown() {
    if (this.data && this.data.length) {
      this.showDropDown = true;
    } else {
      this.showDropDown = false;
    }
  }
  removeInput(event) {
    if (event.keyCode === 8 && this.form.controls[`${this.controlName}`].value === '') {
      this.showDropDown = false;
    }
  }
  selectValue(value, index) {
    this.showDropDown = false;
    const selectedValue = value.city + '(' + value.code + ')';
    this.form.controls[`${this.controlName}`].setValue(selectedValue);
    const selectedEvent = {
      id: value.id,
      name: value.name,
      code: value.code,
      city: value.city,
      country: value.country,
      display_name: value.display_name
    };
    this.selectEvent(selectedEvent, index);
  }
  closeDropDown() {
    this.showDropDown = false;
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
      this.loading = false;
      this.data = response;
      this.showDropDown = true;
    },
      error => {
        this.loading = false;
      }
    );
  }

  onChangeSearch(event) {
    if (event.target.value.length > 2) {
      this.searchAirport(event.target.value);
    }
    // if (event.term.length > 2) {
    //   this.searchAirport(event.term);
    // }
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

  clearSearchedAirport() {
    this.form.controls[`${this.controlName}`].setValue('');
    this.selectedAirport = [];
    this.defaultSelected = this.defaultSelected;
  }
}
