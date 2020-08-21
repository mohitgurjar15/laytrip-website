import { Component, OnInit, Input } from '@angular/core';
//import { FlightService } from 'src/app/services/flight.service';
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

  historyHeading: string = 'Recently selected';
  selectedAirport = [];
  keyword = 'name';
  data = [];
  loading: boolean = false;
  ngPlaceholder = 'Hello';

  cities = [
    {
      id: 1,
      name: 'abc',
      avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'
    },
    { id: 2, name: 'aaa', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15' },
    {
      id: 3,
      name: 'pqr',
      avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15'
    },
    {
      id: 4,
      name: 'xyz',
      avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'
    },
  ];
  selectedCity = this.cities[1];

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
        }
      });

    },
      error => {
        this.loading = false;
      }
    )
  }

  onChangeSearch(event) {
    console.log("", event)
    if (event.term.length > 2)
      this.searchAirport(event.term)
  }

  selectEvent(event) {
    console.log(event);
    this.ngPlaceholder = '';
    if (!event) {
      this.ngPlaceholder = 'Hello';
    }
    this.defaultSelected = "";
    this.selectedAirport = event;
  }

}
