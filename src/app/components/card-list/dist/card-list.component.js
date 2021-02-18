"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CardListComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../../environments/environment");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var card_helper_1 = require("../../_helpers/card.helper");
var CardListComponent = /** @class */ (function () {
    function CardListComponent(genericService, userService, modalService) {
        this.genericService = genericService;
        this.userService = userService;
        this.modalService = modalService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.cardLoader = true;
        this.cards = [];
        this.selectCreditCard = new core_1.EventEmitter();
        this.totalNumberOfcard = new core_1.EventEmitter();
        this.cardToken = '';
        this.cardListChangeCount = 0;
        this.deleteApiError = '';
        this.cardObject = card_helper_1.cardObject;
        this.cardType = card_helper_1.cardType;
    }
    CardListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getCardlist();
        this.userService.getProfile().subscribe(function (res) {
            _this.userInfo = res;
        });
    };
    CardListComponent.prototype.getCardlist = function () {
        var _this = this;
        this.cardLoader = true;
        this.genericService.getCardlist().subscribe(function (res) {
            _this.cardLoader = false;
            _this.cards = res;
            _this.totalNumberOfcard.emit(res.length);
        }, function (error) {
            _this.cards = [];
            _this.cardLoader = false;
            _this.totalNumberOfcard.emit(0);
        });
    };
    CardListComponent.prototype.selectCard = function (cardToken) {
        // $('#card_list_accodrio').children('div').toggleClass('current_selected_card');
        this.cardToken = cardToken;
        this.selectCreditCard.emit(cardToken);
    };
    CardListComponent.prototype.ngOnChanges = function (changes) {
        if (typeof changes['newCard'] !== 'undefined') {
            if (typeof this.newCard !== 'undefined') {
                this.cards.push(this.newCard);
                this.cardToken = this.newCard.cardToken;
                this.selectCreditCard.emit(this.newCard.cardToken);
            }
        }
        if (typeof changes['cardListChangeCount'] != 'undefined') {
            this.getCardlist();
        }
        this.cards = this.cards.filter(function (card) {
            return typeof card != 'undefined';
        });
    };
    CardListComponent.prototype.openDeleteModal = function (content, id) {
        var _this = this;
        this.cardId = id;
        console.log(id);
        this.modalService.open(content, { windowClass: 'delete_account_window', centered: true, backdrop: 'static',
            keyboard: false }).result.then(function (result) {
            _this.closeResult = "Closed with: " + result;
        }, function (reason) {
            _this.closeResult = "Dismissed " + _this.getDismissReason(reason);
        });
    };
    CardListComponent.prototype.getDismissReason = function (reason) {
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
    CardListComponent.prototype.deleteCreditCard = function () {
        var _this = this;
        this.cardLoader = true;
        this.genericService.deleteCard(this.cardId).subscribe(function (res) {
            _this.cardLoader = false;
            _this.getCardlist();
            _this.modalService.dismissAll();
        }, function (error) {
            _this.cardLoader = false;
            if (error.status === 409) {
                _this.deleteApiError = error.message;
            }
            else {
                _this.modalService.dismissAll();
            }
        });
    };
    __decorate([
        core_1.Output()
    ], CardListComponent.prototype, "selectCreditCard");
    __decorate([
        core_1.Output()
    ], CardListComponent.prototype, "totalNumberOfcard");
    __decorate([
        core_1.Input()
    ], CardListComponent.prototype, "newCard");
    __decorate([
        core_1.Input()
    ], CardListComponent.prototype, "cardToken");
    __decorate([
        core_1.Input()
    ], CardListComponent.prototype, "cardListChangeCount");
    CardListComponent = __decorate([
        core_1.Component({
            selector: 'app-card-list',
            templateUrl: './card-list.component.html',
            styleUrls: ['./card-list.component.scss']
        })
    ], CardListComponent);
    return CardListComponent;
}());
exports.CardListComponent = CardListComponent;
