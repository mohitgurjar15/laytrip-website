"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.SpreedlyService = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var SpreedlyService = /** @class */ (function () {
    function SpreedlyService(router, document, http, commonFunction, genericService) {
        var _this = this;
        this.router = router;
        this.document = document;
        this.http = http;
        this.commonFunction = commonFunction;
        this.genericService = genericService;
        this.environmentKey = '';
        this.genericService.getPaymentDetails().subscribe(function (result) {
            _this.environmentKey = result.credentials.environment;
            // console.log("this.environmentKey",this.environmentKey)
        });
    }
    SpreedlyService.prototype.browserInfo = function () {
        var browser_size = '01';
        // The accept header from your server side rendered page. You'll need to inject it into the page. Below is an example.
        var acceptHeader = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
        // The request should include the browser data collected by using `Spreedly.ThreeDS.serialize().
        var browser_info = Spreedly.ThreeDS.serialize(browser_size, acceptHeader);
        return browser_info;
    };
    SpreedlyService.prototype.lifeCycle = function (res) {
        var transaction = res.transaction;
        var accessToken = localStorage.getItem('_lay_sess');
        // console.log("this.environmentKey12",this.environmentKey)
        env.init(environment_1.environment, accessToken, res.redirection);
        var lifecycle = new Spreedly.ThreeDS.Lifecycle({
            environmentKey: this.environmentKey,
            // The environmentKey field is required, but if omitted, you will receive a console warning message and the transaction will still succeed.
            hiddenIframeLocation: 'device-fingerprint',
            // The DOM node that you'd like to inject hidden iframes
            challengeIframeLocation: 'challenge',
            // The DOM node that you'd like to inject the challenge flow
            transactionToken: transaction.token,
            // The token for the transaction - used to poll for state
            // The css classes that you'd like to apply to the challenge iframe.
            challengeIframeClasses: 'challangeIframe'
            // Note: This is where you'll change the height and width of the challenge
            //       iframe. You'll need to match the height and width option that you
            //       selected when collecting browser data with `Spreedly.ThreeDS.serialize`.
            //       For instance if you selected '04' for browserSize you'll need to have a
            //       CSS class that has width and height of 600px by 400px.
        });
        // Spreedly.on('3ds:status', spreedlyStatus.updates);
        // let status3ds = Spreedly.on('3ds:status', this.statusUpdates);
        var transactionData = {
            state: transaction.state,
            // The current state of the transaction. 'pending', 'succeeded', etc
            required_action: transaction.required_action,
            // The next action to be performed in the 3D Secure workflow
            device_fingerprint_form: transaction.device_fingerprint_form,
            // Available when the required_action is on the device fingerprint step
            checkout_form: transaction.checkout_form,
            // Available when the required_action is on the 3D Secure 1.0 fallback step
            checkout_url: transaction.checkout_url,
            // Available when the required_action is on the 3D Secure 1.0 fallback step
            challenge_form: transaction.challenge_form,
            // The challenge form that is injected when the user is challenged
            challenge_url: transaction.challenge_url,
            // redirect_url: 'http://localhost:4200/flight/confirmation',
            redirect_url: res.redirection
        };
        // console.log("transactionData",transactionData)
        lifecycle.start(transactionData);
    };
    SpreedlyService = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject(common_1.DOCUMENT))
    ], SpreedlyService);
    return SpreedlyService;
}());
exports.SpreedlyService = SpreedlyService;
