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
var HotelItemWrapperComponent = /** @class */ (function () {
    function HotelItemWrapperComponent(route, commonFunction, genericService, hotelService) {
        this.route = route;
        this.commonFunction = commonFunction;
        this.genericService = genericService;
        this.hotelService = hotelService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.hotelListArray = [];
        this.hotelList = [];
        this.mapListArray = [];
        this.noOfDataToShowInitially = 20000;
        this.dataToLoad = 20;
        this.isFullListDisplayed = false;
        this.isMapView = false;
        this.currentPage = 1;
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
            _this.currentPage = 1;
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
            _this.hotelList = __spreadArrays(_this.hotelListArray);
            /* if(this.hotelListArray.length > 0){
              this.mapListArray[0] =  Object.assign({},this.hotelListArray[0]);
            } else {
              this.mapListArray = [];
            } */
        });
    };
    HotelItemWrapperComponent.prototype.onScrollDown = function () {
        this.scrollLoading = true;
        console.log('scrolled!!');
        /* setTimeout(() => {
          if (this.noOfDataToShowInitially <= this.hotelListArray.length) {
            this.noOfDataToShowInitially += this.dataToLoad;
            this.hotelListArray = this.hotelDetails.slice(0, this.noOfDataToShowInitially);
            for(let i=0; i < this.hotelListArray.length; i++){
              this.hotelDetails[i].galleryImages=[];
              for(let image of this.hotelDetails[i].images)
              this.hotelDetails[i].galleryImages.push({
                small: image,
                medium:image,
                big:image
              })
            }
            this.scrollLoading = false;
          } else {
            this.isFullListDisplayed = true;
            this.scrollLoading = false;
          }
        }, 1000); */
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
        if (this.isMapView) {
            if (this.bounds) {
                this.checkMarkersInBounds(this.bounds);
            }
        }
        else {
            console.log("this.hotelList.length", this.hotelList.length);
            this.hotelListArray = __spreadArrays(this.hotelList);
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
