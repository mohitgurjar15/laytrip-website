import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var Spreedly: any;
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
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
  @Output() emitNewCard = new EventEmitter()
  // @ViewChild('cardAddForm') cardAddFormElement: ElementRef;
  //@ViewChild('cardAddForm', { read: NgForm }) cardAddFormElement: any;
  disabledSavecardbutton: boolean = true;
  cardForm: FormGroup;
  submitted: boolean = false;
  token: string;
  cardError: string = "";
  cardData;
  locale = {
    format: 'MM/YYYY',
    displayFormat: 'MM/YYYY'
  };

  ngOnInit() {

    this.cardForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      card_cvv: ['', Validators.required],
      card_number: ['', Validators.required],
      expiry: ['', Validators.required]
    });

    
    
  }

  spreedlySdk(){
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
      this.saveCard(cardData)
      //this.submitPaymentForm(cardData);
      //var masterForm = document.getElementById('payment-form') as HTMLFormElement;
      // console.log(masterForm);
      //masterForm.submit();
      // this.saveCard(cardData);
      // this.cardAddFormElement.nativeElement.submit();
    });
  }

  submitPaymentForm() {

    this.cardError = '';
    this.submitted = true;
    let data={"id":"5e10afbf-537a-4f25-b5e1-c8fbb618cd5f","paymentGatewayId":3,"userId":"b6103e59-b12a-4830-9318-36479dc81d8c","cardHolderName":"Suresh Suthar","cardDigits":"4444","cardToken":"DLphr2MZZOJltru1ifhy3EFBi9I","cardType":"master","createdDate":"2020-09-13T09:51:08.958Z","cardMetaData":null,"status":true,"isDeleted":false};
    this.emitNewCard.emit(data);
    console.log("yes")
    if (this.cardForm.invalid) {
      return;
    } 
    console.log(moment(this.cardForm.controls.expiry.value.startDate).format('MM/YYYY'))
    let cardData={
      first_name: this.cardForm.controls.first_name.value,
      last_name: this.cardForm.controls.last_name.value,
      card_cvv: this.cardForm.controls.card_cvv.value,
      card_number: this.cardForm.controls.card_number.value,
      expiry : moment(this.cardForm.controls.expiry.value.startDate).format('MM/YYYY')
    }
    //this.saveCard(cardData);
  }

  saveCard(cardData) {
    this.genericService.saveCard(cardData).subscribe((res: any) => {
      console.log(res);
      this.emitNewCard.emit(res);
    }, (err => {
      
    })
    );
  }

  expiryDateUpdate(event){

  }
}
