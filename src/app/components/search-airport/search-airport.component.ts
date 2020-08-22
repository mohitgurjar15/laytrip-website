import { Component, OnInit, Input } from '@angular/core';
// import { FlightService } from 'src/app/services/flight.service';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-search-airport',
  templateUrl: './search-airport.component.html',
  styleUrls: ['./search-airport.component.scss']
})
export class SearchAirportComponent implements OnInit {

  @Input() label: string;
  @Input() placeHolder: string;
  @Input() defaultSelected: string;
  constructor(
    private flightService: FlightService
  ) { }

  selectedAirport = [];
  keyword = 'name';
  data = [];
  loading = false;

  ngOnInit() {
  }

  searchAirport(searchItem) {
    this.loading = true;
    this.flightService.searchAirport(searchItem).subscribe((response: any) => {
      console.log(response);
      this.data = response.map(res => {
        this.loading = false;
        return {
          id: res.id,
          name: res.name,
          code: res.code,
          city: res.city,
          country: res.country,
          display_name: `${res.city},${res.country},(${res.code}),${res.name}`
        };
      });

    },
      error => {
        this.loading = false;
      }
    );
  }

  onChangeSearch(event) {
    console.log(event);
    if (event.term.length > 2) {
      this.searchAirport(event.term);
    }
  }

  selectEvent(event) {
    console.log(event);
    if (!event) {
      this.placeHolder = this.placeHolder;
      this.defaultSelected = this.defaultSelected;
    }
    this.selectedAirport = event;
    this.defaultSelected = '';
  }

}
