"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AccountComponent = void 0;
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var environment_1 = require("../../../../../environments/environment");
var AccountComponent = /** @class */ (function () {
    function AccountComponent(modalService, userService, toastrService) {
        this.modalService = modalService;
        this.userService = userService;
        this.toastrService = toastrService;
        this.loading = true;
        this.closeResult = '';
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.isRequireBackupFile = false;
    }
    AccountComponent.prototype.ngOnInit = function () {
    };
    AccountComponent.prototype.getLoadingValue = function (event) {
        if (event === false) {
            this.loading = false;
        }
        else {
            this.loading = true;
        }
    };
    AccountComponent.prototype.open = function (content) {
        var _this = this;
        this.modalService.open(content, { windowClass: 'delete_account_window', centered: true, backdrop: 'static',
            keyboard: false }).result.then(function (result) {
            _this.closeResult = "Closed with: " + result;
        }, function (reason) {
            _this.closeResult = "Dismissed " + _this.getDismissReason(reason);
        });
    };
    AccountComponent.prototype.getDismissReason = function (reason) {
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
    AccountComponent.prototype.deleteAccount = function () {
        var _this = this;
        this.loading = true;
        var data = { "requireBackupFile": this.isRequireBackupFile };
        this.userService.deleteAccount(data).subscribe(function (data) {
            _this.modalService.dismissAll();
            _this.loading = false;
            _this.toastrService.success(data.message, 'Deleted Account Successfully');
        }, function (error) {
            _this.modalService.dismissAll();
            _this.loading = false;
            _this.toastrService.error(error.error.message, 'Deleted Account Error');
            if (error.status == 401) {
                // redirectToLogin();
            }
        });
    };
    AccountComponent.prototype.changeDeleteAccountForBackup = function (event) {
        this.isRequireBackupFile = false;
        if (event.target.checked) {
            this.isRequireBackupFile = true;
        }
    };
    AccountComponent = __decorate([
        core_1.Component({
            selector: 'app-account',
            templateUrl: './account.component.html',
            styleUrls: ['./account.component.scss']
        })
    ], AccountComponent);
    return AccountComponent;
}());
exports.AccountComponent = AccountComponent;
