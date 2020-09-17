"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CoAccountsComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var moment = require("moment");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var CoAccountsComponent = /** @class */ (function () {
    function CoAccountsComponent(travelerService, router, modalService) {
        this.travelerService = travelerService;
        this.router = router;
        this.modalService = modalService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelers = [];
        this.closeResult = '';
    }
    CoAccountsComponent.prototype.ngOnInit = function () {
        this.getTravelers();
    };
    CoAccountsComponent.prototype.getTravelers = function () {
        var _this = this;
        this.travelerService.getTravelers().subscribe(function (data) {
            _this.travelers = data.data;
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    CoAccountsComponent.prototype.calculateAge = function (birthdate) {
        return moment().diff(birthdate, 'years');
    };
    CoAccountsComponent.prototype.getGender = function (type) {
        if (type == 'M')
            return 'Male';
        if (type == 'F')
            return 'Female';
        if (type == 'N')
            return 'Non Binary';
    };
    CoAccountsComponent.prototype.ngDoCheck = function () {
        // this.getTravelers();
    };
    CoAccountsComponent.prototype.ngOnChanges = function (changes) {
        console.log('sds', changes);
    };
    CoAccountsComponent.prototype.open = function (content, userId) {
        console.log(content);
        var modalRef = this.modalService.open(content);
        // modalRef.componentInstance.name = 'World';
    };
    CoAccountsComponent.prototype.getDismissReason = function (reason) {
        if (reason === ng_bootstrap_1.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === ng_bootstrap_1.ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return "with: " + reason;
        }
    };
    CoAccountsComponent = __decorate([
        core_1.Component({
            selector: 'app-co-accounts',
            templateUrl: './co-accounts.component.html',
            styleUrls: ['./co-accounts.component.scss']
        })
    ], CoAccountsComponent);
    return CoAccountsComponent;
}());
exports.CoAccountsComponent = CoAccountsComponent;
