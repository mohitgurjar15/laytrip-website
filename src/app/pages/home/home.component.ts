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
  currentSlide;
  currentChangeCounter;
  banner_city_name = 'Miami';
  public slides = [
    { 
      src: "https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_banner/miami.png",
      location:{
        from : {
          airport_code : 'NYC'
        },
        to : {
          airport_code : 'MIA',
          hotel_option:{
            title: "Miami Beach, Florida, United States",
            city: "Miami Beach",
            banner: "Miami",
            state: "Florida",
            country: "United States",
            type: "city",
            hotel_id: "",
            city_id: "800047419",
            geo_codes: {
              lat: "25.7903",
              long: "-80.1303"
            }
          }
        }
      }
    },
    { 
      src: "https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_banner/lasvegas.png",
      location:{
        from : {
          airport_code : 'NYC'
        },
        to : {
          airport_code : 'LAS',
          hotel_option:{
            title: "Las Vegas, Nevada, United States",
            city: "Las Vegas",
            banner: "Las Vegas",
            state: "Nevada",
            country: "United States",
            type: "city",
            hotel_id: "",
            city_id: "800049030",
            geo_codes: {
              lat: "36.1190",
              long: "-115.1680"
            }
          }
        }
      }
    },
    { 
      src: "http://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_banner/cancun.png",
      location:{
        from : {
          airport_code : 'NYC'
        },
        to : {
          airport_code : 'CUN',
          hotel_option:{
            title: "Cancún, Mexico",
            city: "Cancún",
            banner: "Cancun",
            state: "",
            country: "Mexico",
            type: "city",
            hotel_id: "",
            city_id: "800026864",
            geo_codes: {
              lat: "21.1613",
              long: "-86.8341"
            }
          }
        }
      }
    }
  ];

  constructor(
    private genericService: GenericService,
    public commonFunction: CommonFunction,
    public fb: FormBuilder,
    public router: Router,
    public cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private homeService: HomeService,
    public modalService: NgbModal,
    private cookieService: CookieService,
  ) {
    this.renderer.addClass(document.body, 'bg_color');
    this.countryCode = this.commonFunction.getUserCountry();
    this.currentSlide = this.slides[0];

    this.homeService.setOffersData(this.currentSlide);

    /* this.homeService.getSlideOffers.subscribe(sliders => {
      if (typeof sliders != 'undefined' && Object.keys(sliders).length > 0) {
        let keys: any = sliders;
        console.log(keys)
      }
    }) */
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
    this.homeService.setOffersData(this.currentSlide);

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
          this.dealList = JSON.parse('[{"code":"PUJ","name":"Punta Cana Intl.","city":"Punta Cana","country":"Dominican Republic","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/puntacana.png""key":"P"},{"code":"TPA","name":"Tampa Intl.","city":"Tampa","country":"USA","key":"T","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/puntacana.png"},{"code":"CUN","name":"Cancun Intl.","city":"Cancun","country":"Mexico","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/cancun.png""key":"C"},{"code":"MCO","name":"Orlando Intl.","city":"Orlando","country":"USA","key":"O","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/orlando.png"},{"code":"LAS","name":"Mc Carran Intl","city":"Las Vegas","country":"USA","key":"L","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/lasvegas.png"},{"code":"DEN","name":"Denver Intl.","city":"Denver","country":"USA","key":"D","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/denver.png"},{"code":"MIA","name":"Miami Intl. Arpt.","city":"Miami","country":"USA","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/miami.png""key":"M"},{"code":"CUN","name":"Tulum","city":"Tulum","country":"Mexico","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/tulum.png""key":"C"}]');          
        } else if(this.moduleId == 3 && this.commonFunction.isRefferal()){
           this.dealList = JSON.parse('[{"title":"Punta Cana, Dominican Republic","city":"Punta Cana","state":"","country":"Dominican Republic","type":"city","hotel_id":"","city_id":"800013751","lat":"18.6149","long":"-68.3884","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/puntacana.png"},{"title":"Tampa, Florida, United States","city":"Tampa","state":"Florida","country":"United States","type":"city","hotel_id":"","city_id":"800047518","lat":"27.9472","long":"-82.4586","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/tampa.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/cancun.png"},{"title":"Orlando, Florida, United States","city":"Orlando","state":"Florida","country":"United States","type":"city","hotel_id":"","city_id":"800047448","lat":"28.5353","long":"-81.3833","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/orlando.png"},{"title":"Las Vegas, Nevada, United States","city":"Las Vegas","state":"Nevada","country":"United States","type":"city","hotel_id":"","city_id":"800049030","lat":"36.1190","long":"-115.1680","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/lasvegas.png"},{"title":"Denver City, Texas, United States","city":"Denver City","state":"Texas","country":"United States","type":"city","hotel_id":"","city_id":"800098479","lat":"32.9644","long":"-102.8290","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/denver.png"},{"title":"Miami Beach, Florida, United States","city":"Miami Beach","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/miami.png"},{"title":"Tulum, Quintana Roo, Mexico","city":"Tulum","state":"Quintana Roo","country":"Mexico","type":"city","hotel_id":"","city_id":"800026663","lat":"20.2107","long":"-87.4630","image":"https://d2q1prebf1m2s9.cloudfront.net/assets/images/lp_deals/tulum.png"}]');          
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
    if(this.commonFunction.isRefferal()){
      this.homeService.setOffersData(this.currentSlide);
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
    } 
  }
  
  activeSlide(activeSlide){
    this.homeService.removeToString('hotel');
    this.homeService.removeToString('flight');

    this.clickOnTab('hotel');
    $('#nav-hotel').trigger('click');
    this.currentSlide=this.slides[activeSlide]
    this.homeService.setOffersData(this.currentSlide);
    this.banner_city_name = this.currentSlide.location.to.hotel_option.banner ? this.currentSlide.location.to.hotel_option.banner : '';
  }

  getCurrentChangeCounter(event){
    this.currentChangeCounter = event; 
  }


}
