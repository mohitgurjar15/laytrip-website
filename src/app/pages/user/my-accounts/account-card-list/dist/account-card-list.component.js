"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AccountCardListComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../environments/environment");
var card_action_form_component_1 = require("./card-action-form/card-action-form.component");
var confirmation_modal_component_1 = require("../../../../components/confirmation-modal/confirmation-modal.component");
var AccountCardListComponent = /** @class */ (function () {
    function AccountCardListComponent(userService, modalService, toastr) {
        this.userService = userService;
        this.modalService = modalService;
        this.toastr = toastr;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.isNotFound = false;
        this.loading = false;
    }
    AccountCardListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = true;
        this.userService.getCardList().subscribe(function (res) {
            if (res && res.length) {
                _this.cardList = res;
                _this.loading = false;
                _this.isNotFound = false;
            }
        }, function (err) {
            if (err && err.status === 404) {
                _this.isNotFound = true;
                _this.loading = false;
            }
        });
    };
    AccountCardListComponent.prototype.openCardModal = function () {
        var _this = this;
        this.modalReference = this.modalService.open(card_action_form_component_1.CardActionFormComponent, { windowClass: 'cmn_add_edit_modal add_traveller_modal', centered: true }).result.then(function (result) {
            if (result === 'SAVE') {
                _this.ngOnInit();
            }
        });
    };
    AccountCardListComponent.prototype.deleteCard = function (card) {
        var options = {
            header: 'Delete Card',
            message: 'Are you sure you want to delete Card?',
            type: 'DELETE',
            button_text: 'Yes'
        };
        var modalRef = this.modalService.open(confirmation_modal_component_1.ConfirmationModalComponent, {
            windowClass: 'cmn_delete_modal',
            centered: true
        });
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        modalRef.componentInstance.data = options;
        modalRef.result.then(function (result) {
            if (result.STATUS === confirmation_modal_component_1.MODAL_TYPE.YES) {
                console.log(result);
                // this.userService.deleteCard().subscribe((res: any) => {
                //   if (res && res.message) {
                //     this.toastr.success('Card deleted successfully.', 'Success');
                //     this.ngOnInit();
                //   }
                // }, (error => {
                //   this.toastr.error(error.message, 'Error');
                // }));
            }
        });
    };
    AccountCardListComponent = __decorate([
        core_1.Component({
            selector: 'app-card-list',
            templateUrl: './account-card-list.component.html',
            styleUrls: ['./account-card-list.component.scss']
        })
    ], AccountCardListComponent);
    return AccountCardListComponent;
}());
exports.AccountCardListComponent = AccountCardListComponent;
