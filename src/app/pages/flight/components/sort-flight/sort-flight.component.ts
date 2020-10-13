import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sort-flight',
  templateUrl: './sort-flight.component.html',
  styleUrls: ['./sort-flight.component.scss']
})
export class SortFlightComponent implements OnInit {

  departureCode:string='';
  arrivalCode:string='';
  constructor(
    private route :ActivatedRoute
  ) {
     this.departureCode = this.route.snapshot.queryParams['departure'];
     this.arrivalCode = this.route.snapshot.queryParams['arrival'];
   }
  @Output() sortFlight = new EventEmitter<{ key:string, order:string }>();
  @Input() flightDetails;
  sortType:string='lh_price';

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

  sortFlightData(key,order,name){

    this.sortType=name;
    this.sortFlight.emit({ key , order })
  }

  resetFilter(key,order){
    this.sortType='lh_price';
    this.sortFlight.emit({ key , order })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['flightDetails'].currentValue!='undefined') {
      if(this.flightDetails!='undefined'){
        this.flightDetails=changes['flightDetails'].currentValue;
      }
    }
  }
}
