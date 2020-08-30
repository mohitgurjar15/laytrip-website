import { Component, OnInit, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-flight-price-slider',
  templateUrl: './flight-price-slider.component.html',
  styleUrls: ['./flight-price-slider.component.scss']
})
export class FlightPriceSliderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.loadJquery();
  }

  loadJquery() {
    // Start Flight Price By Day slider js
    $('.price_day_slider').slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 7,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
    // Close Flight Price By Day slider js
  }

}
