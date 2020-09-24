"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AddCardComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var moment = require("moment");
var AddCardComponent = /** @class */ (function () {
    function AddCardComponent(genericService, formBuilder, toastr) {
        this.genericService = genericService;
        this.formBuilder = formBuilder;
        this.toastr = toastr;
        this.emitNewCard = new core_1.EventEmitter();
        // @ViewChild('cardAddForm') cardAddFormElement: ElementRef;
        //@ViewChild('cardAddForm', { read: NgForm }) cardAddFormElement: any;
        this.disabledSavecardbutton = true;
        this.submitted = false;
        this.cardError = "";
        this.locale = {
            format: 'MM/YYYY',
            displayFormat: 'MM/YYYY'
        };
        this.saveCardLoader = false;
        this.expiryMinDate = new Date();
    }
    AddCardComponent.prototype.ngOnInit = function () {
        this.cardForm = this.formBuilder.group({
            first_name: ['', forms_1.Validators.required],
            last_name: ['', forms_1.Validators.required],
            card_cvv: ['', forms_1.Validators.required],
            card_number: ['', forms_1.Validators.required],
            expiry: ['', forms_1.Validators.required]
        });
    };
    AddCardComponent.prototype.spreedlySdk = function () {
        Spreedly.init('YNEdZFTwB1tRR4zwvcMIaUxZq3g', {
            'numberEl': 'spreedly-number',
            'cvvEl': 'spreedly-cvv'
        });
        Spreedly.on('ready', function () {
            Spreedly.setPlaceholder("number", "Card Number");
            Spreedly.setPlaceholder("cvv", "CVV");
            Spreedly.setFieldType("cvv", "text");
            Spreedly.setFieldType("number", "text");
            Spreedly.transferFocus("number");
            // Spreedly.setNumberFormat("maskedFormat");
            this.disabledSavecardbutton = false;
            console.log('this.disabledSavecardbutton', this.disabledSavecardbutton);
        });
        Spreedly.on('paymentMethod', function (token, pmData) {
            // Set the token in the hidden form field
            var tokenField = document.getElementById('payment_method_token');
            tokenField.setAttribute('value', token);
            this.token = token;
            // console.log(this.cardForm.controls.payment_method_token.value);
            // this.cardForm.controls.payment_method_token.setValue(token);
            console.log("this.token", token);
            // console.log(pmData);
            var cardData = {
                card_type: pmData.card_type,
                card_holder_name: pmData.full_name,
                card_token: pmData.token,
                card_last_digit: pmData.last_four_digits
            };
            console.log(cardData);
            this.saveCard(cardData);
            //this.submitPaymentForm(cardData);
            //var masterForm = document.getElementById('payment-form') as HTMLFormElement;
            // console.log(masterForm);
            //masterForm.submit();
            // this.saveCard(cardData);
            // this.cardAddFormElement.nativeElement.submit();
        });
    };
    AddCardComponent.prototype.submitPaymentForm = function () {
        this.cardError = '';
        this.submitted = true;
        if (this.cardForm.invalid) {
            return;
        }
        var cardData = {
            first_name: this.cardForm.controls.first_name.value,
            last_name: this.cardForm.controls.last_name.value,
            card_cvv: this.cardForm.controls.card_cvv.value,
            card_number: this.cardForm.controls.card_number.value,
            expiry: moment(this.cardForm.controls.expiry.value).format('MM/YYYY')
        };
        this.saveCard(cardData);
    };
    AddCardComponent.prototype.saveCard = function (cardData) {
        var _this = this;
        this.saveCardLoader = true;
        this.genericService.saveCard(cardData).subscribe(function (res) {
            //this.cardForm.reset();
            _this.emitNewCard.emit(res);
            _this.saveCardLoader = false;
        }, (function (error) {
            _this.saveCardLoader = false;
            _this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
        }));
    };
    AddCardComponent.prototype.expiryDateUpdate = function (event) {
    };
    __decorate([
        core_1.Input()
    ], AddCardComponent.prototype, "showAddCardForm");
    __decorate([
        core_1.Output()
    ], AddCardComponent.prototype, "emitNewCard");
    AddCardComponent = __decorate([
        core_1.Component({
            selector: 'app-add-card',
            templateUrl: './add-card.component.html',
            styleUrls: ['./add-card.component.scss']
        })
    ], AddCardComponent);
    return AddCardComponent;
}());
exports.AddCardComponent = AddCardComponent;
