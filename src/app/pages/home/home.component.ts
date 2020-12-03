import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
declare var $: any;
import { ModuleModel, Module } from '../../model/module.model';
import { CommonFunction } from '../../_helpers/common-function';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor(
  ) {
  }
  ngOnInit(): void {
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
  }

  clickOnTab(tabName) {
    if (tabName === 'flight') {
      let flight = document.getElementById('home_banner');
      // flight.style.background = 'green';
      // flight.style.background.link('http://d2q1prebf1m2s9.cloudfront.net/assets/images/banner1.svg');
    } else if (tabName === 'hotel') {
      let hotel = document.getElementById('home_banner');
      // hotel.style.background = 'red';
      // hotel.style.background.link('http://d2q1prebf1m2s9.cloudfront.net/assets/images/banner1.svg');
    }
  }
}
