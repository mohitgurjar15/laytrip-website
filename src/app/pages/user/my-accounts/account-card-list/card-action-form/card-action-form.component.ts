import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import { GenericService } from '../../../../../services/generic.service';
import * as moment from 'moment';
declare var Spreedly: any;

@Component({
  selector: 'app-card-action-form',
  templateUrl: './card-action-form.component.html',
  styleUrls: ['./card-action-form.component.scss']
})
export class CardActionFormComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  cardActionForm: FormGroup;
  expiryMinDate = new Date();
  cardError = '';
  saveCardLoader = false;

  // mask = {
  //   guide: true,
  //   showMask: true,
  //   mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
  // };

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private genericService: GenericService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.cardActionForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      card_type: [''],
      card_name: ['', Validators.required],
      card_number: ['', Validators.required],
      card_expiry: [''],
      card_cvv: [''],
    });
  }

  spreedlySdk() {
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

  close() {
    this.activeModal.close();
  }

  onSubmit(formValue) {
    this.cardError = '';
    if (this.cardActionForm.invalid) {
      return;
    }
    const cardData = {
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      card_cvv: formValue.card_cvv,
      card_number: formValue.card_number,
      expiry: moment(formValue.card_expiry).format('MM/YYYY')
    };
    this.saveCard(cardData);
  }

  saveCard(cardData) {
    this.saveCardLoader = true;
    this.genericService.saveCard(cardData).subscribe((res: any) => {
      // this.cardForm.reset();
      this.saveCardLoader = false;
      const result = 'SAVE';
      this.activeModal.close(result);
    }, (error => {
      this.saveCardLoader = false;
      this.toastr.error(error.message, 'Error', { positionClass: 'toast-top-center', easeTime: 1000 });
    })
    );
  }

}
