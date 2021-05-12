"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var moment = require("moment");
var environment_1 = require("../environments/environment");
var uuid_1 = require("uuid");
var jwt_helper_1 = require("./_helpers/jwt.helper");
var AppComponent = /** @class */ (function () {
    function AppComponent(cookieService, genericService, checkOutService, route, router, userService) {
        this.cookieService = cookieService;
        this.genericService = genericService;
        this.checkOutService = checkOutService;
        this.route = route;
        this.router = router;
        this.userService = userService;
        this.title = 'laytrip-website';
        this.VAPID_PUBLIC_KEY = environment_1.environment.VAPID_PUBLIC_KEY;
        this.setUserOrigin();
        this.getUserLocationInfo();
        /* this.router.events.subscribe((event: Event) => {
          if (event instanceof NavigationStart) {
            // Trigger when route change
            if(this.route.snapshot.params['id']){
              this.isValidateReferralId(this.route.snapshot.params['id'])
            } else {
              console.log('removed-app')
              localStorage.removeItem("referral_id")
            }
            
          }
        }); */
    }
    AppComponent.prototype.ngOnInit = function () {
        var token = localStorage.getItem('_lay_sess');
        if (token) {
            // this.subscribeToNotifications()
        }
        this.registerGuestUser();
        this.setCountryBehaviour();
    };
    AppComponent.prototype.isValidateReferralId = function (referral_id) {
        this.genericService.checkIsReferralUser(referral_id).subscribe(function (res) {
            localStorage.setItem("referral_id", res.data.name);
        }, function (err) {
            localStorage.removeItem("referral_id");
        });
    };
    /* subscribeToNotifications() {
  
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub =>   this.genericService.addPushSubscriber(sub).subscribe()
      )
    .catch(
      
    );
    
    } */
    AppComponent.prototype.setUserOrigin = function () {
        var host = window.location.origin;
        if (host.includes("dr.")) {
            localStorage.setItem('__uorigin', 'DR');
        }
        else {
            localStorage.removeItem('__uorigin');
        }
    };
    AppComponent.prototype.getUserLocationInfo = function () {
        var _this = this;
        try {
            var location = this.cookieService.get('__loc');
            if (typeof location == 'undefined') {
                this.genericService.getUserLocationInfo().subscribe(function (res) {
                    _this.cookieService.put('__loc', JSON.stringify(res), { expires: new Date(moment().add('7', "days").format()) });
                    _this.redirectToDRsite(res);
                }, function (error) {
                });
            }
            else {
                location = JSON.parse(location);
                this.redirectToDRsite(location);
            }
        }
        catch (e) {
        }
    };
    AppComponent.prototype.redirectToDRsite = function (location) {
        if (location.country.iso2 == 'PL') {
            if (window.location.origin == 'https://staging.laytrip.com' || window.location.origin == 'http://staging.laytrip.com' || window.location.origin == 'http://localhost:4200') {
                //window.location.href='https://www.google.com/'
            }
        }
    };
    AppComponent.prototype.registerGuestUser = function () {
        var user = jwt_helper_1.getLoginUserInfo();
        if (!user.roleId || user.roleId == 7) {
            var __gst = localStorage.getItem('__gst');
            if (!__gst) {
                var uuid = uuid_1.v4();
                localStorage.setItem('__gst', uuid);
                this.userService.registerGuestUser({ guest_id: uuid }).subscribe(function (result) {
                    localStorage.setItem("_lay_sess", result.accessToken);
                });
            }
            else {
                this.userService.registerGuestUser({ guest_id: __gst }).subscribe(function (result) {
                    localStorage.setItem("_lay_sess", result.accessToken);
                });
            }
        }
    };
    AppComponent.prototype.setCountryBehaviour = function () {
        var _this = this;
        this.genericService.getCountry().subscribe(function (res) {
            _this.checkOutService.setCountries(res);
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
