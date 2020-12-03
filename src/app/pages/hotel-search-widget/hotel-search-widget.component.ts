import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-hotel-search-widget',
  templateUrl: './hotel-search-widget.component.html',
  styleUrls: ['./hotel-search-widget.component.scss']
})
export class HotelSearchWidgetComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  hotelSearchForm: FormGroup;
  defaultCity = 'New York';
  defaultHotelCountry = 'NY, United States';
  constructor(
    public fb: FormBuilder,
    public router: Router,
  ) {
    this.hotelSearchForm = this.fb.group({
      fromDestination: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadJquery();
  }

  loadJquery() {
    // Start Featured List Js
    $(".deals_slid").slick({
      dots: false,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
    // Close Featured List Js

    $("body").click(function () {
      $("#add_child_open").hide("slow");
    });

    $("#add_child").click(function (e) {
      e.stopPropagation();
      $("#add_child_open").slideToggle("slow");
    });

    $('#add_child_open').click(
      function (e) {
        e.stopPropagation();
      }
    );
  }

  changeGuestInfo(event) {

  }

  destinationChangedValue(event) {
    if (event && event.key && event.key === 'fromSearch') {
      console.log(event);
    }
  }
}
