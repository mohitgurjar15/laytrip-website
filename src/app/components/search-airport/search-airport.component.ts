import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked, ElementRef } from '@angular/core';
// import { FlightService } from 'src/app/services/flight.service';
import { FlightService } from '../../services/flight.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { sampleData } from './airport';
import { KeyCode, CustomSelectOption } from './custom-select-types';
declare var $: any;
import { Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@Component({
  selector: 'app-search-airport',
  templateUrl: './search-airport.component.html',
  styleUrls: ['./search-airport.component.scss'],
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

  selectedIndex = 0;
  selectedAirport = [];
  keyword = 'name';
  data = [];
  loading = false;
  showDropDown = false;
  itemNo = -1;

  // setIndex(data, index) {
  //   console.log('hkgkhghhjghj');
  //   this.selectedIndex = index;
  // }

  // resetIndex() {
  //   this.selectedIndex = -1;
  // }

  constructor(
    private flightService: FlightService,
    public cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private elementRef: ElementRef
  ) {

  }

  ngOnInit() {

  }

  trackByOption = (index: number, item: any) => {
    // this.selectedIndex = item.item_no;
    return item.item_no;
  }

  getValueByTab(event, index) {
    if (this.showDropDown && event.keyCode === KeyCode.Tab) {
      event.preventDefault();
      this.selectEvent(this.data[this.selectedIndex], index);
    }
  }


  // onKeyPress(event, dropDownId) {
  //   let element = document.querySelectorAll('.list-item');
  //   if (event.keyCode === KeyCode.ArrowDown) {
  //     // this.selectedIndex = (this.selectedIndex + 1);
  //     if (this.data.length >= 0) {
  //       element[this.selectedIndex].scrollIntoView(
  //         { block: 'nearest', inline: 'end' }
  //       );
  //     }
  //   } else if (event.keyCode === KeyCode.ArrowUp) {
  //     if (this.selectedIndex <= 0) {
  //       this.selectedIndex = this.data.length;
  //     }
  //     this.selectedIndex = (this.selectedIndex - 1);
  //     if (this.data.length > 0) {
  //       element[this.selectedIndex].scrollIntoView(
  //         { block: 'nearest', inline: 'end' }
  //       );
  //     }
  //   } else if (event.keyCode === KeyCode.Enter) {
  //     event.preventDefault();
  //     this.selectEvent(this.data[this.selectedIndex], dropDownId);
  //   }
  // }

  // cumulativeLength(index) {
  //   let acc = 0;
  //   for (let i = 0; i < index; i++) {
  //     acc = this.data[i].sub_airport.length + 2;
  //   }
  //   return acc;
  // }

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
    this.form.controls[`${this.controlName}`].setValue(value.city);
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
    // this.data = sampleData;
    // this.showDropDown = true;
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      this.loading = false;
      // this.data = sampleData;
      this.showDropDown = true;
      // this.itemNo++;
      // response.forEach(list => {
      //   list.item_no = this.itemNo++;
      //   list.sub_airport.forEach(element => {
      //     element.item_no = this.itemNo++;
      //   });
      // });
      this.data = response;
      console.log(this.data);
    },
      error => {
        this.loading = false;
      }
    );
  }

  onChangeSearch(event) {
    // if (event.target.value.length > 2) {
    //   this.searchAirport(event.target.value);
    // }
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
    this.form.controls[`${this.controlName}`].setValue(event.city);

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
