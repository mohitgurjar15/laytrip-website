"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VacationItemWrapperComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var jwt_helper_1 = require("../../../../../app/_helpers/jwt.helper");
var VacationItemWrapperComponent = /** @class */ (function () {
    function VacationItemWrapperComponent(rentalService, router, route, commonFunction) {
        this.rentalService = rentalService;
        this.router = router;
        this.route = route;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
        this.subscriptions = [];
        this.rentalListArray = [];
        this.rentalDetailIdArray = [];
        this.isMapView = false;
        this.markers = [];
        this.zoom = 10;
        this.showHomeDetails = [];
        this.showFareDetails = 0;
        this.amenitiesObject = {
            ac: this.s3BucketUrl + "assets/images/hotels/ac.svg",
            wifi: this.s3BucketUrl + "assets/images/hotels/wifi.svg",
            coffe_tea: this.s3BucketUrl + "assets/images/hotels/breakfast.svg",
            no_smoking: this.s3BucketUrl + "assets/images/hotels/no_smoking.svg",
            tv: this.s3BucketUrl + "assets/images/hotels/tv.svg"
        };
        this.showMapDetails = [];
    }
    VacationItemWrapperComponent.prototype.ngOnInit = function () {
        var _currency = localStorage.getItem('_curr');
        this.currency = JSON.parse(_currency);
        this.rentalListArray = this.rentalDetails;
        console.log(this.rentalListArray);
        this.userInfo = jwt_helper_1.getLoginUserInfo();
    };
    VacationItemWrapperComponent.prototype.ngAfterContentChecked = function () {
        this.rentalListArray = this.rentalDetails;
    };
    VacationItemWrapperComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    VacationItemWrapperComponent.prototype.changeView = function (view) {
        if (view === 'listView') {
            this.isMapView = false;
        }
        else {
            this.isMapView = true;
        }
    };
    // onMouseOver(infoWindow, gm) {
    //   if (gm.lastOpen != null) {
    //     gm.lastOpen.close();
    //   }
    //   gm.lastOpen = infoWindow;
    //   infoWindow.open();
    // }
    // onMouseOut(infoWindow, gm) {
    //   infoWindow.close();
    // }
    VacationItemWrapperComponent.prototype.infoWindowAction = function (template, event, action) {
        if (action === 'open') {
            template.open();
        }
        else if (action === 'close') {
            template.close();
        }
        else if (action === 'click') {
            this.showMapInfo(template);
        }
    };
    VacationItemWrapperComponent.prototype.showMapInfo = function (index) {
        if (typeof this.showMapDetails[index] === 'undefined') {
            this.showMapDetails[index] = true;
            document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else {
            this.showMapDetails[index] = !this.showMapDetails[index];
            document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
    VacationItemWrapperComponent.prototype.showDetails = function (index, flag) {
        var _this = this;
        if (flag === void 0) { flag = null; }
        if (typeof this.showHomeDetails[index] === 'undefined') {
            this.showHomeDetails[index] = true;
        }
        else {
            this.showHomeDetails[index] = !this.showHomeDetails[index];
        }
        if (flag == 'true') {
            this.showFareDetails = 1;
        }
        else {
            this.showFareDetails = 0;
        }
        this.showHomeDetails = this.showHomeDetails.map(function (item, i) {
            return ((index === i) && _this.showHomeDetails[index] === true) ? true : false;
        });
    };
    VacationItemWrapperComponent.prototype.closeHomeDetail = function () {
        this.showFareDetails = 0;
        this.showHomeDetails = this.showHomeDetails.map(function (item) {
            return false;
        });
    };
    VacationItemWrapperComponent.prototype.redirectToDetail = function (id, lat, long) {
        this.router.navigate(['/vacation-rental/detail', id], { queryParams: { lat: lat, long: long } });
    };
    __decorate([
        core_1.Input()
    ], VacationItemWrapperComponent.prototype, "rentalDetails");
    VacationItemWrapperComponent = __decorate([
        core_1.Component({
            selector: 'app-vacation-item-wrapper',
            templateUrl: './vacation-item-wrapper.component.html',
            styleUrls: ['./vacation-item-wrapper.component.scss']
        })
    ], VacationItemWrapperComponent);
    return VacationItemWrapperComponent;
}());
exports.VacationItemWrapperComponent = VacationItemWrapperComponent;
