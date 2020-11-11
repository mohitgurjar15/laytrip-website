import { Component, OnInit } from '@angular/core';
import { CommonFunction } from '../../../_helpers/common-function';
import { environment } from '../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-featured-city',
  templateUrl: './featured-city.component.html',
  styleUrls: ['./featured-city.component.scss']
})
export class FeaturedCityComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  countryCode:string='';
  constructor(
    private commonFunction:CommonFunction
  ) { 

    this.countryCode = this.commonFunction.getUserCountry();
    console.log("this.",this.countryCode)
    if(this.countryCode==''){
      setTimeout(()=>{this.loadJquery();},100) 
    }
  }

  ngOnInit() {
  }

  loadJquery(){
    $(".featured_slid").slick({
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
  }

}
