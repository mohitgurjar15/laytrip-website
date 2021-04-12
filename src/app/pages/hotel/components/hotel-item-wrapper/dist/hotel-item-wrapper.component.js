"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelItemWrapperComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var animations_1 = require("@angular/animations");
var jwt_helper_1 = require("../../../../_helpers/jwt.helper");
var HotelItemWrapperComponent = /** @class */ (function () {
    function HotelItemWrapperComponent(router, route, commonFunction, genericService) {
        this.router = router;
        this.route = route;
        this.commonFunction = commonFunction;
        this.genericService = genericService;
        this.animationState = 'out';
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
        this.hotelListArray = [];
        this.mapListArray = [];
        this.noOfDataToShowInitially = 20;
        this.dataToLoad = 20;
        this.isFullListDisplayed = false;
        this.isMapView = false;
        this.subscriptions = [];
        this.showHotelDetails = [];
        this.totalLaycreditPoints = 0;
        this.showFareDetails = 0;
        this.amenitiesObject = {
            breakfast: this.s3BucketUrl + "assets/images/hotels/breakfast.svg",
            wifi: this.s3BucketUrl + "assets/images/hotels/wifi.svg",
            no_smoking: this.s3BucketUrl + "assets/images/hotels/no_smoking.svg",
            tv: this.s3BucketUrl + "assets/images/hotels/tv.svg",
            ac: this.s3BucketUrl + "assets/images/hotels/ac.svg"
        };
        this.showMapDetails = [];
        this.scrollDistance = 2;
        this.throttle = 50;
        this.scrollLoading = false;
        this.galleryOptions = [
            { "thumbnails": false, previewRotate: true, preview: false, width: "270px", height: "100%", imageSwipe: true, imageBullets: false },
        ];
    }
    HotelItemWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        var info = JSON.parse(localStorage.getItem('_hote'));
        if (info) {
            info.forEach(function (element) {
                if (element.key === 'guest') {
                    _this.hotelInfo = element.value;
                }
            });
        }
        var hotelinfo = JSON.parse(atob(this.route.snapshot.queryParams['location']));
        if (hotelinfo) {
            this.hotelName = hotelinfo.city;
        }
        this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
        //this.hotelListArray = this.hotelDetails;
        for (var i = 0; i < this.hotelListArray.length; i++) {
            this.hotelDetails[i].galleryImages = [];
            if (this.hotelDetails[i].images.length > 0) {
                for (var _i = 0, _a = this.hotelDetails[i].images; _i < _a.length; _i++) {
                    var image = _a[_i];
                    this.hotelDetails[i].galleryImages.push({
                        small: image,
                        medium: image,
                        big: image
                    });
                }
            }
            else {
                this.hotelDetails[i].galleryImages.push({
                    small: this.s3BucketUrl + 'assets/images/hotels/default_img.svg',
                    medium: this.s3BucketUrl + 'assets/images/hotels/default_img.svg',
                    big: this.s3BucketUrl + 'assets/images/hotels/default_img.svg'
                });
            }
        }
        this.mapListArray[0] = Object.assign({}, this.hotelListArray[0]);
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        // this.totalLaycredit();
        this.defaultLat = parseFloat(this.route.snapshot.queryParams['latitude']);
        this.defaultLng = parseFloat(this.route.snapshot.queryParams['longitude']);
    };
    HotelItemWrapperComponent.prototype.onScrollDown = function () {
        var _this = this;
        this.scrollLoading = true;
        setTimeout(function () {
            if (_this.noOfDataToShowInitially <= _this.hotelListArray.length) {
                _this.noOfDataToShowInitially += _this.dataToLoad;
                _this.hotelListArray = _this.hotelDetails.slice(0, _this.noOfDataToShowInitially);
                for (var i = 0; i < _this.hotelListArray.length; i++) {
                    _this.hotelDetails[i].galleryImages = [];
                    for (var _i = 0, _a = _this.hotelDetails[i].images; _i < _a.length; _i++) {
                        var image = _a[_i];
                        _this.hotelDetails[i].galleryImages.push({
                            small: image,
                            medium: image,
                            big: image
                        });
                    }
                }
                _this.scrollLoading = false;
            }
            else {
                _this.isFullListDisplayed = true;
                _this.scrollLoading = false;
            }
        }, 1000);
    };
    HotelItemWrapperComponent.prototype.ngAfterContentChecked = function () {
        this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
        var hotelinfo = JSON.parse(atob(this.route.snapshot.queryParams['location']));
        if (hotelinfo) {
            this.hotelName = hotelinfo.city;
        }
    };
    HotelItemWrapperComponent.prototype.infoWindowAction = function (template, event, action) {
        if (action === 'open') {
            template.open();
        }
        else if (action === 'close') {
            template.close();
        }
        else if (action === 'click') {
            this.mapListArray[0] = this.hotelListArray.find(function (hotel) { return hotel.id == template; });
            //this.showMapInfo(template);
        }
    };
    HotelItemWrapperComponent.prototype.showMapInfo = function (index) {
        if (typeof this.showMapDetails[index] === 'undefined') {
            this.showMapDetails[index] = true;
            document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else {
            this.showMapDetails[index] = !this.showMapDetails[index];
            document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
    HotelItemWrapperComponent.prototype.counter = function (i) {
        return new Array(i);
    };
    HotelItemWrapperComponent.prototype.differentView = function (view) {
        this.isMapView = (view !== 'listView');
        if (!this.isMapView) {
            this.mapListArray[0] = Object.assign({}, this.hotelListArray[0]);
        }
    };
    HotelItemWrapperComponent.prototype.showDetails = function (index, flag) {
        var _this = this;
        if (flag === void 0) { flag = null; }
        if (typeof this.showHotelDetails[index] === 'undefined') {
            this.showHotelDetails[index] = true;
        }
        else {
            this.showHotelDetails[index] = !this.showHotelDetails[index];
        }
        console.log("innnn");
        this.showHotelDetails = this.showHotelDetails.map(function (item, i) {
            return ((index === i) && _this.showHotelDetails[index] === true) ? true : false;
        });
    };
    HotelItemWrapperComponent.prototype.closeHotelDetail = function () {
        this.showFareDetails = 0;
        this.showHotelDetails = this.showHotelDetails.map(function (item) {
            return false;
        });
    };
    HotelItemWrapperComponent.prototype.totalLaycredit = function () {
        var _this = this;
        this.genericService.getAvailableLaycredit().subscribe(function (res) {
            _this.totalLaycreditPoints = res.total_available_points;
        }, (function (error) {
        }));
    };
    HotelItemWrapperComponent.prototype.loadJquery = function () {
        //   $('#carousel-example-generic').on('slid.bs.carousel', function () {
        //     $('#slidenum').val($('.carousel-inner .active').index());
        //  })
        //  $('#slidenum').on('change',function(){
        //    var sn = parseInt($('#slidenum').val());
        //    $('#carousel-example-generic').carousel(sn);
        //  })
        $(document).ready(function () {
            // SLIDER
            //$('.slider').slick({});
            $('.slider').slick({
                dots: true,
                speed: 1000,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 3000,
                nextArrow: '<div class="slick-custom-arrow slick-custom-arrow-right"><i class="fas fa-angle-right"></i></div>',
                prevArrow: '<div class="slick-custom-arrow slick-custom-arrow-left"><i class="fa fa-angle-left"></i></div>'
            });
        });
    };
    HotelItemWrapperComponent.prototype.ngOnChanges = function (changes) {
        if (changes.hotelDetails.currentValue.length) {
            this.hotelListArray = changes.hotelDetails.currentValue.slice(0, this.noOfDataToShowInitially);
            ;
            for (var i = 0; i < this.hotelListArray.length; i++) {
                this.hotelDetails[i].galleryImages = [];
                if (this.hotelDetails[i].images.length > 0) {
                    for (var _i = 0, _a = this.hotelDetails[i].images; _i < _a.length; _i++) {
                        var image = _a[_i];
                        this.hotelDetails[i].galleryImages.push({
                            small: image,
                            medium: image,
                            big: image
                        });
                    }
                }
                else {
                    this.hotelDetails[i].galleryImages.push({
                        small: this.s3BucketUrl + 'assets/images/hotels/default_img.svg',
                        medium: this.s3BucketUrl + 'assets/images/hotels/default_img.svg',
                        big: this.s3BucketUrl + 'assets/images/hotels/default_img.svg'
                    });
                }
            }
            this.mapListArray[0] = Object.assign({}, this.hotelListArray[0]);
        }
        //this.hotelsList = changes.hotelDetails.currentValue;
    };
    HotelItemWrapperComponent.prototype.logAnimation = function (event) {
        // console.log(event);
    };
    HotelItemWrapperComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "hotelDetails");
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "filteredLabel");
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "filter");
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "hotelToken");
    HotelItemWrapperComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-item-wrapper',
            templateUrl: './hotel-item-wrapper.component.html',
            styleUrls: ['./hotel-item-wrapper.component.scss'],
            animations: [
                animations_1.trigger('listAnimation', [
                    animations_1.transition('* => *', [
                        animations_1.query(':leave', [
                            animations_1.stagger(10, [
                                animations_1.animate('0.001s', animations_1.style({ opacity: 0 }))
                            ])
                        ], { optional: true }),
                        animations_1.query(':enter', [
                            animations_1.style({ opacity: 0 }),
                            animations_1.stagger(50, [
                                animations_1.animate('0.5s', animations_1.style({ opacity: 1 }))
                            ])
                        ], { optional: true })
                    ])
                ])
            ]
        })
    ], HotelItemWrapperComponent);
    return HotelItemWrapperComponent;
}());
exports.HotelItemWrapperComponent = HotelItemWrapperComponent;
