"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var cookie_policy_component_1 = require("../cookie-policy/cookie-policy.component");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(genericService, commonFunction, fb, router, cd, renderer, homeService, cartService, modalService, cookieService) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.cd = cd;
        this.renderer = renderer;
        this.homeService = homeService;
        this.cartService = cartService;
        this.modalService = modalService;
        this.cookieService = cookieService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.moduleList = {};
        this.isRoundTrip = false;
        this.isRefferal = false;
        this.moduleId = 3;
        this.dealList = [];
        this.host = '';
        this.slides = [
            {
                src: "https://q-xx.bstatic.com/xdata/images/hotel/max500/184974934.jpg?k=17803467e2d7dec840e47eccb1c9595f3b8890a51288e728188831acc4378f5d&o=",
                location: {
                    from: {
                        airport_code: 'NYC'
                    },
                    to: {
                        airport_code: 'LAS',
                        hotel_option: {
                            title: "Las Vegas, Nevada, United States",
                            city: "Las Vegas",
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
                src: "https://q-xx.bstatic.com/xdata/images/hotel/max500/101944574.jpg?k=afeb13ea4553e6dc4d0b2c01fafc85e6f80688a867080dfa7bb4ddd4577ea515&o=",
                location: {
                    from: {
                        airport_code: 'NYC'
                    },
                    to: {
                        airport_code: 'MIA',
                        hotel_option: {
                            title: "Miami Beach, Florida, United States",
                            city: "Miami Beach",
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
                src: "https://q-xx.bstatic.com/xdata/images/hotel/max500/295130173.jpg?k=cb031d144f9c01c6c99271d9a8aa241a5bd8922613b9cec738f2c83ccd2776d6&o=",
                location: {
                    from: {
                        airport_code: 'NYC'
                    },
                    to: {
                        airport_code: 'CUN',
                        hotel_option: {
                            title: "Cancún, Mexico",
                            city: "Cancún",
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
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.host = window.location.host;
        this.getModules();
        this.loadJquery();
        localStorage.removeItem('__from');
        localStorage.removeItem('__to');
        setTimeout(function () {
            _this.openCookiePolicyPopup();
        }, 5000);
        this.$tabName = this.homeService.getActiveTabName.subscribe(function (tabName) {
            if (typeof tabName != 'undefined' && Object.keys(tabName).length > 0) {
                var tab = tabName;
                if (tab == 'flight') {
                    _this.moduleId = 1;
                    $('.flight-tab').trigger('click');
                }
                else if (tab == 'hotel') {
                    _this.moduleId = 3;
                    $('.hotel-tab').trigger('click');
                }
            }
        });
        //get deal with module id and also with active tab
        this.getDeal(this.moduleId);
        this.$tabName.unsubscribe();
        this.homeService.setActiveTab('');
        this.isRefferal = this.commonFunction.isRefferal();
    };
    HomeComponent.prototype.openCookiePolicyPopup = function () {
        if (!this.cookieService.get('__cke')) {
            this.modalService.open(cookie_policy_component_1.CookiePolicyComponent, {
                windowClass: 'block_cookie_policy_main', centered: true, backdrop: 'static',
                keyboard: false
            });
        }
        else {
        }
    };
    HomeComponent.prototype.loadJquery = function () {
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
    };
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
    HomeComponent.prototype.getModules = function () {
        var _this = this;
        this.genericService.getModules().subscribe(function (response) {
            response.data.forEach(function (module) {
                _this.moduleList[module.name] = module.status;
            });
            // console.log(this.moduleList);
        }, function (error) {
        });
    };
    HomeComponent.prototype.toggleOnewayRoundTrip = function (type) {
        if (type === 'roundtrip') {
            this.isRoundTrip = true;
        }
        else {
            this.isRoundTrip = false;
        }
    };
    HomeComponent.prototype.getDeal = function (moduleId) {
        var _this = this;
        this.moduleId = moduleId;
        this.homeService.getDealList(moduleId).subscribe(function (response) {
            if (_this.moduleId == 1 && _this.commonFunction.isRefferal()) {
                _this.dealList = JSON.parse('[{"code":"MIA","name":"Miami Intl. Arpt.","city":"Miami","country":"USA","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909-6106.png","key":"M"},{"code":"CUN","name":"Cancun Intl.","city":"Cancun","country":"Mexico","image":"https://api.staging.laytrip.com/static/deal2-8335.png","key":"C"},{"code":"MIA","name":"Miami Intl. Arpt.","city":"Miami","country":"USA","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909-6106.png","key":"M"},{"code":"CUN","name":"Cancun Intl.","city":"Cancun","country":"Mexico","image":"https://api.staging.laytrip.com/static/deal2-8335.png","key":"C"},{"code":"MIA","name":"Miami Intl. Arpt.","city":"Miami","country":"USA","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909-6106.png","key":"M"},{"code":"CUN","name":"Cancun Intl.","city":"Cancun","country":"Mexico","image":"https://api.staging.laytrip.com/static/deal2-8335.png","key":"C"},{"code":"MIA","name":"Miami Intl. Arpt.","city":"Miami","country":"USA","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909-6106.png","key":"M"},{"code":"CUN","name":"Cancun Intl.","city":"Cancun","country":"Mexico","image":"https://api.staging.laytrip.com/static/deal2-8335.png","key":"C"}]');
            }
            else if (_this.moduleId == 3 && _this.commonFunction.isRefferal()) {
                _this.dealList = JSON.parse('[{"title":"Miami Beach, Florida, United States","city":"Miami Beach","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909@2x-2974.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Miami Beach, Florida, United States","city":"Miami Beach","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909@2x-2974.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Miami Beach, Florida, United States","city":"Miami Beach","city_id":"800047419","state":"","country":"United States","type":"city","hotel_id":"","lat":"25.7903","long":"-80.1303","image":"https://api.staging.laytrip.com/static/shutterstock_1512437909@2x-2974.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"},{"title":"Cancún, Mexico","city":"Cancún","city_id":"800026864","state":"","country":"Mexico","type":"city","hotel_id":"","lat":"21.1613","long":"-86.8341","image":"https://api.staging.laytrip.com/static/shutterstock_1471070054@2x-010f1.png"}]');
            }
            else {
                _this.dealList = response['data'];
            }
        }, function (error) {
        });
    };
    HomeComponent.prototype.clickOnTab = function (tabName) {
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
        }
        else if (tabName === 'hotel') {
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
    };
    HomeComponent.prototype.ngOnDestroy = function () {
        this.renderer.removeClass(document.body, 'bg_color');
    };
    HomeComponent.prototype.setToString = function (newItem) {
        if (this.moduleId == 1) {
            this.toString = newItem;
            this.homeService.setToString(newItem);
        }
        else if (this.moduleId == 3) {
            this.homeService.setLocationForHotel(newItem);
        }
    };
    HomeComponent.prototype.activeSlide = function (activeSlide) {
        this.currentSlide = this.slides[activeSlide];
        this.homeService.setOffersData(this.currentSlide);
        this.clickOnTab('hotel');
        $('#nav-hotel').trigger('click');
    };
    HomeComponent.prototype.getCurrentChangeCounter = function (event) {
        this.currentChangeCounter = event;
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.scss']
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
