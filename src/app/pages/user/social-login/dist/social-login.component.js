"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SocialLoginComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../environments/environment");
var SocialLoginComponent = /** @class */ (function () {
    function SocialLoginComponent(userService, router, modalService, location) {
        this.userService = userService;
        this.router = router;
        this.modalService = modalService;
        this.location = location;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.apiError = '';
        this.test = false;
    }
    SocialLoginComponent.prototype.ngOnInit = function () {
        this.loadGoogleSdk();
        this.loadFacebookSdk();
    };
    SocialLoginComponent.prototype.loadGoogleSdk = function () {
        var _this = this;
        window['googleSDKLoaded'] = function () {
            window['gapi'].load('auth2', function () {
                _this.auth2 = window['gapi'].auth2.init({
                    client_id: environment_1.environment.google_client_id,
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile email'
                });
                _this.googleLogin();
            });
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));
    };
    SocialLoginComponent.prototype.googleLogin = function () {
        var _this = this;
        this.auth2.attachClickHandler(this.loginElement.nativeElement, {}, function (googleUser) {
            var profile = googleUser.getBasicProfile();
            //YOUR CODE HERE
            var json_data = {
                "account_type": 1,
                "name": profile.getName(),
                "email": profile.getEmail(),
                "social_account_id": profile.getId(),
                "device_type": 1,
                "device_model": "RNE-L22",
                "device_token": "123abc#$%456",
                "app_version": "1.0",
                "os_version": "7.0"
            };
            _this.userService.socialLogin(json_data).subscribe(function (data) {
                if (data.user_details) {
                    localStorage.setItem("_lay_sess", data.user_details.access_token);
                    $('#sign_in_modal').modal('hide');
                    _this.router.url;
                    document.getElementById('navbarNav').click();
                }
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    };
    SocialLoginComponent.prototype.ngOnDestroy = function () { };
    SocialLoginComponent.prototype.loadFacebookSdk = function () {
        window.fbAsyncInit = function () {
            window['FB'].init({
                appId: environment_1.environment.fb_api_key,
                cookie: true,
                xfbml: true,
                version: 'v3.1',
                proxy: true,
                callbackURL: "/auth/facebook/callback"
            });
            window['FB'].AppEvents.logPageView();
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };
    SocialLoginComponent.prototype.fbLogin = function () {
        var _this = this;
        window['FB'].login(function (response) {
            if (response.authResponse) {
                window['FB'].api('/me', {
                    fields: 'last_name, first_name, email'
                }, function (userInfo) {
                    console.log(userInfo);
                    var json_data = {
                        "account_type": 1,
                        "name": userInfo.first_name + ' ' + userInfo.last_name,
                        "email": userInfo.email ? userInfo.email : '',
                        "social_account_id": userInfo.id,
                        "device_type": 1,
                        "device_model": "Angular web",
                        "device_token": "123abc#$%456",
                        "app_version": "1.0",
                        "os_version": "7.0"
                    };
                    _this.userService.socialLogin(json_data).subscribe(function (data) {
                        if (data.user_details) {
                            localStorage.setItem("_lay_sess", data.user_details.access_token);
                            $('#sign_in_modal').modal('hide');
                            _this.test = true;
                            document.getElementById('navbarNav').click();
                            _this.router.url;
                        }
                    }, function (error) {
                        console.log(error);
                    });
                });
            }
            else {
                _this.apiError = 'User login failed';
                console.log('User login failed');
            }
        }, { scope: 'email' });
    };
    SocialLoginComponent.prototype.ngDoCheck = function () { };
    __decorate([
        core_1.ViewChild('loginRef')
    ], SocialLoginComponent.prototype, "loginElement");
    SocialLoginComponent = __decorate([
        core_1.Component({
            selector: 'app-social-login',
            templateUrl: './social-login.component.html',
            styleUrls: ['./social-login.component.scss']
        })
    ], SocialLoginComponent);
    return SocialLoginComponent;
}());
exports.SocialLoginComponent = SocialLoginComponent;
