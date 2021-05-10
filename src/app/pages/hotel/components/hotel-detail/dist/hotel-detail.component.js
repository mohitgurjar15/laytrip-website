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
exports.HotelDetailComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var hotel_policy_popup_component_1 = require("../hotel-policy-popup/hotel-policy-popup.component");
var HotelDetailComponent = /** @class */ (function () {
    function HotelDetailComponent(route, hotelService, homeService, router, modalService, cartService) {
        this.route = route;
        this.hotelService = hotelService;
        this.homeService = homeService;
        this.router = router;
        this.modalService = modalService;
        this.cartService = cartService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.hotelRoomArray = [];
        this.imageTemp = [];
        this.loading = false;
        this.showFareDetails = 0;
        this.showMoreAmenties = false;
        this.roomSummary = {
            hotelInfo: {},
            roomDetail: {
                totalRoom: null,
                totalAdults: null,
                totalChildren: null,
                checkIn: '',
                checkOut: ''
            }
        };
        this.dataLoading = false;
        this.activeSlide = 1;
        this.dots = 5;
        this.cartItems = [];
        this.addCartLoading = false;
        this.isNotFound = false;
        this.isCartFull = false;
    }
    HotelDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('body').addClass('cms-bgColor');
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        this.route.params.subscribe(function (params) {
            if (params) {
                _this.hotelId = params.id;
                _this.hotelToken = params.token;
            }
        });
        this.cartService.getCartItems.subscribe(function (cartItems) {
            _this.cartItems = cartItems;
        });
        /*  this.hotelService.getHotelDetail(`${this.hotelId}`, this.hotelToken).subscribe((res: any) => {
           this.loading = false;
           if (res && res.data && res.data.hotel) {
             this.hotelDetails = {
               name: res.data.hotel.name,
               city_name: res.data.hotel.address.city_name,
               address: res.data.hotel.full_address,
               state_code: res.data.hotel.address.state_code,
               country_name: res.data.hotel.address.country_name,
               rating: res.data.hotel.rating,
               review_rating: res.data.hotel.review_rating,
               description: res.data.hotel.description,
               amenities: res.data.hotel.amenities,
               hotelLocations: res.data.hotel.geocodes,
               hotelReviews: res.data.hotel.reviews,
               thumbnail: res.data.hotel.thumbnail
             };
             if (res.data.hotel.images) {
     
               res.data.hotel.images.forEach(imageUrl => {
                 this.imageTemp.push({
                   small: `${imageUrl}`,
                   medium: `${imageUrl}`,
                   big: `${imageUrl}`,
                   description: `${this.hotelDetails.name}`
                 });
                 this.galleryImages = this.imageTemp;
               });
     
             }
             occupancies = collect(res.data.details.occupancies);
             this.roomSummary.roomDetail.checkIn = res.data.details.check_in;
             this.roomSummary.roomDetail.checkOut = res.data.details.check_out;
             if (res.data.details && res.data.details.occupancies && res.data.details.occupancies.length) {
               this.roomSummary.roomDetail.totalRoom = occupancies.count();
               this.roomSummary.roomDetail.totalAdults = occupancies.sum('adults');
               this.roomSummary.roomDetail.totalChildren = occupancies.flatMap((value) => value['children']).count();
             }
           }
           else{
             this.isNotFound=true;
           }
         }, error => {
           this.isNotFound=true;
           this.loading = false;
         }); */
        this.loading = true;
        this.hotelService.getRoomDetails("" + this.hotelId, this.hotelToken).subscribe(function (res) {
            _this.loading = false;
            if (res) {
                _this.hotelRoomArray = res.data;
                for (var i = 0; i < _this.hotelRoomArray.length; i++) {
                    _this.hotelRoomArray[i].galleryImages = [];
                    for (var _i = 0, _a = _this.hotelRoomArray[i].photos; _i < _a.length; _i++) {
                        var image = _a[_i];
                        _this.hotelRoomArray[i].galleryImages.push({
                            small: image,
                            medium: image,
                            big: image
                        });
                    }
                    _this.hotelRoomArray[i].dots = _this.hotelRoomArray[i].galleryImages.length > 5 ? 5 : _this.hotelRoomArray[i].galleryImages.length;
                    _this.hotelRoomArray[i].activeSlide = 1;
                }
                //this.roomSummary.hotelInfo = res.data[0];
                _this.hotelDetails = {
                    name: res.hotel.name,
                    city_name: res.hotel.address.city_name,
                    address: res.hotel.full_address,
                    state_code: res.hotel.address.state_code,
                    country_name: res.hotel.address.country_name,
                    rating: res.hotel.rating,
                    review_rating: res.hotel.review_rating,
                    description: res.hotel.description,
                    amenities: res.hotel.amenities,
                    hotelLocations: res.hotel.geocodes,
                    latitude: parseFloat(res.hotel.geocodes.latitude),
                    longitude: parseFloat(res.hotel.geocodes.longitude),
                    hotelReviews: res.hotel.reviews,
                    thumbnail: res.hotel.thumbnail
                };
                if (res.hotel.images.length) {
                    res.hotel.images.forEach(function (imageUrl) {
                        _this.imageTemp.push({
                            small: "" + imageUrl,
                            medium: "" + imageUrl,
                            big: "" + imageUrl,
                            description: "" + _this.hotelDetails.name
                        });
                        _this.galleryImages = _this.imageTemp;
                    });
                }
            }
        }, function (error) {
            _this.loading = false;
            _this.isNotFound = true;
        });
    };
    HotelDetailComponent.prototype.counter = function (i) {
        i = Math.ceil(i);
        return new Array(i);
    };
    HotelDetailComponent.prototype.selectRoom = function (roomInfo) {
        var _this = this;
        if (this.cartItems && this.cartItems.length >= 10) {
            this.addCartLoading = false;
            this.isCartFull = true;
            //this.maxCartValidation.emit(true)
        }
        else {
            this.addCartLoading = true;
            var payload = {
                module_id: 3,
                route_code: roomInfo.bundle
            };
            this.cartService.addCartItem(payload).subscribe(function (res) {
                _this.addCartLoading = false;
                if (res) {
                    var newItem = { id: res.data.id, module_Info: res.data.moduleInfo[0] };
                    _this.cartItems = __spreadArrays(_this.cartItems, [newItem]);
                    _this.cartService.setCartItems(_this.cartItems);
                    localStorage.setItem('$crt', JSON.stringify(_this.cartItems.length));
                    _this.router.navigate(["cart/booking"]);
                }
            }, function (error) {
                _this.addCartLoading = false;
            });
        }
    };
    HotelDetailComponent.prototype.openPolicyPopup = function (policyInfo, type) {
        var payload = {
            policyInfo: policyInfo,
            type: type,
            title: ''
        };
        if (type === 'cancellation_policies') {
            payload.title = 'Room Cancellation Policy';
        }
        else if (type === 'policies') {
            payload.title = 'Room Policy';
        }
        var modalRef = this.modalService.open(hotel_policy_popup_component_1.HotelPolicyPopupComponent, {
            windowClass: 'custom-z-index',
            centered: true,
            size: 'lg'
        });
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        modalRef.componentInstance.data = payload;
    };
    HotelDetailComponent.prototype.logAnimation = function (event) {
        // console.log(event);
    };
    HotelDetailComponent.prototype.removeCartFullError = function () {
        this.isCartFull = false;
    };
    HotelDetailComponent.prototype.toggleAmenities = function (target, type) {
        this.showMoreAmenties = !this.showMoreAmenties;
        if (type == 'less') {
            target.scrollIntoView({ behavior: 'smooth', block: "start", inline: 'nearest' });
        }
        //document.getElementsByClassName('#target').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    HotelDetailComponent.prototype.ngAfterViewInit = function () {
        this.carousel.toArray().forEach(function (el) {
        });
    };
    HotelDetailComponent.prototype.onMainSlide = function (event) {
        if (event.direction == 'left') {
            if (this.activeSlide < this.dots) {
                this.activeSlide += 1;
            }
        }
        else {
            if (this.activeSlide > 1) {
                this.activeSlide -= 1;
            }
        }
    };
    HotelDetailComponent.prototype.onRoomSlide = function (event, roomNumber) {
        if (event.direction == 'left') {
            if (this.hotelRoomArray[roomNumber].activeSlide < this.hotelRoomArray[roomNumber].dots) {
                this.hotelRoomArray[roomNumber].activeSlide += 1;
            }
        }
        else {
            if (this.hotelRoomArray[roomNumber].activeSlide > 1) {
                this.hotelRoomArray[roomNumber].activeSlide -= 1;
            }
        }
    };
    HotelDetailComponent.prototype.moduleTabClick = function (tabName) {
        if (tabName == 'flight') {
            this.homeService.setActiveTab(tabName);
            this.router.navigate(['/']);
        }
    };
    __decorate([
        core_1.ViewChild('maincarousel', null)
    ], HotelDetailComponent.prototype, "maincarousel");
    __decorate([
        core_1.ViewChildren(ng_bootstrap_1.NgbCarousel)
    ], HotelDetailComponent.prototype, "carousel");
    HotelDetailComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-detail',
            templateUrl: './hotel-detail.component.html',
            styleUrls: ['./hotel-detail.component.scss']
        })
    ], HotelDetailComponent);
    return HotelDetailComponent;
}());
exports.HotelDetailComponent = HotelDetailComponent;
