"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SortHotelComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var SortHotelComponent = /** @class */ (function () {
    function SortHotelComponent(route) {
        this.route = route;
        this.sortHotel = new core_1.EventEmitter();
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.sortType = 'lh_price';
        this.lowToHighToggle = false;
    }
    SortHotelComponent.prototype.ngOnInit = function () {
        if (this.route.snapshot.queryParams['location']) {
            var info = JSON.parse(decodeURIComponent(atob(this.route.snapshot.queryParams['location'])));
            if (info) {
                this.locationName = info.city;
            }
        }
        //this.sortHotelData('total', 'ASC', 'lh_price');
        this.loadJquery();
    };
    SortHotelComponent.prototype.loadJquery = function () {
        $(".responsive_sort_btn").click(function () {
            $("#responsive_sortby_show").slideDown();
            $("body").addClass('overflow-hidden');
        });
        $(".filter_close > a").click(function () {
            $("#responsive_sortby_show").slideUp();
            $("body").removeClass('overflow-hidden');
        });
        // Start filter Shortby js
        $(document).on('show', '#accordion', function (e) {
            $(e.target).prev('.accordion-heading').addClass('accordion-opened');
        });
        $(document).on('hide', '#accordion', function (e) {
            $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
        });
    };
    SortHotelComponent.prototype.sortHotelData = function (key, order, name) {
        this.sortType = name;
        this.sortHotel.emit({ key: key, order: order });
    };
    SortHotelComponent.prototype.closeModal = function () {
        $('#sort_mob_modal').modal('hide');
    };
    SortHotelComponent.prototype.resetSorting = function (key, order) {
        this.sortType = 'lh_price';
        this.sortHotel.emit({ key: key, order: order });
    };
    /* ngOnChanges(changes: SimpleChanges) {
      if (changes['hotelDetails'].currentValue != 'undefined') {
        if (this.hotelDetails != 'undefined') {
          this.hotelDetails = changes['hotelDetails'].currentValue.hotels;
        }
      }
    } */
    SortHotelComponent.prototype.toggleLowToHigh = function () {
        this.lowToHighToggle = !this.lowToHighToggle;
    };
    __decorate([
        core_1.ViewChild("scrollable", { static: true, read: core_1.ElementRef })
    ], SortHotelComponent.prototype, "scrollbar");
    __decorate([
        core_1.Output()
    ], SortHotelComponent.prototype, "sortHotel");
    __decorate([
        core_1.Input()
    ], SortHotelComponent.prototype, "hotelDetails");
    SortHotelComponent = __decorate([
        core_1.Component({
            selector: 'app-sort-hotel',
            templateUrl: './sort-hotel.component.html',
            styleUrls: ['./sort-hotel.component.scss']
        })
    ], SortHotelComponent);
    return SortHotelComponent;
}());
exports.SortHotelComponent = SortHotelComponent;
