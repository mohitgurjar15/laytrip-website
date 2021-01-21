import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var Spreedly: any;
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
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
      Spreedly.transferFocus("number");
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
        // if (inputData["cvvLength"] === 3) {
        //   Spreedly.setStyle('cvv', "background-color: #e8f0fe;");
        // } else {
        //   Spreedly.setStyle('cvv', "background-color: #FFFFFF;");
        // }
        // if (inputData["cvvLength"] === 4) {
        //   Spreedly.setStyle('cvv', "background-color: #e8f0fe;");
        // } else {
        //   Spreedly.setStyle('cvv', "background-color: #FFFFFF;");
        // }
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
        headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmRlODRmODctNTNlNi00MDdhLTgwMTItMGE5ZDgwOGQ1MmMxIiwiZW1haWwiOiJzdXJlc2hAaXRvbmVjbGljay5jb20iLCJ1c2VybmFtZSI6InN1cmVzaCBzdXRoYXIiLCJmaXJzdE5hbWUiOiJzdXJlc2giLCJwaG9uZSI6Ijk4Mzg0Mjc4MjMiLCJtaWRkbGVOYW1lIjoiIiwibGFzdE5hbWUiOiJzdXRoYXIiLCJzYWx0IjoiJDJiJDEwJFR5czkzeEtQbHlwREhpSWlINzRGbGUiLCJwcm9maWxlUGljIjoiaHR0cDovL3N0YWdpbmcubGF5dHJpcC5jb206NDA0MC9wcm9maWxlL3VzZXItMTAzOGIuanBlZyIsInJvbGVJZCI6NiwiY3JlYXRlZERhdGUiOiIyMDIxLTAxLTEzVDExOjQ5OjI3LjI4OFoiLCJzb2NpYWxBY2NvdW50SWQiOiIiLCJpYXQiOjE2MTEwNDUzNTUsImV4cCI6MzE4Nzg0NTM1NX0.vIFtwzxVUu-BqE8dTlfXcBvrX2jE01X3EIm99CiVh2M' },
        data: cardData,
        success: function (obj) {
          console.log('card:::::', obj);
          // this.emitNewCard.emit(obj);
          $('#accordion-card').append(`<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#collapseOne"> ${obj.cardType} Card ****${obj.cardDigits} </a></div><div class="collapse show" data-parent="#accordion" id="collapseOne"><div  class="card-body"> ${obj.cardHolderName} </div></div></div>`);
          $("#payment-form")[0].reset();
          Spreedly.init('YNEdZFTwB1tRR4zwvcMIaUxZq3g', {
            'numberEl': 'spreedly-number',
            'cvvEl': 'spreedly-cvv',
          });
        },
        error: function (error) {
          console.log('card:::::', error);
          // this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
        }
      });

      // For demonstration purposes just display the token
      // var messageEl = document.getElementById('message');
      // messageEl.innerHTML = "Success! The returned payment method token is: " + token;
    });
  }

  submitPaymentForm() {
    var normalBorder = "1px solid #ccc";
    var paymentMethodFields = ['full_name', 'month-year'],
      options = {};
    for (var i = 0; i < paymentMethodFields.length; i++) {
      var field = paymentMethodFields[i];

      // Reset existing styles (to clear previous errors)
      var fieldEl = (<HTMLInputElement>document.getElementById(field));
      fieldEl.style.border = normalBorder;

      // add value to options
      options[field] = fieldEl.value;
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
