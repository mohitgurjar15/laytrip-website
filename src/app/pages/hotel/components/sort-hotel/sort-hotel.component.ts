import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sort-hotel',
  templateUrl: './sort-hotel.component.html',
  styleUrls: ['./sort-hotel.component.scss']
})
export class SortHotelComponent implements OnInit {

  @Output() sortFlight = new EventEmitter<{ key: string, order: string }>();
  @Input() flightDetails;

  constructor(
  ) {
  }

  ngOnInit() {
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

}
