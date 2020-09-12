import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-traveller-info',
  templateUrl: './traveller-info.component.html',
  styleUrls: ['./traveller-info.component.scss']
})
export class TravellerInfoComponent implements OnInit {

  @Output() changeValue = new EventEmitter<any>();
  @Input() label;

  adultValue: number = 1;
  childValue: number = 0;
  infantValue: number = 0;
  totalPerson: number = 1;
  class = 'Economy';

  travellerInfo = {
    adult: 0,
    child: 0,
    infant: 0,
    class: 'Economy',
    totalPerson: 0,
  };

  constructor(
    private route: ActivatedRoute
  ) {
    this.adultValue = parseInt(this.route.snapshot.queryParams['adult']) ? parseInt(this.route.snapshot.queryParams['adult']) : 1;
    this.childValue = parseInt(this.route.snapshot.queryParams['child']) ? parseInt(this.route.snapshot.queryParams['child']) : 0;
    this.infantValue = parseInt(this.route.snapshot.queryParams['infant']) ? parseInt(this.route.snapshot.queryParams['infant']) : 0;
    this.totalPerson = this.adultValue + this.childValue + this.infantValue;
    this.class = this.route.snapshot.queryParams['class'] ? this.route.snapshot.queryParams['class'] : 'Economy';
  }

  ngOnInit() {
    this.loadJquery();
  }

  loadJquery() {
    $("body").click(function () {
      $("#add_traveler_open").hide("slow");
    });

    $("#add_traveler").click(function (e) {
      e.stopPropagation();
      $("#add_traveler_open").slideToggle("slow");
    });

    $('#add_traveler_open').click(
      function (e) {
        e.stopPropagation();
      }
    );

    // $(document).ready(function () {
    //   // This button will increment the value
    //   $('.qtyplus').click(function (e) {
    //     // Stop acting like a button
    //     e.preventDefault();
    //     // Get the field name
    //     var fieldName = $(this).attr('field');
    //     // Get its current value
    //     var currentVal = parseInt($('input[name=' + fieldName + ']').val());
    //     // If is not undefined
    //     if (!isNaN(currentVal)) {
    //       // Increment
    //       $('input[name=' + fieldName + ']').val(currentVal + 1);
    //     } else {
    //       // Otherwise put a 0 there
    //       $('input[name=' + fieldName + ']').val(0);
    //     }
    //   });
    //   // This button will decrement the value till 0
    //   $(".qtyminus").click(function (e) {
    //     // Stop acting like a button
    //     e.preventDefault();
    //     // Get the field name
    //     var fieldName = $(this).attr('field');
    //     // Get its current value
    //     var currentVal = parseInt($('input[name=' + fieldName + ']').val());
    //     // If it isn't undefined or its greater than 0
    //     if (!isNaN(currentVal) && currentVal > 0) {
    //       // Decrement one
    //       $('input[name=' + fieldName + ']').val(currentVal - 1);
    //     } else {
    //       // Otherwise put a 0 there
    //       $('input[name=' + fieldName + ']').val(0);
    //     }
    //   });
    // });
  }

  btnClickForChange(item) {
    // FOR ADULT
    if (item && item.type === 'minus' && item.label === 'adult') {
      this.adultValue = this.adultValue - 1;
    } else if (item && item.type === 'plus' && item.label === 'adult') {
      this.adultValue = this.adultValue + 1;
    }
    // FOR CHILD
    if (item && item.type === 'minus' && item.label === 'child') {
      this.childValue = this.childValue - 1;
    } else if (item && item.type === 'plus' && item.label === 'child') {
      this.childValue = this.childValue + 1;
    }
    // FOR INFANT
    if (item && item.type === 'minus' && item.label === 'infant') {
      this.infantValue = this.infantValue - 1;
    } else if (item && item.type === 'plus' && item.label === 'infant') {
      this.infantValue = this.infantValue + 1;
    }

    this.totalPerson = this.adultValue + this.childValue + this.infantValue;

    if (item && item.type === 'class' && item.value) {
      this.travellerInfo.class = item.value;
      this.class = item.value;
    }

    this.travellerInfo = {
      adult: this.adultValue,
      child: this.childValue,
      infant: this.infantValue,
      class: this.travellerInfo.class,
      totalPerson: this.totalPerson
    };
    this.changeValue.emit(this.travellerInfo);
  }
}
