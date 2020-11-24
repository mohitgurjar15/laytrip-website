"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MainFooterComponent = void 0;
var core_1 = require("@angular/core");
var share_social_media_component_1 = require("../../components/share-social-media/share-social-media.component");
var environment_1 = require("../../../environments/environment");
var MainFooterComponent = /** @class */ (function () {
    function MainFooterComponent(modalService) {
        this.modalService = modalService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
    }
    MainFooterComponent.prototype.ngOnInit = function () {
        this.loadJquery();
    };
    MainFooterComponent.prototype.loadJquery = function () {
        // Start Back to Top Js
        $(window).scroll(function () {
            var height = $(window).scrollTop();
            if (height > 100) {
                $('#back_to_top').fadeIn();
            }
            else {
                $('#back_to_top').fadeOut();
            }
        });
        $(document).ready(function () {
            $("#back_to_top").click(function (event) {
                event.preventDefault();
                $("html, body").animate({
                    scrollTop: 0
                }, "slow");
                return false;
            });
        });
        // Close Back to Top Js
    };
    MainFooterComponent.prototype.openShare = function () {
        var modalRef = this.modalService.open(share_social_media_component_1.ShareSocialMediaComponent, { windowClass: 'share_modal', centered: true });
        modalRef.componentInstance.name = 'World';
    };
    MainFooterComponent = __decorate([
        core_1.Component({
            selector: 'app-main-footer',
            templateUrl: './main-footer.component.html',
            styleUrls: ['./main-footer.component.scss']
        })
    ], MainFooterComponent);
    return MainFooterComponent;
}());
exports.MainFooterComponent = MainFooterComponent;
