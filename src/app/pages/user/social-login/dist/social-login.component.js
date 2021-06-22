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
var apple_provider_1 = require("./apple.provider");
var jwt_helper_1 = require("../../../_helpers/jwt.helper");
var SocialLoginComponent = /** @class */ (function () {
    function SocialLoginComponent(userService, router, modalService, location, authService, commonFunction, route) {
        this.userService = userService;
        this.router = router;
        this.modalService = modalService;
        this.location = location;
        this.authService = authService;
        this.commonFunction = commonFunction;
        this.route = route;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.socialError = new core_1.EventEmitter();
        this.apiError = '';
        this.test = false;
        this.loading = false;
        this.google_loading = false;
        this.apple_loading = false;
        this.guestUserId = '';
    }
    SocialLoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.queryParams.subscribe(function (queryParams) {
            if (typeof queryParams['utm_source'] != 'undefined' && queryParams['utm_source']) {
                localStorage.setItem("referral_id", _this.route.snapshot.queryParams['utm_source']);
            }
            else {
                localStorage.removeItem("referral_id");
            }
            // do something with the query params
        });
        this.loadGoogleSdk();
        this.guestUserId = localStorage.getItem('__gst') || '';
        this.loadFacebookSdk();
        // APPLE LOGIN RESPONSE 
        this.authService.authState.subscribe(function (userInfo) {
            if (userInfo) {
                var objApple = jwt_helper_1.getUserDetails(userInfo.authorization.id_token);
                console.log(objApple, userInfo);
                var jsonData = {
                    "account_type": 3,
                    "name": "",
                    "email": objApple.email,
                    "social_account_id": userInfo.authorization.code,
                    "device_type": 1,
                    "device_model": "RNE-L22",
                    "device_token": "123abc#$%456",
                    "app_version": "1.0",
                    "os_version": "7.0"
                };
                if (_this.route.snapshot.queryParams['utm_source']) {
                    jsonData.referral_id = _this.route.snapshot.queryParams['utm_source'] ? _this.route.snapshot.queryParams['utm_source'] : '';
                }
                _this.userService.socialLogin(jsonData).subscribe(function (data) {
                    if (data.user_details) {
                        localStorage.setItem("_lay_sess", data.user_details.access_token);
                        $('#sign_in_modal').modal('hide');
                        document.getElementById('navbarNav').click();
                        _this.router.url;
                        if (_this.guestUserId) {
                            _this.userService.mapGuestUser(_this.guestUserId).subscribe(function (res) {
                                localStorage.setItem('$cartOver', res.cartOverLimit);
                                var urlData = _this.commonFunction.decodeUrl(_this.router.url);
                                _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                                    _this.router.navigate(["" + urlData.url], { queryParams: urlData.params });
                                });
                            });
                        }
                        else {
                            var urlData_1 = _this.commonFunction.decodeUrl(_this.router.url);
                            _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                                _this.router.navigate(["" + urlData_1.url], { queryParams: urlData_1.params });
                            });
                        }
                    }
                }, function (error) {
                    _this.socialError.emit(error.message);
                    // this.toastr.error(error.message, 'SignIn Error');
                });
            }
        });
    };
    SocialLoginComponent.prototype.googleLogin = function (element) {
        var _this = this;
        // GOOGLE LOGIN
        this.auth2.attachClickHandler(element, {}, function (googleUser) {
            _this.socialError.emit('');
            var profile = googleUser.getBasicProfile();
            var name = profile.getName().split(" ");
            var jsonData = {
                "account_type": 2,
                "name": name[0] ? name[0] : name,
                "email": profile.getEmail(),
                "social_account_id": profile.getId(),
                "device_type": 1,
                "device_model": "RNE-L22",
                "device_token": "123abc#$%456",
                "app_version": "1.0",
                "os_version": "7.0",
                "referral_id": _this.route.snapshot.queryParams['utm_source'] ? _this.route.snapshot.queryParams['utm_source'] : ''
            };
            _this.userService.socialLogin(jsonData).subscribe(function (data) {
                if (data.user_details) {
                    _this.google_loading = false;
                    localStorage.setItem("_lay_sess", data.user_details.access_token);
                    $('#sign_in_modal').modal('hide');
                    $('#sign_up_modal').modal('hide');
                    _this.router.url;
                    if (_this.guestUserId) {
                        _this.userService.mapGuestUser(_this.guestUserId).subscribe(function (res) {
                            var urlData = _this.commonFunction.decodeUrl(_this.router.url);
                            _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                                _this.router.navigate(["" + urlData.url], { queryParams: urlData.params });
                            });
                        });
                    }
                    else {
                        var urlData_2 = _this.commonFunction.decodeUrl(_this.router.url);
                        _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                            _this.router.navigate(["" + urlData_2.url], { queryParams: urlData_2.params });
                        });
                    }
                    document.getElementById('navbarNav').click();
                }
            }, function (error) {
                _this.google_loading = false;
                _this.socialError.emit(error.message);
            });
        }, function (error) {
            console.log(error);
            _this.socialError.emit('');
            _this.google_loading = false;
        });
    };
    SocialLoginComponent.prototype.ngAfterViewInit = function () {
        this.loadGoogleSdk();
    };
    SocialLoginComponent.prototype.loadGoogleSdk = function () {
        var _this = this;
        gapi.load('auth2', function () {
            _this.auth2 = gapi.auth2.init({
                client_id: environment_1.environment.google_client_id,
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            });
            _this.googleLogin(_this.loginElement.nativeElement);
        });
    };
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
        this.socialError.emit('');
        this.loading = true;
        window['FB'].login(function (response) {
            if (response.authResponse) {
                window['FB'].api('/me', {
                    fields: 'last_name, first_name, email'
                }, function (userInfo) {
                    var jsonData = {
                        "account_type": 1,
                        "name": userInfo.first_name,
                        "email": userInfo.email ? userInfo.email : '',
                        "social_account_id": userInfo.id,
                        "device_type": 1,
                        "device_model": "Angular web",
                        "device_token": "123abc#$%456",
                        "app_version": "1.0",
                        "os_version": "7.0",
                        "referral_id": _this.route.snapshot.queryParams['utm_source'] ? _this.route.snapshot.queryParams['utm_source'] : ''
                    };
                    _this.userService.socialLogin(jsonData).subscribe(function (data) {
                        _this.loading = false;
                        if (data.user_details) {
                            localStorage.setItem("_lay_sess", data.user_details.access_token);
                            $('#sign_in_modal').modal('hide');
                            $('#sign_up_modal').modal('hide');
                            _this.test = true;
                            document.getElementById('navbarNav').click();
                            _this.router.url;
                            if (_this.guestUserId) {
                                _this.userService.mapGuestUser(_this.guestUserId).subscribe(function (res) {
                                    var urlData = _this.commonFunction.decodeUrl(_this.router.url);
                                    _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                                        _this.router.navigate(["" + urlData.url], { queryParams: urlData.params });
                                    });
                                });
                            }
                            else {
                                var urlData_3 = _this.commonFunction.decodeUrl(_this.router.url);
                                _this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
                                    _this.router.navigate(["" + urlData_3.url], { queryParams: urlData_3.params });
                                });
                            }
                        }
                    }, function (error) {
                        _this.loading = false;
                        _this.socialError.emit(error.message);
                        // this.toastr.error(error.message, 'SignIn Error');
                    });
                });
            }
            else {
                _this.socialError.emit('');
                _this.loading = false;
                // this.toastr.error("Something went wrong!", 'SignIn Error');
            }
        }, { scope: 'email' });
    };
    SocialLoginComponent.prototype.loginWithApple = function () {
        this.socialError.emit('');
        this.authService.signIn(apple_provider_1.AppleLoginProvider.PROVIDER_ID);
    };
    __decorate([
        core_1.Output()
    ], SocialLoginComponent.prototype, "socialError");
    __decorate([
        core_1.ViewChild('loginRef', { static: true })
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
