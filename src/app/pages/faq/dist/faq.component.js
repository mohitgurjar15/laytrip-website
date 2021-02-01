"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FaqComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var FaqComponent = /** @class */ (function () {
    function FaqComponent(genericService) {
        this.genericService = genericService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.loading = false;
    }
    FaqComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('body').addClass('cms-bgColor');
        window.scroll(0, 0);
        this.loadJquery();
        this.loading = true;
        this.genericService.getFaqData().subscribe(function (res) {
            _this.faqDetail = res.data;
            _this.loading = false;
        });
    };
    FaqComponent.prototype.loadJquery = function () {
        $(document).ready(function () {
            $('.faq_callapse').on('shown.bs.collapse', function () {
                $(this).parent().addClass('active');
            });
            $('.faq_callapse').on('hidden.bs.collapse', function () {
                $(this).parent().removeClass('active');
            });
        });
    };
    FaqComponent = __decorate([
        core_1.Component({
            selector: 'app-faq',
            templateUrl: './faq.component.html',
            styleUrls: ['./faq.component.scss']
        })
    ], FaqComponent);
    return FaqComponent;
}());
exports.FaqComponent = FaqComponent;
