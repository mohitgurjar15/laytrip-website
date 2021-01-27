import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
declare var Spreedly: any;
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCardComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }
  @Input() showAddCardForm: boolean;
  @Output() emitNewCard = new EventEmitter();
  // @ViewChild('cardAddForm') cardAddFormElement: ElementRef;
  //@ViewChild('cardAddForm', { read: NgForm }) cardAddFormElement: any;
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

  ngOnInit() {
    this.cardForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      card_cvv: ['', [Validators.required, Validators.maxLength(4)]],
      card_number: ['', [Validators.required, Validators.maxLength(20)]],
      expiry: ['', Validators.required]
    });
    this.spreedlySdk();
  }

  spreedlySdk() {
    Spreedly.init('YNEdZFTwB1tRR4zwvcMIaUxZq3g', {
      'numberEl': 'spreedly-number',
      'cvvEl': 'spreedly-cvv',
    });

    Spreedly.on('ready', function (frame) {
      Spreedly.setPlaceholder("number", "000 000 000 000 0000");
      Spreedly.setPlaceholder("cvv", "CVV");
      Spreedly.setFieldType("cvv", "text");
      Spreedly.setFieldType('number', 'text');
      //Spreedly.transferFocus("number");
      Spreedly.setFieldType('cvv', 'text');
      Spreedly.setNumberFormat('maskedFormat');
      Spreedly.setStyle('number', 'width: 100%; border-radius: none; border-bottom: 2px solid #D6D6D6; padding: .65em .5em; font-size: 14px;');
      Spreedly.setStyle('cvv', 'width: 100%; border-radius: none; border-bottom: 2px solid #D6D6D6; padding: .65em .5em; font-size: 14px;');
    });

    Spreedly.on('errors', function (errors) {
      var messageEl = document.getElementById('errors');
      var errorBorder = "1px solid red";
      for (var i = 0; i < errors.length; i++) {
        var error = errors[i];
        if (error["attribute"]) {
          var masterFormElement = document.getElementById(error["attribute"]);
          if (masterFormElement) {
            masterFormElement.style.border = errorBorder
          } else {
            Spreedly.setStyle(error["attribute"], "border: " + errorBorder + ";");
          }
        }
        messageEl.innerHTML += error["message"] + "<br/>";
      }
    });

    Spreedly.on('fieldEvent', function (name, event, activeElement, inputData) {
      if (event == 'input') {
        if (inputData["validCvv"]) {
          Spreedly.setStyle('cvv', "background-color: #e8f0fe;");
        } else {
          Spreedly.setStyle('cvv', "background-color: #FFFFFF;");
        }
        if (inputData["validNumber"]) {
          Spreedly.setStyle('number', "background-color: #e8f0fe;");
        } else {
          Spreedly.setStyle('number', "background-color: #FFFFFF;");
        }
      }
    });

    Spreedly.on('paymentMethod', function (token, pmData) {
      var tokenField = document.getElementById("payment_method_token");
      tokenField.setAttribute("value", token);
      this.token = token;

      let cardData = {
        card_type: pmData.card_type,
        card_holder_name: pmData.full_name,
        card_token: pmData.token,
        card_last_digit: pmData.last_four_digits
      };
      $.ajax({
        url: `${environment.apiUrl}v1/payment`,
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('_lay_sess')}` },
        data: cardData,
        success: function (obj) {
          // this.emitNewCard.emit(obj);

          let s3BucketUrl = 'http://d2q1prebf1m2s9.cloudfront.net/';
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

          $('#card-list').append(`<div class="accordion_cardss anchor-tag" id="card_list_accodrio">
          <div class="card">
          <div class="card-header">
              <a data-toggle="collapse" data-parent="#accordion" href="#card" aria-expanded="false"
                  aria-controls="collapse11">
                  <span class="heade_wrps">
                      <img [src]="${cardObject[obj.cardType]}" alt="Card icon" /> 
                      ${obj.cardType} ending in ${obj.cardDigits}
                  </span>
              </a>
          </div>
          <div id="card" class="collapse" data-parent="#accordion">
              <div class="card-body">
                  <div class="form-row">
                      <div class="col col-lg-4">
                          <div class="card_headbar">
                              Name on Card
                          </div>
                          <div class="card_texter">
                              ${obj.cardHolderName}
                          </div>
                      </div>
                      <div class="col col-lg-4">
                          <div class="card_headbar">
                              Billing Address
                          </div>
                          <div class="card_texter">
                              Victor Pacheco <span> Via della Libertà #19 Milano, 33098 Italia 3478691146</span>
                          </div>
                      </div>
                      <div class="col col-lg-2">
                          <div class="card_headbar">
                              Expires
                          </div>
                          <div class="card_texter">
                              09/2023
                          </div>
                      </div>
                      <div class="col col-lg-2">
                          <div class="save_btn_wrps">
                              <a href="javascript:void(0);">Delete</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div></div>`);
          $("#payment-form")[0].reset();
          Spreedly.reload();
          // window.location.reload();
        },
        error: function (error) {
          console.log('error:', error);
          // this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
        }
      });

      // For demonstration purposes just display the token
      // var messageEl = document.getElementById('message');
      // messageEl.innerHTML = "Success! The returned payment method token is: " + token;
    });
  }

  submitPaymentForm() {
    this.spinner.show();
    var normalBorder = "1px solid #ccc";
    var paymentMethodFields = ['full_name', 'month-year'],
      options = {};
    for (var i = 0; i < paymentMethodFields.length; i++) {
      var field = paymentMethodFields[i];

      // Reset existing styles (to clear previous errors)
      var fieldEl = (<HTMLInputElement>document.getElementById(field));
      fieldEl.style.border = normalBorder;

      // add value to options
      // options[field] = fieldEl.value;

      if (fieldEl.id === 'month-year') {
        let value = fieldEl.value;
        let values = value.split("/");
        options['month'] = values[0];
        options['year'] = values[1];
      }
      else {
        // add value to options
        options[field] = fieldEl.value
      }
      if (options[field]) {
        this.spinner.hide();
      }
    }

    // Reset frame styles
    Spreedly.setStyle('number', "border: " + normalBorder + ";");
    Spreedly.setStyle('cvv', "border: " + normalBorder + ";");

    // Reset previous messages
    document.getElementById('errors').innerHTML = "";
    document.getElementById('message').innerHTML = "";

    // Tokenize!
    Spreedly.tokenizeCreditCard(options);
    // this.saveCard(cardData);
  }

  saveCard(cardData) {
    this.saveCardLoader = true;
    this.genericService.saveCard(cardData).subscribe((res: any) => {
      //this.cardForm.reset();
      this.emitNewCard.emit(res);
      this.saveCardLoader = false;
    }, (error => {
      this.saveCardLoader = false;
      this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
    })
    );
  }

  expiryDateUpdate(event) {

  }
}
