import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
declare var Spreedly: any;
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
//import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
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
    format: 'MM/YY',
    displayFormat: 'MM/YY'
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
      /\d/, /\d/, '/', /\d/, /\d/]
  };

  constructor(
    private genericService: GenericService,
    private formBuilder: FormBuilder,
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
      this.saveCardLoader = false;
      this.spreedlySdk();
    });
    $('#cardError').hide();
  }

  spreedlySdk() {
    let self= this;
    Spreedly.init(this.envKey, {
      'numberEl': 'spreedly-number',
      'cvvEl': 'spreedly-cvv',
    });

    Spreedly.on('ready', function (frame) {
      Spreedly.setPlaceholder("number", "0000 0000 0000 0000");
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
      console.log("errors",errors)

      for (var i = 0; i < errors.length; i++) {
        var error = errors[i];
        var errorBorder = "2px solid #ff0000";
        if (error["attribute"]) {
          $("#error_message").text("error");
          if (error["attribute"] == 'month' || error["attribute"] == 'year') {
            $('.month_year_error').show();
            $("#month-year").css("border-bottom", "2px solid #ff0000");
          }
          $("#" + error["attribute"]).show();
          Spreedly.setStyle(error["attribute"], "border-bottom: 2px solid #ff0000;");
        } else if(error['status'] == 402){
          $('#cardError').show();
          let errorMessage = document.getElementById('cardErrorMessage');
          errorMessage.innerHTML = "You have entered wrong credit card details.";

        }else {
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
      //self.saveCardLoader=true;
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
      self.cardData =cardData;
      self.saveCard(cardData);
      console.log("this.cardData",self.cardData)
      
      /* $.ajax({
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
        }
      }); */
    });
  }

  closePopup() {
    $('#cardError').hide();
  }

  submitPaymentForm() {
    //this.saveCardLoader = true;
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
        options['year'] = '20'+values[1];
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
    console.log(this.cardData,"=================")

    /* setTimeout(() => {
      this.cardListChangeCount += this.cardListChangeCount + 1;
      this.emitCardListChange.emit(this.cardListChangeCount);
      this.saveCardLoader = false;
    }, 5000) */

  }

  saveCard(cardData) {
    //this.saveCardLoader = true;
    this.genericService.addCard(cardData).subscribe((res: any) => {
      //this.cardForm.reset();
      this.emitNewCard.emit(res);
      /* this.cardListChangeCount += this.cardListChangeCount + 1;
      this.emitCardListChange.emit(this.cardListChangeCount); */
      $('#main_loader').hide();
      $("#payment-form")[0].reset();
      Spreedly.reload();
    }, (error => {
      $('#main_loader').hide();
      if (error && error.status !== 406) {
        let errorMessage = document.getElementById('cardErrorMessage');
        $('#cardError').show();
        $('#new_card').show();
        errorMessage.innerHTML = error.message;
      }
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
    //this.saveCardLoader = false;
  }

  ngOnDestroy() {
    Spreedly.removeHandlers();
  }
}
