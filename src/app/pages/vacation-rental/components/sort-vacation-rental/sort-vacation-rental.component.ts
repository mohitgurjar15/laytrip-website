import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sort-vacation-rental',
  templateUrl: './sort-vacation-rental.component.html',
  styleUrls: ['./sort-vacation-rental.component.scss']
})
export class SortVacationRentalComponent implements OnInit {
  
  @Output() sortRental = new EventEmitter<{ key: string, order: string }>();
  @Input() rentalDetails;
  sortType: string = 'lh_price';
  lowToHighToggle: boolean = false;

  constructor() { }

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

  sortRentalData(key, order, name) {
  	console.log(key,order,name);
    this.sortType = name;
    this.sortRental.emit({ key, order });
  }

  resetSorting(key, order) {
    this.sortType = 'lh_price';
    this.sortRental.emit({ key, order });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rentalDetails'].currentValue != 'undefined') {
      if (this.rentalDetails != 'undefined') {
        this.rentalDetails = changes['rentalDetails'].currentValue;
      }
    }
  }

  toggleLowToHigh() {
    this.lowToHighToggle = !this.lowToHighToggle;
  }

}
