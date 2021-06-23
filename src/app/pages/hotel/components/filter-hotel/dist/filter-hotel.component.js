"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FilterHotelComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var forms_1 = require("@angular/forms");
var FilterHotelComponent = /** @class */ (function () {
    function FilterHotelComponent(eRef, hotelService, hotelSearchComp) {
        var _this = this;
        this.eRef = eRef;
        this.hotelService = hotelService;
        this.hotelSearchComp = hotelSearchComp;
        this.compact = false;
        this.invertX = false;
        this.invertY = false;
        this.isHotelSearch = false;
        this.shown = 'native';
        this.searchHotel = '';
        this.filterHotel = new core_1.EventEmitter();
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.priceSlider = new forms_1.FormGroup({
            price: new forms_1.FormControl([20, 80])
        });
        this.partialPriceSlider = new forms_1.FormGroup({
            partial_price: new forms_1.FormControl([20, 80])
        });
        this.rating_number = 0;
        this.airLines = [];
        /* End of filter variable */
        // tslint:disable-next-line: variable-name
        this._currency = localStorage.getItem('_curr');
        this.priceValue = 0;
        this.priceHighValue = 0;
        this.priceOptions = {
            floor: 0,
            ceil: 0,
            step: 1,
            translate: function (value) {
                var currency = JSON.parse(_this._currency);
                return "" + currency.symbol + value;
            }
        };
        this.partialPaymentValue = 0;
        this.partialPaymentHighValue = 0;
        this.partialPaymentOptions = {
            floor: 0,
            ceil: 0,
            step: 1,
            translate: function (value) {
                var currency = JSON.parse(_this._currency);
                return "" + currency.symbol + value;
            }
        };
        this.subscriptions = [];
        this.ratingStar = [];
        this.amenities = [];
        this.ratingArray = [];
        this.amenitiesArray = [];
        this.policyArray = [];
        this.hotelNamesArray = [];
        this.filterHotelNames = [];
        this.sortType = 'filter_total_price';
        this.lowToHighToggleRating = false;
        this.lowToHighToggleAmenities = false;
        this.is_open = false;
    }
    FilterHotelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currency = JSON.parse(this._currency);
        if (this.hotelDetailsMain) {
            this.hotelDetailsMain.hotels.forEach(function (i) {
                _this.hotelNamesArray.push({ hotelName: i.name });
            });
            if (this.hotelDetailsMain.filter_objects) {
                // FOR FILTER HOTEL - PRICE
                this.priceValue = this.hotelDetailsMain.filter_objects.price.min ? this.hotelDetailsMain.filter_objects.price.min : 0;
                this.priceHighValue = this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;
                this.priceSlider.controls.price.setValue([Math.floor(this.priceValue), Math.ceil(this.priceHighValue)]);
                this.partialPaymentValue = this.hotelDetailsMain.filter_objects.secondary_price.min ? this.hotelDetailsMain.filter_objects.secondary_price.min : 0;
                this.partialPaymentHighValue = this.hotelDetailsMain.filter_objects.secondary_price.max ? this.hotelDetailsMain.filter_objects.secondary_price.max : 0;
                this.minPrice = this.priceValue;
                this.maxPrice = this.priceHighValue;
                this.priceOptions.floor = this.hotelDetailsMain.filter_objects.price.min ? this.hotelDetailsMain.filter_objects.price.min : 0;
                this.priceOptions.ceil = this.priceHighValue; //this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;
                if (this.hotelDetailsMain.filter_objects && this.hotelDetailsMain.filter_objects.secondary_price && this.hotelDetailsMain.filter_objects.secondary_price.min && this.hotelDetailsMain.filter_objects.secondary_price.max) {
                    // this.priceValue = this.hotelDetailsMain.filter_objects.secondary_price.min ? this.hotelDetailsMain.filter_objects.secondary_price.min : 0;
                    // this.priceHighValue = this.hotelDetailsMain.filter_objects.secondary_price.max ? this.hotelDetailsMain.filter_objects.secondary_price.max : 0;
                    // this.priceSlider.controls.price.setValue([Math.floor(this.priceValue), Math.ceil(this.priceHighValue)]);
                    // this.priceOptions.floor = this.hotelDetailsMain.filter_objects.price.min ? this.hotelDetailsMain.filter_objects.price.min : 0;
                    // this.priceOptions.ceil = this.priceHighValue;//this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;
                    this.partialPriceSlider.controls.partial_price.setValue([Math.floor(this.partialPaymentValue), Math.ceil(this.partialPaymentHighValue)]);
                    this.partialPaymentOptions.floor = this.hotelDetailsMain.filter_objects.secondary_price.min ? this.hotelDetailsMain.filter_objects.secondary_price.min : 0;
                    this.partialPaymentOptions.ceil = this.hotelDetailsMain.filter_objects.secondary_price.max; //this.hotelDetailsMain.filter_objects.price.max ? this.hotelDetailsMain.filter_objects.price.max : 0;
                }
                this.amenities = this.hotelDetailsMain.filter_objects.ameneties;
                this.ratingStar = this.hotelDetailsMain.filter_objects.ratings;
            }
        }
        this.loadJquery();
    };
    FilterHotelComponent.prototype.closeModal = function () {
        $('#filter_mob_modal').modal('hide');
    };
    FilterHotelComponent.prototype.clearHotelSearch = function () {
        this.isHotelSearch = false;
        this.hotelname = 'Search';
        $('.searchHotelName').val('');
        this.filterHotel.emit(this.hotelDetailsMain.hotels);
    };
    FilterHotelComponent.prototype.clickHotelFilterName = function (event) {
        this.isHotelSearch = false;
        $('.searchHotelName').val(event.target.textContent);
        this.searchHotel = event.target.textContent ? event.target.textContent : '';
        if (event.target.textContent) {
            this.filterHotels({ key: 'searchByHotelName', value: this.searchHotel });
        }
    };
    FilterHotelComponent.prototype.onBlurMethod = function (event) {
        // $('.searchHotelName').val(event.target.value);
        // this.searchHotel = event.target.textContent ? event.target.textContent : '';
        // if (event.target.value) 
        // this.filterHotels({ key: 'searchByHotelName', value:this.searchHotel})
        // this.isHotelSearch = false;
    };
    FilterHotelComponent.prototype.counter = function (i) {
        return new Array(i);
    };
    FilterHotelComponent.prototype.toggleFilter = function () {
        this.is_open = !this.is_open;
    };
    FilterHotelComponent.prototype.loadJquery = function () {
        //Start REsponsive Fliter js
        /* $(".responsive_filter_btn").click(function () {
          $("#responsive_filter_show").slideDown();
          $("body").addClass('overflow-hidden');
        });
    
        $(".filter_close > a").click(function () {
          $("#responsive_filter_show").slideUp();
          $("body").removeClass('overflow-hidden');
        }); */
        //Close REsponsive Fliter js
        // Start filter Shortby js
        $(document).on('show', '#accordion3', function (e) {
            $(e.target).prev('.accordion-heading').addClass('accordion-opened');
        });
        $(document).on('hide', '#accordion3', function (e) {
            $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
        });
    };
    /**
     * Filter by price range
     * @param event
     */
    FilterHotelComponent.prototype.fliterByPrice = function (event) {
        this.minPrice = event.value;
        this.maxPrice = event.highValue;
        this.filterHotels({});
    };
    FilterHotelComponent.prototype.fliterByPartialPayment = function (event) {
        this.minPartialPaymentPrice = event.value;
        this.maxPartialPaymentPrice = event.highValue;
        this.filterHotels({});
    };
    /**
     * Filter by hotel ratings
     * @param event
     */
    FilterHotelComponent.prototype.filterByHotelRatings = function (event, count) {
        this.ratingArray = [];
        if (event.target.checked === true) {
            this.rating_number = parseInt(count);
            this.ratingArray.push(parseInt(count));
        }
        else {
            this.ratingArray = this.ratingArray.filter(function (item) {
                return item != count;
            });
        }
        this.filterHotels({});
    };
    FilterHotelComponent.prototype.starRating = function (rating) {
        this.ratingArray = [];
        if (this.rating_number == rating) {
            this.rating_number = 0;
            this.ratingArray = this.ratingArray.filter(function (item) {
                return item != rating;
            });
        }
        else {
            this.rating_number = parseInt(rating);
            this.ratingArray.push(parseInt(rating));
        }
        this.filterHotels({});
    };
    /**
    * Filter by hotel amenities
    * @param event
    */
    FilterHotelComponent.prototype.filterByHotelAmenities = function (event, value) {
        if (event.target.checked === true) {
            this.amenitiesArray.push(value);
        }
        else {
            this.amenitiesArray = this.amenitiesArray.filter(function (item) {
                return item !== value;
            });
        }
        this.filterHotels({});
    };
    /**
    * Filter by hotel policy
    * @param event
    */
    FilterHotelComponent.prototype.filterByPolicy = function (event) {
        if (event.target.checked === true) {
            this.policyArray.push(event.target.value);
        }
        else {
            this.policyArray = this.policyArray.filter(function (item) {
                return item !== event.target.value;
            });
        }
        this.filterHotels({});
    };
    /**
     * Filter by price total or weekly
     * @param event
     */
    FilterHotelComponent.prototype.filterHotelByPrice = function (key, name) {
        if (key === 'total') {
            this.sortType = name;
        }
        else if (key === 'weekly') {
            this.sortType = name;
        }
        this.filterHotels({});
    };
    /**
    * Common function to process filtration of hotel
    */
    FilterHotelComponent.prototype.filterHotels = function (hotelname) {
        var _this = this;
        var filteredHotels = this.hotelDetailsMain.hotels;
        /* Filter hotel, based on min & max price */
        if (this.minPrice && this.maxPrice) {
            filteredHotels = filteredHotels.filter(function (item) {
                return item.selling.total >= _this.minPrice && item.selling.total <= _this.maxPrice;
            });
        }
        /* Filter hotel, based on min & max price Payment Price*/
        if (this.minPartialPaymentPrice && this.maxPartialPaymentPrice) {
            filteredHotels = filteredHotels.filter(function (item) {
                return item.secondary_start_price >= _this.minPartialPaymentPrice && item.secondary_start_price <= _this.maxPartialPaymentPrice;
            });
        }
        /* Filter hotels ratings */
        if (this.ratingArray.length) {
            filteredHotels = filteredHotels.filter(function (item) {
                return _this.ratingArray.includes(item.rating);
            });
        }
        /* Filter hotels amenities */
        if (this.amenitiesArray.length) {
            filteredHotels = filteredHotels.filter(function (item) {
                return _this.amenitiesArray.every(function (r) { return item.amenities.list.includes(r); });
            });
        }
        /* Filter hotels policy */
        if (this.policyArray.length) {
            filteredHotels = filteredHotels.filter(function (item) {
                return _this.policyArray.includes(item.refundable);
            });
        }
        /* Search hotels by name */
        if (hotelname && hotelname.key === 'searchByHotelName') {
            filteredHotels = filteredHotels.filter(function (item) {
                return item.name.toLowerCase().toString() == hotelname.value.trim().toLowerCase().toString();
            });
        }
        /* Filter by price total or weekly */
        if (this.sortType === 'total') {
            filteredHotels = filteredHotels.filter(function (item) {
                if (item.secondary_start_price === 0) {
                    return item.secondary_start_price === 0;
                }
            });
        }
        else if (this.sortType === 'weekly') {
            filteredHotels = filteredHotels.filter(function (item) {
                if (item.secondary_start_price > 0) {
                    return item.name === hotelname.value;
                }
            });
        }
        this.hotelService.getSortFilter.subscribe(function (hotelInfo) {
            if (typeof hotelInfo != 'undefined' && Object.keys(hotelInfo).length > 0) {
                var sortFilter = hotelInfo;
                if (sortFilter.key == 'rating') {
                    filteredHotels = _this.ratingSortFilter(filteredHotels, sortFilter.key, sortFilter.order);
                }
                else if (sortFilter.key == 'name') {
                    filteredHotels = _this.sortByHotelName(filteredHotels, sortFilter.key, sortFilter.order);
                }
                else if (sortFilter.key == 'total') {
                    filteredHotels = _this.sortPriceJSON(filteredHotels, sortFilter.key, sortFilter.order);
                }
            }
        });
        this.filterHotel.emit(filteredHotels);
    };
    FilterHotelComponent.prototype.resetFilter = function () {
        this.isResetFilter = (new Date()).toString();
        this.minPrice = this.hotelDetailsMain.filter_objects.price.min;
        this.maxPrice = this.hotelDetailsMain.filter_objects.price.max;
        this.minPartialPaymentPrice = this.hotelDetailsMain.filter_objects.secondary_price.min;
        this.maxPartialPaymentPrice = this.hotelDetailsMain.filter_objects.secondary_price.max;
        // Reset Price
        this.priceSlider.reset({ price: [Math.floor(this.hotelDetailsMain.filter_objects.price.min), Math.ceil(this.hotelDetailsMain.filter_objects.price.max)] });
        this.partialPriceSlider.reset({ partial_price: [Math.floor(this.minPartialPaymentPrice), Math.ceil(this.maxPartialPaymentPrice)] });
        // Reset price by total or weekly
        this.sortType = 'filter_total_price';
        // Reset ratings
        if (this.ratingArray && this.ratingArray.length) {
            this.ratingArray = [];
            this.filterHotels({});
        }
        // Reset amenities
        if (this.amenitiesArray && this.amenitiesArray.length) {
            this.amenitiesArray = [];
            this.filterHotels({});
        }
        // Reset policy
        if (this.policyArray && this.policyArray.length) {
            this.policyArray = [];
            this.filterHotels({});
        }
        // Reset hotel name search
        this.hotelname = 'Search';
        this.filterHotels({});
        $('.searchHotelName').val('');
        $("input:checkbox").prop('checked', false);
    };
    // ngOnChanges(changes: SimpleChanges) {
    //   if (changes['isResetFilter']) {
    //     this.isResetFilter = changes['isResetFilter'].currentValue;
    //     this.minPrice = this.hotelDetailsMain.filter_objects.price.min;
    //     this.maxPrice = this.hotelDetailsMain.filter_objects.price.max;
    //     // Reset Price
    //     this.priceSlider.reset({ price: [Math.floor(this.hotelDetailsMain.filter_objects.price.min), Math.ceil(this.hotelDetailsMain.filter_objects.price.max)] });
    //     // Reset price by total or weekly
    //     this.sortType = 'filter_total_price';
    //     // Reset ratings
    //     if (this.ratingArray && this.ratingArray.length) {
    //       this.ratingArray = [];
    //       this.filterHotels({});
    //     }
    //     // Reset amenities
    //     if (this.amenitiesArray && this.amenitiesArray.length) {
    //       this.amenitiesArray = [];
    //       this.filterHotels({});
    //     }
    //     // Reset policy
    //     if (this.policyArray && this.policyArray.length) {
    //       this.policyArray = [];
    //       this.filterHotels({});
    //     }
    //     // Reset hotel name search
    //     this.hotelname = 'Search Hotel';
    //     $("input:checkbox").prop('checked', false);
    //   }
    // }
    FilterHotelComponent.prototype.toggleLowToHighRating = function () {
        this.lowToHighToggleRating = !this.lowToHighToggleRating;
    };
    FilterHotelComponent.prototype.toggleLowToHighAmenities = function () {
        this.lowToHighToggleAmenities = !this.lowToHighToggleAmenities;
    };
    FilterHotelComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    FilterHotelComponent.prototype.searchHotelName = function (searchValue) {
        this.isHotelSearch = true;
        var result = [];
        for (var i = 0; i < this.hotelNamesArray.length; i++) {
            if (this.hotelNamesArray[i].hotelName.toLowerCase().toString().includes(searchValue.target.value.toLowerCase())) {
                result.push(this.hotelNamesArray[i]);
            }
        }
        if (this.hotelNamesArray.length > 0 && searchValue.target.value.length > 0) {
            this.filterHotelNames = result.length > 0 ? result : [{ hotelName: 'No result!' }];
            return this.filterHotelNames;
        }
        else {
            if (searchValue.target.value.length <= 0) {
                this.isHotelSearch = false;
                this.hotelname = 'Search';
                this.filterHotel.emit(this.hotelDetailsMain.hotels);
                this.filterHotels({});
            }
            else {
                return this.filterHotelNames = [{ hotelName: 'No result!' }];
            }
        }
    };
    FilterHotelComponent.prototype.ratingSortFilter = function (filteredHotels, key, order) {
        return filteredHotels.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            if (order === 'ASC') {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }
            if (order === 'DESC') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
    };
    FilterHotelComponent.prototype.sortByHotelName = function (data, key, order) {
        if (typeof data === "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
                var x = a.name.toLowerCase();
                var y = b.name.toLowerCase();
                if (order === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                if (order === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    FilterHotelComponent.prototype.sortPriceJSON = function (data, key, order) {
        if (typeof data === "undefined") {
            return data;
        }
        else {
            return data.sort(function (a, b) {
                var x = a.secondary_start_price > 0 ? a.secondary_start_price : a.selling[key];
                var y = b.secondary_start_price > 0 ? b.secondary_start_price : b.selling[key];
                if (order === 'ASC') {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
                else if (order === 'DESC') {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }
    };
    __decorate([
        core_1.ViewChild("scrollable", { static: true, read: core_1.ElementRef })
    ], FilterHotelComponent.prototype, "scrollbar");
    __decorate([
        core_1.Input()
    ], FilterHotelComponent.prototype, "hotelDetailsMain");
    __decorate([
        core_1.Input()
    ], FilterHotelComponent.prototype, "isResetFilter");
    __decorate([
        core_1.Output()
    ], FilterHotelComponent.prototype, "filterHotel");
    FilterHotelComponent = __decorate([
        core_1.Component({
            selector: 'app-filter-hotel',
            templateUrl: './filter-hotel.component.html',
            styleUrls: ['./filter-hotel.component.scss']
        })
    ], FilterHotelComponent);
    return FilterHotelComponent;
}());
exports.FilterHotelComponent = FilterHotelComponent;
