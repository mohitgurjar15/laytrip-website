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
var CardListComponent = /** @class */ (function () {
    function CardListComponent(genericService) {
        this.genericService = genericService;
        this.s3BucketUrl = environment_1.environment.s3BucketUrl;
        this.cardLoader = true;
        this.cards = [];
        this.selectCreditCard = new core_1.EventEmitter();
    }
    CardListComponent.prototype.ngOnInit = function () {
        this.getCardlist();
    };
    CardListComponent.prototype.getCardlist = function () {
        var _this = this;
        this.genericService.getCardlist().subscribe(function (res) {
            _this.cardLoader = false;
            _this.cards = res;
        }, function (error) {
            _this.cardLoader = false;
        });
    };
    CardListComponent.prototype.selectCard = function (cardToken) {
        this.selectCreditCard.emit(cardToken);
    };
    CardListComponent.prototype.ngOnChanges = function (changes) {
        if (changes['newCard'].currentValue != 'undefined') {
            if (this.newCard != 'undefined') {
                this.cards.push(this.newCard);
            }
        }
        this.cards = this.cards.filter(function (card) {
            return typeof card != 'undefined';
        });
    };
    __decorate([
        core_1.Output()
    ], CardListComponent.prototype, "selectCreditCard");
    __decorate([
        core_1.Input()
    ], CardListComponent.prototype, "newCard");
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
