import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-sort-flight',
  templateUrl: './sort-flight.component.html',
  styleUrls: ['./sort-flight.component.scss']
})
export class SortFlightComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.loadJquery();
  }

  loadJquery() {
    // Start filter Shortby js
    $(document).on('show', '#accordion', function (e) {
      //$('.accordion-heading i').toggleClass(' ');
      $(e.target).prev('.accordion-heading').addClass('accordion-opened');
    });

    $(document).on('hide', '#accordion', function (e) {
      $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
      //$('.accordion-heading i').toggleClass('fa-chevron-right fa-chevron-down');
    });
    // Close filter Shortby js
  }

}
