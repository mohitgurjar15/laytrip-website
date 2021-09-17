import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';
import { ModuleModel, Module } from '../../model/module.model';
import { CommonFunction } from '../../_helpers/common-function';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookiePolicyComponent } from '../cookie-policy/cookie-policy.component';
import { CookieService } from 'ngx-cookie';
import { PreloadingService } from '../../services/preloading.service';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  modules: Module[];
  moduleList: any = {};
  currentTabName: string = 'flight';
  isRefferal: boolean = false;
  countryCode: string;
  toString: string;
  moduleId = 1;
  dealList = [];
  host: string = '';
  $tabName;
  currentSlide;
  currentChangeCounter;
  banner_city_name = 'Miami';
  slides;
  landingPageName;
  $landingPageData;
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
    public preLoadService: PreloadingService,
    private route: ActivatedRoute
  ) {
    this.landingPageName = this.route.snapshot.queryParams['utm_source']
    this.renderer.addClass(document.body, 'bg_color');
    this.countryCode = this.commonFunction.getUserCountry();
    this.homeService.getLandingPageData.subscribe(data => {
      try {
        this.$landingPageData = data;
        this.slides = this.$landingPageData.slides;
        this.currentSlide = this.$landingPageData.slides[0];
        this.homeService.setOffersData(this.currentSlide);
      } catch (e) {
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.host = window.location.host;
    this.isRefferal = this.commonFunction.isRefferal();
    this.getModules();
    this.loadJquery();
    localStorage.removeItem('__from');
    localStorage.removeItem('__to');
    setTimeout(() => {
      this.openCookiePolicyPopup();
    }, 5000);
    this.homeService.setOffersData(this.currentSlide);
    this.$tabName = this.homeService.getActiveTabName.subscribe(tabName => {
      if (typeof tabName != 'undefined' && Object.keys(tabName).length > 0) {
        let tab: any = tabName;
        if (tab == 'flight') {
          this.moduleId = 1;
          $('.flight-tab').trigger('click');
        } else if (tab == 'hotel') {
          this.moduleId = 3;
          $('.hotel-tab').trigger('click');
        }
      }
    });
    this.$tabName.unsubscribe();

    //get deal with module id and also with active tab
    this.getDeal(this.moduleId);
    this.homeService.setActiveTab('');
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
      },
      (error) => {

      }
    );
  }


  getDeal(moduleId) {
    this.moduleId = moduleId;
    this.homeService.getDealList(moduleId).subscribe(
      (response) => {
        if (this.moduleId == 1 && this.commonFunction.isRefferal()) {
          this.dealList = this.$landingPageData.deals.flight;
        } else if (this.moduleId == 3 && this.commonFunction.isRefferal()) {
          this.dealList = this.$landingPageData.deals.hotel;
          console.log(this.dealList)
        } else {
          this.dealList = response['data'];
        }
      }, (error) => {

      });
  }

  clickOnTab(tabName) {
    this.dealList = [];
    this.currentTabName = tabName;
    document.getElementById('home_banner').style.position = 'relative';
    document.getElementById('home_banner').style.width = '100%';
    if (tabName === 'flight') {
      this.getDeal(1);
    } else if (tabName === 'hotel') {
      this.getDeal(3);
    }
    else if (tabName === 'home-rentals') {
      this.getDeal(3);
    }
    if (this.commonFunction.isRefferal()) {
      this.currentChangeCounter += this.currentChangeCounter;
      this.homeService.setOffersData(this.currentSlide);

    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'bg_color');
  }

  fetchWidgetDeal(newItem: string) {
    if (this.moduleId == 1) {
      this.toString = newItem;
      this.homeService.setToString(newItem);
    } else if (this.moduleId == 3) {
      this.homeService.setLocationForHotel(newItem);
    }
  }

  activeSlide(activeSlide) {
    this.currentTabName = 'hotel';
    this.currentSlide = this.$landingPageData.slides[activeSlide];
    this.homeService.setOffersData(this.currentSlide);
    this.banner_city_name = this.currentSlide.location.to.hotel_option.banner ? this.currentSlide.location.to.hotel_option.banner : '';

  }

  getCurrentChangeCounter(event) {
    this.currentChangeCounter = event;
  }

  onSwipe(evt) {
    const direction = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : '';
    this.homeService.setSwipeSlideDirection(direction)
  }
}
