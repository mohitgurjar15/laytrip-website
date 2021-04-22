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
var collect_js_1 = require("collect.js");
var hotel_policy_popup_component_1 = require("../hotel-policy-popup/hotel-policy-popup.component");
var HotelDetailComponent = /** @class */ (function () {
    function HotelDetailComponent(route, hotelService, toastr, router, commonFunction, modalService, cartService) {
        this.route = route;
        this.hotelService = hotelService;
        this.toastr = toastr;
        this.router = router;
        this.commonFunction = commonFunction;
        this.modalService = modalService;
        this.cartService = cartService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.hotelRoomArray = [];
        this.imageTemp = [];
        this.loading = false;
        this.roomLoading = false;
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
        this.cartItems = [];
        this.addCartLoading = false;
        this.isNotFound = false;
        this.isCartFull = false;
    }
    HotelDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = true;
        $('body').addClass('cms-bgColor');
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        var occupancies;
        this.galleryOptions = [
            {
                width: '270px',
                height: '100%',
                thumbnails: false,
                imageSwipe: true,
                previewRotate: true,
                preview: false
            }
        ];
        this.galleryOptionsMain = [
            {
                width: '100%',
                height: '400px',
                thumbnails: false,
                imageSwipe: true,
                previewRotate: true,
                preview: false
            }
        ];
        this.route.params.subscribe(function (params) {
            if (params) {
                _this.hotelId = params.id;
                _this.hotelToken = params.token;
            }
        });
        this.cartService.getCartItems.subscribe(function (cartItems) {
            _this.cartItems = cartItems;
        });
        this.hotelService.getHotelDetail("" + this.hotelId, this.hotelToken).subscribe(function (res) {
            _this.loading = false;
            if (res && res.data && res.data.hotel) {
                _this.hotelDetails = {
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
                    res.data.hotel.images.forEach(function (imageUrl) {
                        _this.imageTemp.push({
                            small: "" + imageUrl,
                            medium: "" + imageUrl,
                            big: "" + imageUrl,
                            description: "" + _this.hotelDetails.name
                        });
                        _this.galleryImages = _this.imageTemp;
                    });
                }
                occupancies = collect_js_1.collect(res.data.details.occupancies);
                _this.roomSummary.roomDetail.checkIn = res.data.details.check_in;
                _this.roomSummary.roomDetail.checkOut = res.data.details.check_out;
                if (res.data.details && res.data.details.occupancies && res.data.details.occupancies.length) {
                    _this.roomSummary.roomDetail.totalRoom = occupancies.count();
                    _this.roomSummary.roomDetail.totalAdults = occupancies.sum('adults');
                    _this.roomSummary.roomDetail.totalChildren = occupancies.flatMap(function (value) { return value['children']; }).count();
                }
            }
            else {
                _this.isNotFound = true;
            }
        }, function (error) {
            _this.isNotFound = true;
            _this.loading = false;
        });
        this.roomLoading = true;
        this.hotelService.getRoomDetails("" + this.hotelId, this.hotelToken).subscribe(function (res) {
            _this.roomLoading = false;
            if (res) {
                _this.hotelRoomArray = res.data;
                _this.roomSummary.hotelInfo = res.data[0];
            }
        }, function (error) {
            _this.roomLoading = false;
            //this.toastr.error('Search session is expired', 'Error');
            //this.router.navigate(['/']);
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
