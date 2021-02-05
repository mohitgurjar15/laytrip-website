import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
declare var $: any;
import { GenericService } from '../../services/generic.service';
import { ModuleModel, Module } from '../../model/module.model';
import { CommonFunction } from '../../_helpers/common-function';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  modules: Module[];
  moduleList: any = {};
  isRoundTrip: boolean = false;
  countryCode: string;
  toString: string;
  moduleId = 1;
  dealList = [];

  constructor(
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    public cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private homeService: HomeService,
    private cartService: CartService,
  ) {
    this.renderer.addClass(document.body, 'bg_color');
    this.countryCode = this.commonFunction.getUserCountry();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getModules();
    this.loadJquery();
    this.getDeal(this.moduleId);
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

    $('[data-toggle="popover"]').popover();
  }

  // ngAfterViewInit() {
  //   $("#search_large_btn1, #search_large_btn2, #search_large_btn3").hover(
  //     function () {
  //       $('.norm_btn').toggleClass("d-none");
  //       $('.hover_btn').toggleClass("show");
  //     }
  //   );
  // }


  /**
   * Get All module like (hotel, flight & VR)
   */
  getModules() {
    this.genericService.getModules().subscribe(
      (response: ModuleModel) => {

        response.data.forEach(module => {
          this.moduleList[module.name] = module.status;
        });
        // console.log(this.moduleList);
      },
      (error) => {

      }
    );
  }



  toggleOnewayRoundTrip(type) {
    if (type === 'roundtrip') {
      this.isRoundTrip = true;
    } else {
      this.isRoundTrip = false;
    }
  }

  getDeal(moduleId) {
    this.homeService.getDealList(moduleId).subscribe(
      (response) => {
        this.dealList = response['data'];
      }, (error) => {

      });
  }

  clickOnTab(tabName) {
    document.getElementById('home_banner').style.position = 'relative';
    document.getElementById('home_banner').style.width = '100%';
    document.getElementById('home_banner').style.paddingBottom = '180px';
    if (tabName === 'flight') {
      this.getDeal(1);

      document.getElementById('home_banner').style.background = "url(" + this.s3BucketUrl + "assets/images/flight-tab-new-bg.svg) no-repeat";
      document.getElementById('home_banner').style.backgroundRepeat = 'no-repeat';
      document.getElementById('home_banner').style.backgroundSize = 'cover';
      // if (document.getElementById('login_btn')) {
      //   document.getElementById('login_btn').style.background = '#FC7E66';
      // }
    } else if (tabName === 'hotel') {
      this.getDeal(2);
      document.getElementById('home_banner').style.background = "url(" + this.s3BucketUrl + "assets/images/hotels/hotel_home_banner.png)";
      document.getElementById('home_banner').style.backgroundRepeat = 'no-repeat';
      document.getElementById('home_banner').style.backgroundSize = 'cover';
      // if (document.getElementById('login_btn')) {
      //   document.getElementById('login_btn').style.background = '#FF00BC';
      // }
    }
    else if (tabName === 'home-rentals') {
      this.getDeal(3);
      document.getElementById('home_banner').style.background = "url(" + this.s3BucketUrl + "assets/images/hotels/hotel_home_banner.png)";
      document.getElementById('home_banner').style.backgroundRepeat = 'no-repeat';
      document.getElementById('home_banner').style.backgroundSize = 'cover';
      // if (document.getElementById('login_btn')) {
      //   document.getElementById('login_btn').style.background = '#FF00BC';
      // }
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'bg_color');
  }

  setToString(newItem: string) {
    this.toString = newItem;
    this.homeService.setToString(newItem);
  }

}
