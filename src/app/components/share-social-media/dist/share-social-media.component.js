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
        this.isCopyText = false;
        this.baseUrl = "www.laytrip.com";
    }
    ShareSocialMediaComponent.prototype.ngOnInit = function () {
    };
    ShareSocialMediaComponent.prototype.close = function () {
        this.activeModal.close({ STATUS: confirmation_modal_component_1.MODAL_TYPE.CLOSE });
    };
    ShareSocialMediaComponent.prototype.share = function (media) {
        var message = encodeURIComponent('Laytrip - Layaway Travel for Everyone : ' + this.baseUrl);
        if (media == 'Instagram') {
            window.open('https://www.instagram.com/laytrip_travel/');
        }
        else if (media == 'Facebook') {
            window.open("https://www.facebook.com/sharer/sharer.php?u=" + escape(this.baseUrl) + "&t=" + escape(message), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=textyes,height=300,width=600');
        }
        else if (media == 'Whatapp') {
            var whatsapp_url = "https://api.whatsapp.com/send?text=" + message;
            window.open(whatsapp_url);
        }
        else if (media == 'CopiedLink') {
            var url = this.baseUrl;
            this.isCopyText = true;
            url.select();
            document.execCommand('copy');
            url.setSelectionRange(0, 0);
        }
        return false;
    };
    ShareSocialMediaComponent.prototype.copyToClipboard = function () {
        var _this = this;
        var dummy = document.createElement("textarea");
        dummy.setAttribute("id", "dummy_textarea");
        document.body.appendChild(dummy);
        dummy.value = this.baseUrl;
        dummy.select();
        document.execCommand("copy");
        this.isCopyText = true;
        document.getElementById("dummy_textarea").remove();
        setTimeout(function () {
            _this.isCopyText = false;
        }, 2000);
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
