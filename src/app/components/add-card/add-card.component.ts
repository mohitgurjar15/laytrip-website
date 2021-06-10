import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
declare var Spreedly: any;
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCardComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() showAddCardForm: boolean;
  @Input() totalCard;
  @Output() emitNewCard = new EventEmitter();
  @Output() changeLoading = new EventEmitter;
  @Output() emitCardListChange = new EventEmitter();
  @Output() add_new_card = new EventEmitter();
  cardForm: FormGroup;
  submitted: boolean = false;
  token: string;
  cardError: string = "";
  cardData;
  locale = {
    format: 'MM/YYYY',
    displayFormat: 'MM/YYYY'
  };
  saveCardLoader: boolean = false;
  expiryMinDate = new Date();
  cardListChangeCount: number = 0;
  envKey: string = '';

  mask = {
    guide: false,
    showMask: false,
    mask: [
      /\d/, /\d/, /\d/, /\d/, ' ',
      /\d/, /\d/, /\d/, /\d/, ' ',
      /\d/, /\d/, /\d/, /\d/, ' ',
      /\d/, /\d/, /\d/, /\d/, ' ',
      /\d/, /\d/, /\d/, /\d/]
  };

  cvvNoMask = {
    guide: false,
    showMask: false,
    mask: [
      /\d/, /\d/, /\d/, /\d/]
  };

  dateYeaMask = {
    guide: false,
    showMask: false,
    mask: [
      /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };

  constructor(
    private genericService: GenericService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    this.totalCard = JSON.parse(this.totalCard);
    this.cardForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      card_cvv: ['', [Validators.required, Validators.maxLength(4)]],
      card_number: ['', [Validators.required, Validators.maxLength(20)]],
      expiry: ['', Validators.required]
    });
    this.genericService.getPaymentDetails().subscribe((result: any) => {
      this.envKey = result.credentials.environment;
      this.spreedlySdk();
    });
    $('#cardError').hide();
  }

  spreedlySdk() {
    Spreedly.init(this.envKey, {
      'numberEl': 'spreedly-number',
      'cvvEl': 'spreedly-cvv',
    });

    Spreedly.on('ready', function (frame) {
      Spreedly.setPlaceholder("number", "000 000 0000");
      Spreedly.setPlaceholder("cvv", "Enter CVV No.");
      Spreedly.setFieldType('number', 'text');
      Spreedly.setFieldType('cvv', 'text');
      // Spreedly.setNumberFormat('maskedFormat');
      Spreedly.setStyle('number', 'width: 100%; border-radius: none; border-bottom: 2px solid #D6D6D6; padding-top: .65em ; padding-bottom: .5em; font-size: 14px;box-shadow: none;outline: none;border-radius: 0;');
      Spreedly.setStyle('cvv', 'width: 100%; border-radius: none; border-bottom: 2px solid #D6D6D6; padding-top: .96em ; padding-bottom: .5em; font-size: 14px;box-shadow: none;outline: none;border-radius: 0;');
    });

    Spreedly.on('errors', function (errors) {
      $(".credit_card_error").hide();
      $("#error_message").text("");

      if ($("#full_name").val() == "") {
        $("#first_name").show();
        $("#full_name").css("border-bottom", "2px solid #ff0000");
      } else {
        $("#full_name").css("border-bottom", "2px solid #d6d6d6");
      }
      if ($("#month-year").val() == "") {
        $("#month").show();
        $("#month-year").css("border-bottom", "2px solid #ff0000");
      } else {
        $("#month-year").css("border-bottom", "2px solid #d6d6d6");
      }

      for (var i = 0; i < errors.length; i++) {
        var error = errors[i];
        var errorBorder = "2px solid #ff0000";
        // console.log(error["attribute"]);
        if (error["attribute"]) {
          $("#error_message").text("error");
          if (error["attribute"] == 'month' || error["attribute"] == 'year') {
            $('.month_year_error').show();
            $("#month-year").css("border-bottom", "2px solid #ff0000");
          }
          $("#" + error["attribute"]).show();
          Spreedly.setStyle(error["attribute"], "border-bottom: 2px solid #ff0000;");
        } else {
          console.log(error["attribute"]);
          $("#full_name").css("border-bottom", "2px solid #d6d6d6");
          $("#month-year").css("border-bottom", "2px solid #d6d6d6");
          Spreedly.setStyle(error["attribute"], "border-bottom: 2px solid #d6d6d6;");
        }
      }
    });

    Spreedly.on('fieldEvent', function (name, event, activeElement, inputData) {
      if (event == 'input') {
        if (inputData["validNumber"]) {
          Spreedly.setStyle('number', "border-bottom: 2px solid #d6d6d6;");
          $("#number").hide();
          $("#error_message").text("");
        } else {
          Spreedly.setStyle('number', "border-bottom: 2px solid #ff0000;");
        }
      }
    });

    Spreedly.on('paymentMethod', function (token, pmData) {
      var tokenField = document.getElementById("payment_method_token");
      tokenField.setAttribute("value", token);
      //this.token = token;
      $('#main_loader').show();
      $(".credit_card_error").hide();
      $("#full_name").css("border-bottom", "2px solid #d6d6d6");
      $("#month-year").css("border-bottom", "2px solid #d6d6d6");
      let cardData = {
        card_type: pmData.card_type,
        card_holder_name: pmData.full_name,
        card_token: pmData.token,
        card_last_digit: pmData.last_four_digits,
        card_meta: pmData
      };
      $.ajax({
        url: `${environment.apiUrl}v1/payment`,
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('_lay_sess')}` },
        data: cardData,
        success: function (obj) {
          // this.emitNewCard.emit(obj);
          $('#main_loader').hide();

          let s3BucketUrl = 'https://d2q1prebf1m2s9.cloudfront.net/';
          var cardObject = {
            visa: `${s3BucketUrl}assets/images/card_visa.svg`,
            master: `${s3BucketUrl}assets/images/master_cards_img.svg`,
            american_express: `${s3BucketUrl}assets/images/card_amex.svg`,
            discover: `${s3BucketUrl}assets/images/card_discover.svg`,
            dankort: `${s3BucketUrl}assets/images/card_dankort.svg`,
            maestro: `${s3BucketUrl}assets/images/card_maestro.svg`,
            jcb: `${s3BucketUrl}assets/images/card_jcb.svg`,
            diners_club: `${s3BucketUrl}assets/images/card_dinners_club.svg`,
          }

          var cardType = {
            visa: 'Visa',
            master: 'Mastercard',
            american_express: 'American Express',
            discover: 'Discover',
            dankort: 'Dankort',
            maestro: 'Maestro',
            jcb: 'JCB',
            diners_club: 'Diners Club',
          }
          $("#payment-form")[0].reset();
          Spreedly.reload();
          var cardTokenNew = obj.cardToken;

        },
        error: function (error) {
          if (error && error.status !== 406) {
            let errorMessage = document.getElementById('cardErrorMessage');
            $('#main_loader').hide();
            $('#cardError').show();
            $('#new_card').show();
            errorMessage.innerHTML = error.responseJSON.message;
          }

          // this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
        }
      });
    });
  }

  closePopup() {
    $('#cardError').hide();
  }

  submitPaymentForm() {
    var paymentMethodFields = ['full_name', 'month-year'],
      options = {};
    var normalBorder = "2px solid #d6d6d6";
    for (var i = 0; i < paymentMethodFields.length; i++) {
      var field = paymentMethodFields[i];
      var fieldEl = (<HTMLInputElement>document.getElementById(field));
      fieldEl.style.borderBottom = normalBorder;

      if (fieldEl.id === 'month-year') {
        let value = fieldEl.value;
        let values = value.split("/");
        options['month'] = values[0];
        options['year'] = values[1];
      }
      else {
        // add value to options
        options[field] = fieldEl.value;
      }
      if (options[field]) {
        // this.changeLoading.emit(false);
      }
    }
    // Tokenize!
    Spreedly.tokenizeCreditCard(options);

    setTimeout(() => {
      this.cardListChangeCount += this.cardListChangeCount + 1;
      this.emitCardListChange.emit(this.cardListChangeCount);
    }, 5000)

  }

  saveCard(cardData) {
    this.saveCardLoader = true;
    this.genericService.saveCard(cardData).subscribe((res: any) => {
      //this.cardForm.reset();
      this.emitNewCard.emit(res);
      this.saveCardLoader = false;
    }, (error => {
      this.saveCardLoader = false;
      // this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
    })
    );
  }

  closeNewCardPanel() {
    $('#cardError').hide();
    Spreedly.reload();
    $(".credit_card_error").hide();
    $("#full_name").css("border-bottom", "2px solid #d6d6d6");
    $("#month-year").css("border-bottom", "2px solid #d6d6d6");
    // Spreedly.removeHandlers();
    $("#payment-form")[0].reset();
    this.add_new_card.emit(false);
  }

  ngOnDestroy() {
    Spreedly.removeHandlers();
  }
}
