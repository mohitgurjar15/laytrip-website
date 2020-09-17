"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ListTravellerComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var moment = require("moment");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ListTravellerComponent = /** @class */ (function () {
    function ListTravellerComponent(travelerService, router, modalService) {
        this.travelerService = travelerService;
        this.router = router;
        this.modalService = modalService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelers = [];
        this.closeResult = '';
    }
    ListTravellerComponent.prototype.ngOnInit = function () {
        this.getTravelers();
    };
    ListTravellerComponent.prototype.getTravelers = function () {
        var _this = this;
        this.travelerService.getTravelers().subscribe(function (data) {
            _this.travelers = data.data;
        }, function (error) {
            if (error.status === 401) {
                _this.router.navigate(['/']);
            }
        });
    };
    ListTravellerComponent.prototype.calculateAge = function (birthdate) {
        return moment().diff(birthdate, 'years');
    };
    ListTravellerComponent.prototype.getGender = function (type) {
        if (type == 'M')
            return 'Male';
        if (type == 'F')
            return 'Female';
        if (type == 'N')
            return 'Non Binary';
    };
    ListTravellerComponent.prototype.ngDoCheck = function () {
        // this.getTravelers();
    };
    ListTravellerComponent.prototype.ngOnChanges = function (changes) {
        console.log('sds', changes);
    };
    ListTravellerComponent.prototype.open = function (content, userId) {
        console.log(content);
        var modalRef = this.modalService.open(content);
        // modalRef.componentInstance.name = 'World';
    };
    ListTravellerComponent.prototype.getDismissReason = function (reason) {
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
    ListTravellerComponent = __decorate([
        core_1.Component({
            selector: 'app-list-traveller',
            templateUrl: './list-traveller.component.html',
            styleUrls: ['./list-traveller.component.scss']
        })
    ], ListTravellerComponent);
    return ListTravellerComponent;
}());
exports.ListTravellerComponent = ListTravellerComponent;
