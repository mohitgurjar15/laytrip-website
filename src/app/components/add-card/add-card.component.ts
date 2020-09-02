import { Component, OnInit, Input } from '@angular/core';
declare var Spreedly: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private genericService:GenericService,
    private formBuilder: FormBuilder
  ) { }
  @Input() showAddCardForm:boolean;
  disabledSavecardbutton:boolean=true;
  cardForm: FormGroup;
  submitted:boolean=false;
  card_number:string;
  cardError:string="";

  ngOnInit() {

    this.loadJquery();

    this.cardForm = this.formBuilder.group({
      name: ['', Validators.required],
      expiry: ['', Validators.required]
    });

    Spreedly.init("YNEdZFTwB1tRR4zwvcMIaUxZq3g", {
      "numberEl": "spreedly-number",
      "cvvEl": "spreedly-cvv"
    });

    Spreedly.on("ready", function () {
      this.disabledSavecardbutton=false;
      console.log("this.disabledSavecardbutton",this.disabledSavecardbutton)
    });
    
    Spreedly.on('paymentMethod', function(token, pmData) {
  
      // Set the token in the hidden form field
      var tokenField = document.getElementById("payment_method_token");
      tokenField.setAttribute("value", token);
      let cardData={
          card_type: pmData.card_type,
          card_holder_name: pmData.full_name,
          card_token: pmData.token,
          card_last_digit: pmData.last_four_digits
      }
      this.saveCard(cardData)
      
    });

    Spreedly.on('errors', function(errors) {
      for (let i=0; i < errors.length; i++) {
        let error = errors[i];
        console.log(error)
        if(typeof error.attribute!='undefined' && error.attribute=='number'){

          this.cardError=error.message;
          console.log(this.cardError)
        }
        
      };
    });
  }

  submitPaymentForm() {
    this.cardError="";
    this.submitted=true;
    var requiredFields = {};
    console.log(this.cardForm.value)
    // Get required, non-sensitive, values from host page

    if (this.cardForm.invalid) {
      return;
    }
    let expiryDate = this.cardForm.value.expiry.split('/')


    requiredFields["full_name"] = this.cardForm.value.name;
    requiredFields["month"] = expiryDate[0];
    requiredFields["year"] = expiryDate[1];
  
     Spreedly.tokenizeCreditCard(requiredFields);
  }

  saveCard(cardData){
    this.genericService.saveCard(cardData).subscribe((res:any)=>{

      console.log(res);
    },(err=>{

    })
    )
  }
  
  loadJquery(){
    $('#expiry_date').dateRangePicker({
      autoClose: true,
      singleDate : true,
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
  
  getDateWithFormat(date){
    console.log("date",date)
    this.cardForm.controls.expiry.setValue(moment(date.date1).format("MM/YYYY"));
  }
}
