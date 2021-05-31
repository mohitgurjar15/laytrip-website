"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DealComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
// import Swiper core and required components
var core_2 = require("swiper/core");
// install Swiper components
core_2["default"].use([
    core_2.Navigation,
    core_2.Pagination,
    core_2.Scrollbar,
    core_2.A11y,
    core_2.Virtual,
    core_2.Zoom,
    core_2.Autoplay,
    core_2.Thumbs,
    core_2.Controller
]);
var DealComponent = /** @class */ (function () {
    function DealComponent(homeService, commonFunction) {
        this.homeService = homeService;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.toString = new core_1.EventEmitter();
        this.dealList = [];
        this.list = [];
        this.list2 = [];
        this.breakpoints = {
            320: { slidesPerView: 1, spaceBetween: 10, slidesPerGroup: 9 },
            520: { slidesPerView: 2, spaceBetween: 10, slidesPerGroup: 5 },
            768: { slidesPerView: 3, spaceBetween: 40, slidesPerGroup: 3 },
            1024: { slidesPerView: 3, spaceBetween: 40, slidesPerGroup: 3 }
        };
        this.slidesPerGroup = 3;
    }
    DealComponent.prototype.ngOnInit = function () {
    };
    DealComponent.prototype.ngAfterContentChecked = function () {
        this.list = this.dealList;
    };
    DealComponent.prototype.btnDealClick = function (item) {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        this.toString.emit(item.title ? item : item.code);
    };
    DealComponent.prototype.setThumbsSwiper = function (swiper) {
        this.thumbsSwiper = swiper;
    };
    DealComponent.prototype.breakpointChange = function () {
        this.breakPointsToggle = !this.breakPointsToggle;
        this.breakpoints = {
            320: { slidesPerView: 1, spaceBetween: 10, slidesPerGroup: 9 },
            520: { slidesPerView: 2, spaceBetween: 10, slidesPerGroup: 5 },
            768: { slidesPerView: 3, spaceBetween: 40, slidesPerGroup: 3 },
            1024: { slidesPerView: this.breakPointsToggle ? 3 : 5, spaceBetween: 40, slidesPerGroup: 3 }
        };
    };
    __decorate([
        core_1.Output()
    ], DealComponent.prototype, "toString");
    __decorate([
        core_1.Input()
    ], DealComponent.prototype, "dealList");
    __decorate([
        core_1.HostListener('contextmenu', ['$event'])
    ], DealComponent.prototype, "list");
    DealComponent = __decorate([
        core_1.Component({
            selector: 'app-deal',
            templateUrl: './deal.component.html',
            styleUrls: ['./deal.component.scss']
        })
    ], DealComponent);
    return DealComponent;
}());
exports.DealComponent = DealComponent;
