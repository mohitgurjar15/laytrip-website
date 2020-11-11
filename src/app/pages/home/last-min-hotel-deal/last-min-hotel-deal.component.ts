import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
declare var $:any

@Component({
  selector: 'app-last-min-hotel-deal',
  templateUrl: './last-min-hotel-deal.component.html',
  styleUrls: ['./last-min-hotel-deal.component.scss']
})
export class LastMinHotelDealComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
    this.loadJquery();
  }

  loadJquery(){
    // Start Featured List Js
    $(".dr_deal_slid").slick({
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
  }

}
