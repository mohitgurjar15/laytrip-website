import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
declare var $: any;
import { GenericService } from '../../services/generic.service';
import { ModuleModel, Module } from '../../model/module.model';
import { CommonFunction } from '../../_helpers/common-function';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { CartService } from '../../services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookiePolicyComponent } from '../cookie-policy/cookie-policy.component';
import { CookieService } from 'ngx-cookie';

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
  isRefferal: boolean = false;
  countryCode: string;
  toString: string;
  moduleId = 3;
  dealList = [];
  host:string='';
  $tabName;

  constructor(
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    public cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private homeService: HomeService,
    private cartService: CartService,
    public modalService: NgbModal,
    private cookieService: CookieService,
  ) {
    this.renderer.addClass(document.body, 'bg_color');
    this.countryCode = this.commonFunction.getUserCountry();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.host = window.location.host;
    this.getModules();
    this.loadJquery();
    localStorage.removeItem('__from');
    localStorage.removeItem('__to');
    setTimeout(() => {
      this.openCookiePolicyPopup();
    }, 5000);

    this.$tabName = this.homeService.getActiveTabName.subscribe(tabName=> {
      if(typeof tabName != 'undefined' && Object.keys(tabName).length > 0 ){     
        let tab : any = tabName;
        if(tab == 'flight'){
          this.moduleId = 1;
          $('.flight-tab').trigger('click');
        } else if(tab == 'hotel') {
          this.moduleId=3;
          $('.hotel-tab').trigger('click');          
        }
      }
    });
    //get deal with module id and also with active tab
    this.getDeal(this.moduleId);
    this.$tabName.unsubscribe();
    this.homeService.setActiveTab('');
    this.homeService.getActiveTabName.subscribe(tabName=> {
      if(typeof tabName != 'undefined' && Object.keys(tabName).length > 0 ){  }
      
    });

    this.isRefferal = this.commonFunction.isRefferal();
  }

  openCookiePolicyPopup() {
    if (!this.cookieService.get('__cke')) {
      this.modalService.open(CookiePolicyComponent, {
        windowClass: 'block_cookie_policy_main', centered: true, backdrop: 'static',
        keyboard: false
      });
    } else {

    }
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
    this.moduleId = moduleId;  
    this.homeService.getDealList(moduleId).subscribe(
      (response) => {
        if(this.moduleId == 1 && this.commonFunction.isRefferal()){
          this.dealList = JSON.parse('[{"code":"MIA","name":"Miami Intl. Arpt.","city":"Miami","country":"USA","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909-6106.png","key":"M"},{"code":"CUN","name":"Cancun Intl.","city":"Cancun","country":"Mexico","image":"https://api.staging.laytrip.com/static/deal2-8335.png","key":"C"},{"code":"MIA","name":"Miami Intl. Arpt.","city":"Miami","country":"USA","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909-6106.png","key":"M"},{"code":"CUN","name":"Cancun Intl.","city":"Cancun","country":"Mexico","image":"https://api.staging.laytrip.com/static/deal2-8335.png","key":"C"},{"code":"MIA","name":"Miami Intl. Arpt.","city":"Miami","country":"USA","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909-6106.png","key":"M"},{"code":"CUN","name":"Cancun Intl.","city":"Cancun","country":"Mexico","image":"https://api.staging.laytrip.com/static/deal2-8335.png","key":"C"},{"code":"MIA","name":"Miami Intl. Arpt.","city":"Miami","country":"USA","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909-6106.png","key":"M"},{"code":"CUN","name":"Cancun Intl.","city":"Cancun","country":"Mexico","image":"https://api.staging.laytrip.com/static/deal2-8335.png","key":"C"}]');          
        } else if(this.moduleId == 3 && this.commonFunction.isRefferal()){
          this.dealList = JSON.parse('[{"title":"Miami Beach, Florida, United States","city":"Miami Beach1","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909@2x-2974.png"},{"title":"Cancún, Mexico","city":"Cancún2","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Cancún, Mexico","city":"Cancún3","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Miami Beach, Florida, United States","city":"Miami Beach4","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909@2x-2974.png"},{"title":"Cancún, Mexico","city":"Cancún5","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Cancún, Mexico","city":"Cancún6","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Miami Beach, Florida, United States","city":"Miami Beach7","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909@2x-2974.png"},{"title":"Cancún, Mexico","city":"Cancún8","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Cancún, Mexico","city":"Cancún9","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"}]');          
        } else {
          this.dealList = response['data'];
        }
      }, (error) => {

      });
  }

  clickOnTab(tabName) {
    document.getElementById('home_banner').style.position = 'relative';
    document.getElementById('home_banner').style.width = '100%';
    if (tabName === 'flight') {
      this.getDeal(1);


      document.getElementById('home_banner').style.background = "url(" + this.s3BucketUrl + "assets/images/flight-tab-new-bg.svg) no-repeat";
      document.getElementById('home_banner').style.backgroundRepeat = 'no-repeat';
      document.getElementById('home_banner').style.backgroundSize = 'cover';
      // if (document.getElementById('login_btn')) {
      //   document.getElementById('login_btn').style.background = '#FC7E66';
      // }
    } else if (tabName === 'hotel') {
      this.getDeal(3);
      document.getElementById('home_banner').style.background = "url(" + this.s3BucketUrl + "assets/images/hotels/flight-tab-new-bg.svg)";
      document.getElementById('home_banner').style.backgroundRepeat = 'no-repeat';
      document.getElementById('home_banner').style.backgroundSize = 'cover';
      // if (document.getElementById('login_btn')) {
      //   document.getElementById('login_btn').style.background = '#FF00BC';
      // }
    }
    else if (tabName === 'home-rentals') {
      this.getDeal(3);
      document.getElementById('home_banner').style.background = "url(" + this.s3BucketUrl + "assets/images/hotels/flight-tab-new-bg.svg)";
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
    if(this.moduleId == 1){
      this.toString = newItem;
      this.homeService.setToString(newItem);
    } else if(this.moduleId == 3) {
      this.homeService.setLocationForHotel(newItem);
    } else {

    }
  }


}
