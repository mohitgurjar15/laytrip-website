import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-sort-flight',
  templateUrl: './sort-flight.component.html',
  styleUrls: ['./sort-flight.component.scss']
})
export class SortFlightComponent implements OnInit {

  @Output() sortFlight = new EventEmitter<{ key:string, order:string }>();
  @Input() flightDetails;
  sortType:string='lh_price';
  departureCode:string='';
  s3BucketUrl = environment.s3BucketUrl;
  arrivalCode:string='';
  lowToHighToggle : boolean = false;

  constructor(
    private route :ActivatedRoute
  ) {
     this.departureCode = this.route.snapshot.queryParams['departure'];
     this.arrivalCode = this.route.snapshot.queryParams['arrival'];
   }

  ngOnInit() {
    this.loadJquery();
  }

  loadJquery() {
    //Start REsponsive Fliter js
    
    /* $(".responsive_sort_btn").click(function () {
      $("#responsive_sortby_show").slideDown("slow");
      $("body").addClass('overflow-hidden');
    });

    $(".filter_close > a").click(function () {
      $("#responsive_sortby_show").slideUp("slow");
      $("body").removeClass('overflow-hidden');
    }); */
    //Close REsponsive Fliter js
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
  closeModal() {
    $('#filter_mob_modal2').modal('hide');
  }


  resetSorting(key,order){
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

  toggleLowToHigh(){
    this.lowToHighToggle = !this.lowToHighToggle;
  }
}
