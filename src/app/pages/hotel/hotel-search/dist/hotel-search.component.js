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
    function HotelSearchComponent(route, hotelService, commonFunction, router, cd, renderer, homeService) {
        this.route = route;
        this.hotelService = hotelService;
        this.commonFunction = commonFunction;
        this.router = router;
        this.cd = cd;
        this.renderer = renderer;
        this.homeService = homeService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.calenderPrices = [];
        this.loading = true;
        this.errorMessage = '';
        this.isNotFound = false;
        this.isResetFilter = 'no';
        this.searchedValue = [];
        this.filteredLabel = 'Price Low to High';
        this.roomsGroup = [
            {
                adults: 2,
                child: [],
                children: []
            }
        ];
        this.filterOpen = false;
        this.sortByOpen = false;
    }
    HotelSearchComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        this.renderer.addClass(document.body, 'cms-bgColor');
        var info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['itenery'])));
        var payload = {
            check_in: this.route.snapshot.queryParams['check_in'],
            check_out: this.route.snapshot.queryParams['check_out'],
            latitude: this.route.snapshot.queryParams['latitude'],
            longitude: this.route.snapshot.queryParams['longitude'],
            city_id: this.route.snapshot.queryParams['city_id'],
            rooms: info.rooms,
            adults: info.adults,
            children: info.child,
            filter: true
        };
        this.getHotelSearchData(payload);
    };
    HotelSearchComponent.prototype.getHotelSearchData = function (payload) {
        var _this = this;
        this.loading = true;
        this.errorMessage = '';
        this.hotelService.getHotelSearchResult(payload).subscribe(function (res) {
            _this.hotelDetails = res.data.hotels;
            _this.hotelService.setHotels(_this.hotelDetails);
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
        this.hotelService.setSortFilter(event);
        var key = event.key, order = event.order;
        if (key === 'total') {
            if (order === 'ASC') {
                this.filteredLabel = 'Price Lowest to Highest';
                this.hotelDetails = this.sortPriceJSON(this.hotelDetails, key, order);
            }
            else if (order === 'DESC') {
                this.filteredLabel = 'Price Highest to Lowest';
                this.hotelDetails = this.sortPriceJSON(this.hotelDetails, key, order);
            }
        }
        else if (key === 'rating') {
            if (order === 'ASC') {
                this.filteredLabel = 'Rating Lowest to Highest';
                this.hotelDetails = this.sortByRatings(this.hotelDetails, key, order);
            }
            else if (order === 'DESC') {
                this.filteredLabel = 'Rating Highest to Lowest';
                this.hotelDetails = this.sortByRatings(this.hotelDetails, key, order);
            }
        }
        else if (key === 'name') {
            if (order === 'ASC') {
                this.filteredLabel = 'Alphabetical A to Z';
                this.hotelDetails = this.sortByHotelName(this.hotelDetails, key, order);
            }
            else if (order === 'DESC') {
                this.filteredLabel = 'Alphabetical Z to A';
                this.hotelDetails = this.sortByHotelName(this.hotelDetails, key, order);
            }
        }
        this.hotelService.setHotels(this.hotelDetails);
    };
    HotelSearchComponent.prototype.sortPriceJSON = function (data, key, way) {
        if (typeof data === "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
                var x = a.secondary_start_price > 0 ? a.secondary_start_price : a.selling[key];
                var y = b.secondary_start_price > 0 ? b.secondary_start_price : b.selling[key];
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                else if (way === 'DESC') {
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
                var x = a[key].toLowerCase();
                var y = b[key].toLowerCase();
                if (way === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (way === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    HotelSearchComponent.prototype.closeModal = function () {
        $('#filter_mob_modal').modal('hide');
    };
    HotelSearchComponent.prototype.filterHotel = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.hotelDetails = event;
            _this.hotelService.setHotels(_this.hotelDetails);
        }, 100);
    };
    HotelSearchComponent.prototype.resetFilter = function () {
        this.isResetFilter = (new Date()).toString();
    };
    HotelSearchComponent.prototype.filterDrawerOpen = function () {
        this.filterOpen = !this.filterOpen;
    };
    HotelSearchComponent.prototype.sortByDrawerOpen = function () {
        this.sortByOpen = !this.sortByOpen;
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
        queryParams.itenery = btoa(encodeURIComponent(JSON.stringify(event.occupancies)));
        queryParams.location = btoa(encodeURIComponent(JSON.stringify(locations)));
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
            _this.router.navigate(["" + urlData.url], { queryParams: queryParams, queryParamsHandling: 'merge' });
        });
    };
    HotelSearchComponent.prototype.moduleTabClick = function (tabName) {
        if (tabName == 'flight') {
            this.homeService.setActiveTab(tabName);
            if (this.commonFunction.isRefferal()) {
                var parms = this.commonFunction.getRefferalParms();
                this.router.navigate(['/'], { queryParams: { utm_source: parms.utm_source, utm_medium: parms.utm_medium } });
            }
            else {
                this.router.navigate(['/']);
            }
        }
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
