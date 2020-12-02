"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ShareSocialMediaComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_modal_component_1 = require("../../components/confirmation-modal/confirmation-modal.component");
var environment_1 = require("../../../environments/environment");
var ShareSocialMediaComponent = /** @class */ (function () {
    function ShareSocialMediaComponent(activeModal) {
        this.activeModal = activeModal;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.environment = environment_1.environment;
    }
    ShareSocialMediaComponent.prototype.ngOnInit = function () {
    };
    ShareSocialMediaComponent.prototype.close = function () {
        this.activeModal.close({ STATUS: confirmation_modal_component_1.MODAL_TYPE.CLOSE });
    };
    ShareSocialMediaComponent.prototype.share = function (media) {
        if (media == 'Pinterest') {
            window.open('http://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(environment_1.environment.siteUrl) + '&media=' + encodeURIComponent('http://d2q1prebf1m2s9.cloudfront.net/assets/images/dr_logo.svg') + '&description=' + encodeURIComponent('Book now, pay in installments. Making travel affordable to all.'));
        }
        else if (media == 'Twitter') {
            window.open("https://twitter.com/intent/tweet?original_referer=" + environment_1.environment.siteUrl + "&url=" + environment_1.environment.siteUrl + "&text=Book now, pay in installments. Making travel affordable to all.");
        }
        else if (media == 'Facebook') {
            window.open("https://www.facebook.com/sharer/sharer.php?u=" + escape(environment_1.environment.siteUrl) + "&t=" + escape('Book now, pay in installments. Making travel affordable to all'), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=textyes,height=300,width=600');
        }
        else if (media == 'Google') {
            window.open("https://plus.google.com/share?url=" + environment_1.environment.siteUrl + ",\"\",\"height=550,width=525,left=100,top=100,menubar=0");
        }
        else if (media == 'Whatapp') {
            var message = encodeURIComponent('Laytrip');
            var whatsapp_url = "whatsapp://send?text=" + message;
            window.location.href = whatsapp_url;
        }
        return false;
    };
    ShareSocialMediaComponent = __decorate([
        core_1.Component({
            selector: 'app-share-social-media',
            templateUrl: './share-social-media.component.html',
            styleUrls: ['./share-social-media.component.scss']
        })
    ], ShareSocialMediaComponent);
    return ShareSocialMediaComponent;
}());
exports.ShareSocialMediaComponent = ShareSocialMediaComponent;
