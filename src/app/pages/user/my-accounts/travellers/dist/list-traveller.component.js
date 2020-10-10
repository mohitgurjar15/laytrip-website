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
var traveller_form_component_1 = require("./traveller-form/traveller-form.component");
var ListTravellerComponent = /** @class */ (function () {
    function ListTravellerComponent(travelerService, router, modalService, toastr) {
        this.travelerService = travelerService;
        this.router = router;
        this.modalService = modalService;
        this.toastr = toastr;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.travelers = [];
        this.closeResult = '';
        this.loading = true;
        this.loops = [0, 1, 2, 3, 4, 5];
        this.dataPassToChild = null;
        this.notFound = false;
        this.perPageLimitConfig = [10, 25, 50, 100];
        this.pageSize = 10;
        this.showPaginationBar = false;
    }
    ListTravellerComponent.prototype.ngOnInit = function () {
        this.isMasterSel = false;
        this.pageNumber = 1;
        this.limit = this.perPageLimitConfig[0];
        this.loading = true;
        this.getTravelers();
        this.getCheckedItemList();
    };
    ListTravellerComponent.prototype.pageChange = function (event) {
        this.loading = false;
        this.pageNumber = event;
    };
    ListTravellerComponent.prototype.getTravelers = function () {
        var _this = this;
        this.travelerService.getTravelers().subscribe(function (data) {
            _this.travelers = data.data;
            _this.loading = false;
            _this.showPaginationBar = true;
            if (_this.travelers.length === 0) {
                _this.notFound = true;
            }
        }, function (error) {
            _this.loading = _this.showPaginationBar = false;
            _this.notFound = true;
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
    ListTravellerComponent.prototype.openTravellerModal = function (content, userId, traveler) {
        var _this = this;
        if (userId === void 0) { userId = ''; }
        if (traveler === void 0) { traveler = ''; }
        this.modalReference = this.modalService.open(traveller_form_component_1.TravellerFormComponent, { windowClass: 'cmn_add_edit_modal add_traveller_modal', centered: true });
        this.modalReference.componentInstance.travellerId = userId;
        this.modalReference.componentInstance.travelerInfo = traveler;
        this.modalReference.componentInstance.travelersChanges.subscribe(function ($e) {
            var index = _this.travelers.indexOf($e.userId, 0);
            if (index) {
                _this.travelers = _this.travelers.filter(function (item) { return item.userId != $e.userId; });
            }
            _this.travelers.push($e);
        });
    };
    ListTravellerComponent.prototype.deleteTravellerModal = function (content, userId) {
        var _this = this;
        if (userId === void 0) { userId = ''; }
        this.modalReference = this.modalService.open(content, { windowClass: 'cmn_delete_modal', centered: true });
        this.userId = userId;
        this.modalReference.result.then(function (result) {
            _this.closeResult = "Closed with: " + result;
        }, function (reason) {
            _this.getTravelers();
            _this.closeResult = "Dismissed " + _this.getDismissReason(reason);
            console.log(_this.closeResult);
        });
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
    ListTravellerComponent.prototype.pushTraveler = function (event) {
        console.log("event", event);
    };
    ListTravellerComponent.prototype.deleteTraveller = function () {
        var _this = this;
        this.travelerService["delete"](this.userId).subscribe(function (data) {
            _this.getTravelers();
            if (data.message) {
                _this.toastr.success('Traveler deleted successfully.', 'Success');
            }
            else {
                _this.toastr.error(data.message, 'Failure');
            }
        }, function (error) {
            if (error.status === 401) {
                _this.toastr.error(error.error.errorMsg, 'Error');
                _this.router.navigate(['/']);
            }
            else {
                _this.getTravelers();
                _this.toastr.error(error.error.errorMsg, 'Error');
            }
        });
        this.modalReference.close();
    };
    ListTravellerComponent.prototype.checkUncheckAll = function () {
        var checkboxes = document.getElementsByClassName('travelerCheckbox');
        for (var i = 0; i < checkboxes.length; i++) {
            this.travelers[i].isSelected = this.isMasterSel;
        }
        console.log(this.travelers);
        this.getCheckedItemList();
    };
    ListTravellerComponent.prototype.isAllSelected = function () {
        this.isMasterSel = this.travelers.every(function (item) {
            return item.isSelected == true;
        });
        this.getCheckedItemList();
    };
    ListTravellerComponent.prototype.getCheckedItemList = function () {
        this.checkedCategoryList = [];
        for (var i = 0; i < this.travelers.length; i++) {
            if (this.travelers[i].isSelected)
                this.checkedCategoryList.push(this.travelers[i]);
        }
        this.checkedCategoryList = JSON.stringify(this.checkedCategoryList);
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
