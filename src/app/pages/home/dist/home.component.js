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
var HomeComponent = /** @class */ (function () {
    function HomeComponent(genericService, commonFunction, fb, router, cd, renderer, homeService) {
        this.genericService = genericService;
        this.commonFunction = commonFunction;
        this.fb = fb;
        this.router = router;
        this.cd = cd;
        this.renderer = renderer;
        this.homeService = homeService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.moduleList = {};
        this.isRoundTrip = false;
        this.renderer.addClass(document.body, 'bg_color');
        this.countryCode = this.commonFunction.getUserCountry();
    }
    HomeComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.getModules();
        this.loadJquery();
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
    HomeComponent.prototype.clickOnTab = function (tabName) {
        document.getElementById('home_banner').style.position = 'relative';
        document.getElementById('home_banner').style.width = '100%';
        document.getElementById('home_banner').style.paddingBottom = '180px';
        if (tabName === 'flight') {
            document.getElementById('home_banner').style.background = "url(" + this.s3BucketUrl + "assets/images/flight-tab-bg.svg) no-repeat";
            document.getElementById('home_banner').style.backgroundRepeat = 'no-repeat';
            document.getElementById('home_banner').style.backgroundSize = 'cover';
            // if (document.getElementById('login_btn')) {
            //   document.getElementById('login_btn').style.background = '#FC7E66';
            // }
        }
        else if (tabName === 'hotel') {
            document.getElementById('home_banner').style.background = "url(" + this.s3BucketUrl + "assets/images/hotels/hotel_home_banner.png)";
            document.getElementById('home_banner').style.backgroundRepeat = 'no-repeat';
            document.getElementById('home_banner').style.backgroundSize = 'cover';
            // if (document.getElementById('login_btn')) {
            //   document.getElementById('login_btn').style.background = '#FF00BC';
            // }
        }
        else if (tabName === 'home-rentals') {
            document.getElementById('home_banner').style.background = "url(" + this.s3BucketUrl + "assets/images/hotels/hotel_home_banner.png)";
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
        this.toString = newItem;
        console.log('homecomponent', this.toString);
        this.homeService.setToString(newItem);
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
