"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--) {
            if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.AddCardComponent = void 0;

var core_1 = require("@angular/core");

var forms_1 = require("@angular/forms");

var environment_1 = require("../../../environments/environment");

var AddCardComponent =
    /** @class */
    function() {
        function AddCardComponent(genericService, formBuilder, toastr, spinner, commonFunction) {
            this.genericService = genericService;
            this.formBuilder = formBuilder;
            this.toastr = toastr;
            this.spinner = spinner;
            this.commonFunction = commonFunction;
            this.s3BucketUrl = environment_1.environment.s3BucketUrl;
            this.emitNewCard = new core_1.EventEmitter();
            this.changeLoading = new core_1.EventEmitter();
            this.emitCardListChange = new core_1.EventEmitter();
            this.add_new_card = new core_1.EventEmitter();
            this.submitted = false;
            this.cardError = "";
            this.locale = {
                format: 'MM/YYYY',
                displayFormat: 'MM/YYYY'
            };
            this.saveCardLoader = false;
            this.expiryMinDate = new Date();
            this.cardListChangeCount = 0;
            this.envKey = '';
            this.mask = {
                guide: false,
                showMask: false,
                mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
            };
            this.cvvNoMask = {
                guide: false,
                showMask: false,
                mask: [/\d/, /\d/, /\d/, /\d/]
            };
            this.dateYeaMask = {
                guide: false,
                showMask: false,
                mask: [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
            };
        }

        AddCardComponent.prototype.ngOnInit = function() {
            var _this = this;

            this.totalCard = JSON.parse(this.totalCard);
            this.cardForm = this.formBuilder.group({
                first_name: ['', forms_1.Validators.required],
                last_name: ['', forms_1.Validators.required],
                card_cvv: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(4)]],
                card_number: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]],
                expiry: ['', forms_1.Validators.required]
            });
            this.genericService.getPaymentDetails().subscribe(function(result) {
                _this.envKey = result.credentials.environment;

                _this.spreedlySdk();
            });
            $('#cardError').hide();
        };

        AddCardComponent.prototype.spreedlySdk = function() {
            Spreedly.init(this.envKey, {
                'numberEl': 'spreedly-number',
                'cvvEl': 'spreedly-cvv'
            });
            Spreedly.on('ready', function(frame) {
                Spreedly.setPlaceholder("number", "000 000 0000");
                Spreedly.setPlaceholder("cvv", "Enter CVV No.");
                Spreedly.setFieldType("cvv", "text");
                Spreedly.setFieldType('number', 'text'); // Spreedly.setNumberFormat('maskedFormat');

                Spreedly.setStyle('number', 'width: 100%; border-radius: none; border-bottom: 2px solid #D6D6D6; padding-top: .65em ; padding-bottom: .5em; font-size: 14px;box-shadow: none;outline: none;border-radius: 0;');
                Spreedly.setStyle('cvv', 'width: 100%; border-radius: none; border: none; padding-top: .96em ; padding-bottom: .5em; font-size: 14px;box-shadow: none;outline: none;border-radius: 0;');
            });
            Spreedly.on('errors', function(errors) {
                $(".credit_card_error").hide();
                $("#error_message").text("");

                if ($("#full_name").val() == "") {
                    $("#first_name").show();
                    $("#full_name").css("border-bottom", "2px solid #ff0000");
                }

                if ($("#month-year").val() == "") {
                    $("#month").show();
                    $("#month-year").css("border-bottom", "2px solid #ff0000");
                }

                for (var i = 0; i < errors.length; i++) {
                    var error = errors[i];

                    if (error["attribute"]) {
                        $("#error_message").text("error");

                        if (error["attribute"] == 'month' || error["attribute"] == 'year') {
                            $('.month_year_error').show();
                            $("#month-year").css("border-bottom", "2px solid #ff0000");
                        }

                        $("#" + error["attribute"]).show();
                        Spreedly.setStyle(error["attribute"], "border-bottom: 2px solid #ff0000;");
                    } else {
                        $("#full_name").css("border-bottom", "2px solid #d6d6d6");
                        $("#month-year").css("border-bottom", "2px solid #d6d6d6");
                        Spreedly.setStyle(error["attribute"], "border-bottom: 2px solid #d6d6d6;");
                    }
                }
            });
            Spreedly.on('paymentMethod', function(token, pmData) {
                var tokenField = document.getElementById("payment_method_token");
                tokenField.setAttribute("value", token); //this.token = token;

                $('#main_loader').show();
                $(".credit_card_error").hide();
                $("#full_name").css("border-bottom", "2px solid #d6d6d6");
                $("#month-year").css("border-bottom", "2px solid #d6d6d6");
                var cardData = {
                    card_type: pmData.card_type,
                    card_holder_name: pmData.full_name,
                    card_token: pmData.token,
                    card_last_digit: pmData.last_four_digits,
                    card_meta: pmData
                };
                $.ajax({
                    url: environment_1.environment.apiUrl + "v1/payment",
                    method: 'POST',
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('_lay_sess')
                    },
                    data: cardData,
                    success: function success(obj) {
                        // this.emitNewCard.emit(obj);
                        $('#main_loader').hide();
                        var s3BucketUrl = 'https://d2q1prebf1m2s9.cloudfront.net/';
                        var cardObject = {
                            visa: s3BucketUrl + "assets/images/card_visa.svg",
                            master: s3BucketUrl + "assets/images/master_cards_img.svg",
                            american_express: s3BucketUrl + "assets/images/card_amex.svg",
                            discover: s3BucketUrl + "assets/images/card_discover.svg",
                            dankort: s3BucketUrl + "assets/images/card_dankort.svg",
                            maestro: s3BucketUrl + "assets/images/card_maestro.svg",
                            jcb: s3BucketUrl + "assets/images/card_jcb.svg",
                            diners_club: s3BucketUrl + "assets/images/card_dinners_club.svg"
                        };
                        var cardType = {
                            visa: 'Visa',
                            master: 'Mastercard',
                            american_express: 'American Express',
                            discover: 'Discover',
                            dankort: 'Dankort',
                            maestro: 'Maestro',
                            jcb: 'JCB',
                            diners_club: 'Diners Club'
                        };
                        $("#payment-form")[0].reset();
                        Spreedly.reload();
                        var cardTokenNew = obj.cardToken;
                    },
                    error: function error(_error) {
                        console.log(_error);

                        if (_error && _error.status !== 406) {
                            var errorMessage = document.getElementById('cardErrorMessage');
                            $('#main_loader').hide();
                            $('#cardError').show();
                            $('#new_card').show();
                            errorMessage.innerHTML = _error.responseJSON.message;
                        } // this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });

                    }
                });
            });
        };

        AddCardComponent.prototype.closePopup = function() {
            $('#cardError').hide();
        };

        AddCardComponent.prototype.submitPaymentForm = function() {
            var _this = this;

            var paymentMethodFields = ['full_name', 'month-year'],
                options = {};

            for (var i = 0; i < paymentMethodFields.length; i++) {
                var field = paymentMethodFields[i];
                var fieldEl = document.getElementById(field);

                if (fieldEl.id === 'month-year') {
                    var value = fieldEl.value;
                    var values = value.split("/");
                    options['month'] = values[0];
                    options['year'] = values[1];
                } else {
                    // add value to options
                    options[field] = fieldEl.value;
                }

                if (options[field]) { // this.changeLoading.emit(false);
                }
            } // Tokenize!


            Spreedly.tokenizeCreditCard(options);
            // console.log("Submit payment");
            setTimeout(function() {
                _this.cardListChangeCount += _this.cardListChangeCount + 1;

                _this.emitCardListChange.emit(_this.cardListChangeCount);
            }, 5000);
        };

        AddCardComponent.prototype.saveCard = function(cardData) {
            var _this = this;

            this.saveCardLoader = true;
            this.genericService.saveCard(cardData).subscribe(function(res) {
                //this.cardForm.reset();
                _this.emitNewCard.emit(res);

                _this.saveCardLoader = false;
            }, function(error) {
                _this.saveCardLoader = false; // this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
            });
        };

        AddCardComponent.prototype.closeNewCardPanel = function() {
            this.add_new_card.emit(false);
        };

        AddCardComponent.prototype.ngOnDestroy = function() {
            Spreedly.removeHandlers();
        };

        __decorate([core_1.Input()], AddCardComponent.prototype, "showAddCardForm");

        __decorate([core_1.Input()], AddCardComponent.prototype, "totalCard");

        __decorate([core_1.Output()], AddCardComponent.prototype, "emitNewCard");

        __decorate([core_1.Output()], AddCardComponent.prototype, "changeLoading");

        __decorate([core_1.Output()], AddCardComponent.prototype, "emitCardListChange");

        __decorate([core_1.Output()], AddCardComponent.prototype, "add_new_card");

        AddCardComponent = __decorate([core_1.Component({
            selector: 'app-add-card',
            templateUrl: './add-card.component.html',
            styleUrls: ['./add-card.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })], AddCardComponent);
        return AddCardComponent;
    }();

exports.AddCardComponent = AddCardComponent;