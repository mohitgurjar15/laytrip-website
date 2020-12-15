import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sort-hotel',
  templateUrl: './sort-hotel.component.html',
  styleUrls: ['./sort-hotel.component.scss']
})
export class SortHotelComponent implements OnInit {

  @Output() sortHotel = new EventEmitter<{ key: string, order: string }>();
  @Input() hotelDetails;
  locationName;
  sortType: string = 'lh_price';
  lowToHighToggle: boolean = false;

  constructor(
  ) {
  }

  ngOnInit() {
    const info = JSON.parse(localStorage.getItem('_hote'));
    info.forEach(i => {
      if (i.key === 'fromSearch') {
        this.locationName = i.value.city;
      }
    });
    this.loadJquery();
  }

  loadJquery() {
    // Start filter Shortby js
    $(document).on('show', '#accordion', function (e) {
      $(e.target).prev('.accordion-heading').addClass('accordion-opened');
    });

    $(document).on('hide', '#accordion', function (e) {
      $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
    });
  }

  sortHotelData(key, order, name) {
    this.sortType = name;
    this.sortHotel.emit({ key, order });
  }

  resetSorting(key, order) {
    this.sortType = 'lh_price';
    this.sortHotel.emit({ key, order });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hotelDetails'].currentValue != 'undefined') {
      if (this.hotelDetails != 'undefined') {
        this.hotelDetails = changes['hotelDetails'].currentValue;
      }
    }
  }

  toggleLowToHigh() {
    this.lowToHighToggle = !this.lowToHighToggle;
  }

}
