import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
declare var Spreedly: any;
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
declare var $: any;
import * as moment from 'moment';
import { GenericService } from '../../services/generic.service';
@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private formBuilder: FormBuilder
  ) { }
  @Input() showAddCardForm: boolean;
  // @ViewChild('cardAddForm') cardAddFormElement: ElementRef;
  @ViewChild('cardAddForm', { read: NgForm }) cardAddFormElement: any;
  disabledSavecardbutton: boolean = true;
  cardForm: FormGroup;
  submitted: boolean = false;
  token: string;
  cardError: string = "";
  cardData;

  ngOnInit() {

    // this.loadJquery();

    this.cardForm = this.formBuilder.group({
      name: ['', Validators.required],
      expiry: ['', Validators.required],
      payment_method_token: ['']
    });

    Spreedly.init('YNEdZFTwB1tRR4zwvcMIaUxZq3g', {
      'numberEl': 'spreedly-number',
      'cvvEl': 'spreedly-cvv',
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

    // Spreedly.on('paymentMethod', function (token, pmData) {
    //   // Set the token in the hidden form field
    //   var tokenField = document.getElementById('payment_method_token');
    //   tokenField.setAttribute('value', token);
    //   this.token = token;
    //   // console.log(this.cardForm.controls.payment_method_token.value);
    //   // this.cardForm.controls.payment_method_token.setValue(token);
    //   console.log("this.token", token);
    //   // console.log(pmData);
    //   let cardData = {
    //     card_type: pmData.card_type,
    //     card_holder_name: pmData.full_name,
    //     card_token: pmData.token,
    //     card_last_digit: pmData.last_four_digits
    //   };
    //   console.log(cardData);
    //   this.submitPaymentForm(cardData);
    //   var masterForm = document.getElementById('payment-form');
    //   // console.log(masterForm);
    //   // masterForm.submit();
    //   // this.saveCard(cardData);
    //   // this.cardAddFormElement.nativeElement.submit();
    // });
    // console.log('this.token outside', this.token);
    // Spreedly.on('errors', function (errors) {
    //   for (let i = 0; i < errors.length; i++) {
    //     let error = errors[i];
    //     console.log(error)
    //     if (typeof error.attribute !== 'undefined' && error.attribute === 'number') {

    //       this.cardError = error.message;
    //       console.log(this.cardError);
    //     }
    //   }
    // });
  }

  submitPaymentForm() {
    Spreedly.on('paymentMethod', function (token, pmData) {
      // Set the token in the hidden form field
      var tokenField = document.getElementById('payment_method_token');
      tokenField.setAttribute('value', token);
      this.token = token;
      // console.log(this.cardForm.controls.payment_method_token.value);
      // this.cardForm.controls.payment_method_token.setValue(token);
      console.log("this.token", token);
      // console.log(pmData);
      let cardData = {
        card_type: pmData.card_type,
        card_holder_name: pmData.full_name,
        card_token: pmData.token,
        card_last_digit: pmData.last_four_digits
      };
      console.log(cardData);
      this.cardData = cardData;
      var masterForm = document.getElementById('payment-form');
      // console.log(masterForm);
      // masterForm.submit();
      // this.saveCard(cardData);
      // this.cardAddFormElement.nativeElement.submit();
    });
    console.log('this.token outside', this.token);
    Spreedly.on('errors', function (errors) {
      for (let i = 0; i < errors.length; i++) {
        let error = errors[i];
        console.log(error)
        if (typeof error.attribute !== 'undefined' && error.attribute === 'number') {

          this.cardError = error.message;
          console.log(this.cardError);
        }
      }
    });

    this.cardError = '';
    this.submitted = true;
    var requiredFields = {};

    if (this.cardForm.invalid) {
      return;
    }
    let expiryDate = this.cardForm.value.expiry.split('/')


    requiredFields["full_name"] = this.cardForm.value.name;
    requiredFields["month"] = expiryDate[0];
    requiredFields["year"] = expiryDate[1];

    Spreedly.tokenizeCreditCard(requiredFields);
    this.saveCard(this.cardData);
  }

  saveCard(cardData) {
    this.genericService.saveCard(cardData).subscribe((res: any) => {
      console.log(res);
    }, (err => {

    })
    );
  }

  loadJquery() {
    $('#dobDate').dateRangePicker({
      autoClose: true,
      singleDate: true,
      showShortcuts: false,
      singleMonth: true,
      format: "MM/YYYY",
      monthSelect: true,
      yearSelect: true,
      startDate: moment().add(0, 'days').format("MM/YYYY"),
      extraClass: 'laytrip-datepicker'
    }).bind('datepicker-first-date-selected', function (event, obj) {
      this.getDateWithFormat(obj);
    }.bind(this));
  }

  getDateWithFormat(date) {
    console.log("date", date);
    this.cardForm.controls.expiry.setValue(moment(date.date1).format("MM/YYYY"));
  }
}
