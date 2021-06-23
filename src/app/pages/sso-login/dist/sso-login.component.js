"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SsoLoginComponent = void 0;
var core_1 = require("@angular/core");
var jwt_helper_1 = require("../../_helpers/jwt.helper");
var SsoLoginComponent = /** @class */ (function () {
    function SsoLoginComponent(route, router, commonFunction) {
        this.route = route;
        this.router = router;
        this.commonFunction = commonFunction;
        this.token = '';
    }
    SsoLoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.queryParams.forEach(function (params) {
            _this.token = params.sid;
        });
        this.ssonLogin();
    };
    SsoLoginComponent.prototype.ssonLogin = function () {
        if (this.token) {
            var userDetail = jwt_helper_1.getUserDetails(this.token);
            if (userDetail && userDetail.roleId != 7) {
                localStorage.setItem("_lay_sess", this.token);
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
                    this.router.navigate(['/'], { queryParams: queryParams });
                }
                else {
                    this.router.navigate(['/']);
                }
            }
            else {
                jwt_helper_1.redirectToLogin();
            }
        }
    };
    SsoLoginComponent = __decorate([
        core_1.Component({
            selector: 'app-sso-login',
            templateUrl: './sso-login.component.html',
            styleUrls: ['./sso-login.component.scss']
        })
    ], SsoLoginComponent);
    return SsoLoginComponent;
}());
exports.SsoLoginComponent = SsoLoginComponent;
