"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MyAccountsNavComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var jwt_helper_1 = require("../../../../_helpers/jwt.helper");
var MyAccountsNavComponent = /** @class */ (function () {
    function MyAccountsNavComponent(router, commonFunction) {
        this.router = router;
        this.commonFunction = commonFunction;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.profile_pic = '';
        this._login_user_info = [];
        this.isLoggedIn = false;
        this.defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
    }
    MyAccountsNavComponent.prototype.ngOnInit = function () {
    };
    MyAccountsNavComponent.prototype.ngDoCheck = function () {
        this._login_user_info = jwt_helper_1.getUserDetails(localStorage.getItem("_lay_sess"));
        this.profile_pic = this._login_user_info.profilePic;
        this.checkUser();
    };
    MyAccountsNavComponent.prototype.checkUser = function () {
        var userToken = localStorage.getItem('_lay_sess');
        if (userToken && userToken != 'undefined') {
            this.isLoggedIn = true;
        }
    };
    MyAccountsNavComponent.prototype.ngOnDestroy = function () { };
    MyAccountsNavComponent.prototype.onLoggedout = function () {
        this.isLoggedIn = false;
        localStorage.removeItem('_lay_sess');
        this.router.navigate(['/']);
    };
    MyAccountsNavComponent = __decorate([
        core_1.Component({
            selector: 'app-my-accounts-nav',
            templateUrl: './my-accounts-nav.component.html',
            styleUrls: ['./my-accounts-nav.component.scss']
        })
    ], MyAccountsNavComponent);
    return MyAccountsNavComponent;
}());
exports.MyAccountsNavComponent = MyAccountsNavComponent;
