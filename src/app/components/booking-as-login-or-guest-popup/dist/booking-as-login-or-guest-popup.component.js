"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BookingAsLoginOrGuestPopupComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var BookingAsLoginOrGuestPopupComponent = /** @class */ (function () {
    function BookingAsLoginOrGuestPopupComponent(route, router, commonFunction) {
        this.route = route;
        this.router = router;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.userType = 'login';
        this.isShowGuestPopupValueChange = new core_1.EventEmitter();
    }
    BookingAsLoginOrGuestPopupComponent.prototype.ngOnInit = function () {
        this.routeCode = this.route.snapshot.paramMap.get('rc');
    };
    BookingAsLoginOrGuestPopupComponent.prototype.bookingAs = function (type) {
        this.userType = type;
    };
    BookingAsLoginOrGuestPopupComponent.prototype.btnContinue = function (type) {
        if (type == 'login') {
            this.isShowGuestPopupValueChange.emit(false);
            $("#sign_in_modal").modal('show');
        }
        if (type == 'guest') {
            sessionStorage.setItem('__insMode', btoa('no-instalment'));
            if (this.commonFunction.isRefferal()) {
                var parms = this.commonFunction.getRefferalParms();
                var queryParams = {};
                queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
                if (parms.utm_medium) {
                    queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
                }
                if (parms.utm_campaign) {
                    queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
                }
                this.router.navigate(['/flight/travelers', this.routeCode], { queryParams: queryParams });
            }
            else {
                this.router.navigate(['/flight/travelers', this.routeCode]);
            }
        }
    };
    __decorate([
        core_1.Output()
    ], BookingAsLoginOrGuestPopupComponent.prototype, "isShowGuestPopupValueChange");
    BookingAsLoginOrGuestPopupComponent = __decorate([
        core_1.Component({
            selector: 'app-booking-as-login-or-guest-popup',
            templateUrl: './booking-as-login-or-guest-popup.component.html',
            styleUrls: ['./booking-as-login-or-guest-popup.component.scss']
        })
    ], BookingAsLoginOrGuestPopupComponent);
    return BookingAsLoginOrGuestPopupComponent;
}());
exports.BookingAsLoginOrGuestPopupComponent = BookingAsLoginOrGuestPopupComponent;
