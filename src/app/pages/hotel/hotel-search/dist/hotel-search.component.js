"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HotelSearchComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var moment = require("moment");
var HotelSearchComponent = /** @class */ (function () {
    function HotelSearchComponent(route, hotelService, commonFunction, router, cd, renderer) {
        this.route = route;
        this.hotelService = hotelService;
        this.commonFunction = commonFunction;
        this.router = router;
        this.cd = cd;
        this.renderer = renderer;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.calenderPrices = [];
        this.loading = true;
        this.errorMessage = '';
        this.isNotFound = false;
        this.isResetFilter = 'no';
        this.searchedValue = [];
        this.roomsGroup = [
            {
                adults: 2,
                child: [],
                children: []
            }
        ];
    }
    HotelSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scroll(0, 0);
        this.renderer.addClass(document.body, 'cms-bgColor');
        // if (document.getElementById('login_btn')) {
        //   setTimeout(() => {
        //     document.getElementById('login_btn').style.background = '#FF00BC';
        //   }, 1000);
        // }
        var payload = {};
        var info;
        this.route.queryParams.forEach(function (params) {
            info = JSON.parse(atob(_this.route.snapshot.queryParams['itenery']));
            payload = {
                check_in: params.check_in,
                check_out: params.check_out,
                latitude: params.latitude,
                longitude: params.longitude,
                occupancies: [],
                filter: true
            };
            info.forEach(function (item) {
                payload.occupancies.push({ adults: item.adults, children: item.children });
            });
            _this.getHotelSearchData(payload);
        });
    };
    // ngAfterViewInit() {
    //   $("#search_large_btn1, #search_large_btn2, #search_large_btn3").hover(
    //     function () {
    //       $('.norm_btn').toggleClass("d-none");
    //       $('.hover_btn').toggleClass("show");
    //     }
    //   );
    // }
    HotelSearchComponent.prototype.getHotelSearchData = function (payload) {
        var _this = this;
        this.loading = true;
        this.errorMessage = '';
        this.hotelService.getHotelSearchResult(payload).subscribe(function (res) {
            _this.hotelDetails = res.data.hotels;
            _this.hotelDetailsMain = res.data;
            _this.hotelToken = res.data.details.token;
            _this.loading = false;
            _this.isNotFound = false;
        }, function (err) {
            if (err && err.status === 404) {
                _this.errorMessage = err.message;
            }
            else {
                _this.isNotFound = true;
            }
            _this.loading = false;
        });
    };
    HotelSearchComponent.prototype.sortHotels = function (event) {
        var key = event.key, order = event.order;
        if (key === 'total') {
            this.hotelDetails = this.sortJSON(this.hotelDetails, key, order);
        }
        else if (key === 'rating') {
            this.hotelDetails = this.sortByRatings(this.hotelDetails, key, order);
        }
        else if (key === 'name') {
            this.hotelDetails = this.sortByHotelName(this.hotelDetails, key, order);
        }
    };
    HotelSearchComponent.prototype.sortJSON = function (data, key, way) {
        if (typeof data === "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
                var x = a.selling[key];
                var y = b.selling[key];
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    HotelSearchComponent.prototype.sortByRatings = function (data, key, way) {
        if (typeof data === "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    HotelSearchComponent.prototype.sortByHotelName = function (data, key, way) {
        if (typeof data === "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    HotelSearchComponent.prototype.filterHotel = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.hotelDetails = event;
        }, 100);
    };
    HotelSearchComponent.prototype.resetFilter = function () {
        this.isResetFilter = (new Date()).toString();
    };
    HotelSearchComponent.prototype.getHotelSearchDataByModify = function (event) {
        var _this = this;
        var urlData = this.commonFunction.decodeUrl(this.router.url);
        var locations = { city: event.city, country: event.country };
        var queryParams = {};
        queryParams.check_in = moment(event.check_in).format('YYYY-MM-DD');
        queryParams.check_out = moment(event.check_out).format('YYYY-MM-DD');
        queryParams.latitude = parseFloat(event.latitude);
        queryParams.longitude = parseFloat(event.longitude);
        queryParams.itenery = btoa(JSON.stringify(event.occupancies));
        queryParams.location = btoa(JSON.stringify(locations));
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
            _this.router.navigate(["" + urlData.url], { queryParams: queryParams, queryParamsHandling: 'merge' });
        });
    };
    HotelSearchComponent = __decorate([
        core_1.Component({
            selector: 'app-hotel-search',
            templateUrl: './hotel-search.component.html',
            styleUrls: ['./hotel-search.component.scss']
        })
    ], HotelSearchComponent);
    return HotelSearchComponent;
}());
exports.HotelSearchComponent = HotelSearchComponent;
