"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.HotelItemWrapperComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var jwt_helper_1 = require("../../../../_helpers/jwt.helper");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var HotelItemWrapperComponent = /** @class */ (function () {
    function HotelItemWrapperComponent(route, commonFunction, genericService, hotelService, cd) {
        this.route = route;
        this.commonFunction = commonFunction;
        this.genericService = genericService;
        this.hotelService = hotelService;
        this.cd = cd;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.hotelListArray = [];
        this.hotelList = [];
        this.mapListArray = [];
        this.noOfDataToShowInitially = 25;
        this.dataToLoad = 25;
        this.isFullListDisplayed = false;
        this.isMapView = false;
        this.currentPage = 1;
        this.infoWindowOpened = null;
        this.previousInfoWindow = null;
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
        this.check_in = '';
        this.check_out = '';
        this.latitude = '';
        this.longitude = '';
        this.itenery = '';
        this.location = '';
        this.city_id = '';
        this.hotelCount = 0;
        this.previousHotelIndex = -1;
        this.galleryOptions = [
            { "thumbnails": false, previewRotate: true, preview: false, width: "270px", height: "100%", imageSwipe: true, imageBullets: false, lazyLoading: true },
        ];
        this.check_in = this.route.snapshot.queryParams['check_in'];
        this.check_out = this.route.snapshot.queryParams['check_out'];
        this.latitude = this.route.snapshot.queryParams['latitude'];
        this.longitude = this.route.snapshot.queryParams['longitude'];
        this.itenery = this.route.snapshot.queryParams['itenery'];
        this.location = this.route.snapshot.queryParams['location'];
        this.city_id = this.route.snapshot.queryParams['city_id'];
    }
    HotelItemWrapperComponent.prototype.ngAfterViewInit = function () {
        this.carousel.toArray().forEach(function (el) {
        });
    };
    HotelItemWrapperComponent.prototype.onSlide = function (event, roomNumber) {
        var sliderNumber = ".ngb-slide-" + event.current + '-' + roomNumber;
        $(sliderNumber).attr('src', $(sliderNumber).attr('data'));
        $(sliderNumber).removeAttr('data');
        if (event.direction == 'left') {
            if (this.hotelDetails[roomNumber].activeSlide < this.hotelDetails[roomNumber].dots) {
                this.hotelDetails[roomNumber].activeSlide += 1;
            }
        }
        else {
            console.log(this.hotelDetails[roomNumber].activeSlide, "---");
            if (this.hotelDetails[roomNumber].activeSlide > 1) {
                this.hotelDetails[roomNumber].activeSlide -= 1;
            }
        }
    };
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
        this.userInfo = jwt_helper_1.getLoginUserInfo();
        this.defaultLat = parseFloat(this.route.snapshot.queryParams['latitude']);
        this.defaultLng = parseFloat(this.route.snapshot.queryParams['longitude']);
        this.hotelService.getHotels.subscribe(function (result) {
            _this.hotelDetails = result;
            for (var i = 0; i < _this.hotelDetails.length; i++) {
                _this.hotelDetails[i].galleryImages = [];
                for (var _i = 0, _a = _this.hotelDetails[i].images; _i < _a.length; _i++) {
                    var image = _a[_i];
                    if (_this.hotelDetails[i].images) {
                        _this.hotelDetails[i].galleryImages.push({
                            small: image,
                            medium: image,
                            big: image
                        });
                    }
                }
                _this.hotelDetails[i].dots = _this.hotelDetails[i].galleryImages.length > 5 ? 5 : _this.hotelDetails[i].galleryImages.length;
                _this.hotelDetails[i].activeSlide = 1;
            }
            _this.hotelCount = _this.hotelDetails.length;
            _this.currentPage = 1;
            _this.hotelListArray = _this.hotelDetails.slice(0, _this.noOfDataToShowInitially);
            _this.hotelList = __spreadArrays(_this.hotelListArray);
            if (_this.bounds) {
                _this.checkMarkersInBounds(_this.bounds);
            }
        });
    };
    HotelItemWrapperComponent.prototype.changeSlide = function (slideId) {
        console.log(slideId);
    };
    // checkOnError(brokenImage) {
    //   for (let i = 0; i < this.hotelDetails.length; i++) {
    //     this.hotelDetails[i].galleryImages = [];
    //     for (let image of this.hotelDetails[i].images) {
    //       this.hotelDetails[i].galleryImages.splice(brokenImage, 1);
    //       this.cd.detectChanges();
    //       console.log(this.hotelDetails[i].galleryImages);
    //     }
    //   }
    // }
    HotelItemWrapperComponent.prototype.checkOnError = function (brokenImage) {
        console.log(brokenImage);
        for (var i = 0; i < this.hotelDetails.length; i++) {
            this.hotelDetails[i].galleryImages = [];
            for (var _i = 0, _a = this.hotelDetails[i].images; _i < _a.length; _i++) {
                var image = _a[_i];
                if (this.hotelDetails[i].images) {
                    if (image !== brokenImage.small) {
                        this.hotelDetails[i].galleryImages.push({
                            small: image,
                            medium: image,
                            big: image
                        });
                        this.hotelDetails[i].galleryImages = this.hotelDetails[i].galleryImages;
                    }
                }
            }
            this.hotelDetails[i].dots = this.hotelDetails[i].galleryImages.length > 5 ? 5 : this.hotelDetails[i].galleryImages.length;
            this.hotelDetails[i].activeSlide = 1;
        }
    };
    HotelItemWrapperComponent.prototype.onScrollDown = function () {
        var _this = this;
        if (this.isMapView) {
            return false;
        }
        this.scrollLoading = true;
        console.log("scrolled");
        console.log(this.noOfDataToShowInitially, " <= ", this.hotelListArray.length);
        setTimeout(function () {
            if (_this.noOfDataToShowInitially <= _this.hotelDetails.length) {
                _this.noOfDataToShowInitially += _this.dataToLoad;
                _this.hotelListArray = _this.hotelDetails.slice(0, _this.noOfDataToShowInitially);
                _this.hotelList = __spreadArrays(_this.hotelListArray);
                _this.scrollLoading = false;
            }
            else {
                _this.isFullListDisplayed = true;
                _this.scrollLoading = false;
            }
        }, 1000);
    };
    HotelItemWrapperComponent.prototype.closeWindow = function () {
        if (this.previousInfoWindow != null) {
            this.previousInfoWindow.close();
            this.previousInfoWindow = null;
        }
    };
    HotelItemWrapperComponent.prototype.displayHotelDetails = function (hotelId, infoWindow, type) {
        infoWindow.open();
        if (this.previousInfoWindow == null)
            this.previousInfoWindow = infoWindow;
        else {
            this.infoWindowOpened = infoWindow;
            if (this.previousInfoWindow != null) {
                this.previousInfoWindow.close();
            }
        }
        this.previousInfoWindow = infoWindow;
        if (type === 'click') {
            if (this.previousHotelIndex > -1) {
                var previousHotel = this.hotelListArray[0];
                //console.log(this.previousHotelIndex,previousHotel)
                //this.hotelListArray.splice(this.previousHotelIndex+1, 0, previousHotel);
                this.hotelListArray = this.move(this.hotelListArray, 0, this.previousHotelIndex);
            }
            var hotelIndex = this.hotelListArray.findIndex(function (hotel) { return hotel.id == hotelId; });
            if (hotelIndex >= 0) {
                this.hotelListArray.unshift(this.hotelListArray.splice(hotelIndex, 1)[0]);
                this.previousHotelIndex = hotelIndex;
            }
            /* else{
              let hotel = this.hotelList.find(hotel => hotel.id == hotelId);
              this.hotelListArray.unshift(hotel)
            } */
        }
    };
    HotelItemWrapperComponent.prototype.move = function (input, from, to) {
        var numberOfDeletedElm = 1;
        var elm = input.splice(from, numberOfDeletedElm)[0];
        numberOfDeletedElm = 0;
        input.splice(to, numberOfDeletedElm, elm);
        return input;
    };
    HotelItemWrapperComponent.prototype.showInfoWindow = function (infoWindow, event, action) {
        if (this.previousInfoWindow == null)
            this.previousInfoWindow = infoWindow;
        else {
            this.infoWindowOpened = infoWindow;
            this.previousInfoWindow.close();
        }
        this.previousInfoWindow = infoWindow;
        if (action === 'open') {
            infoWindow.open();
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
        if (this.isMapView) {
            if (this.bounds) {
                this.checkMarkersInBounds(this.bounds);
            }
        }
        else {
            this.hotelListArray = __spreadArrays(this.hotelList);
            this.hotelCount = this.hotelDetails.length;
        }
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
    HotelItemWrapperComponent.prototype.pageChanged = function (page) {
        this.currentPage = page;
        window.scroll(0, 0);
    };
    HotelItemWrapperComponent.prototype.getMapPrice = function (hotel) {
        return "$" + Math.floor(hotel.secondary_start_price);
    };
    HotelItemWrapperComponent.prototype.checkMarkersInBounds = function (bounds) {
        this.bounds = bounds;
        if (this.isMapView) {
            this.hotelListArray = [];
            for (var _i = 0, _a = this.hotelList; _i < _a.length; _i++) {
                var hotel = _a[_i];
                var hotelPosition = { lat: parseFloat(hotel.geocodes.latitude), lng: parseFloat(hotel.geocodes.longitude) };
                if (this.bounds.contains(hotelPosition)) {
                    this.hotelListArray.push(hotel);
                    //this.hotelDetails=[...this.hotelListArray]
                }
            }
            this.hotelCount = this.hotelListArray.length;
        }
    };
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "filteredLabel");
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "filter");
    __decorate([
        core_1.Input()
    ], HotelItemWrapperComponent.prototype, "hotelToken");
    __decorate([
        core_1.ViewChildren(ng_bootstrap_1.NgbCarousel)
    ], HotelItemWrapperComponent.prototype, "carousel");
    HotelItemWrapperComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-item-wrapper',
            templateUrl: './hotel-item-wrapper.component.html',
            styleUrls: ['./hotel-item-wrapper.component.scss']
        })
    ], HotelItemWrapperComponent);
    return HotelItemWrapperComponent;
}());
exports.HotelItemWrapperComponent = HotelItemWrapperComponent;
