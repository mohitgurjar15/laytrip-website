import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonFunction } from '../../_helpers/common-function';
import { installmentType } from '../../_helpers/generic.helper';
declare var $: any;

@Component({
  selector: 'app-price-summary',
  templateUrl: './price-summary.component.html',
  styleUrls: ['./price-summary.component.scss']
})
export class PriceSummaryComponent implements OnInit {

  @Input() priceSummary;
  @Input() cartPrices = [];
  insatllmentAmount: number = 0;
  s3BucketUrl = environment.s3BucketUrl;
  installmentVartion: number = 0;
  installmentType;
  cartAlerts = [];
  flightCount: number = 0;

  constructor(
    private commonFunction: CommonFunction
  ) {
    this.installmentType = installmentType.en;
  }

  ngOnInit(): void {
    // console.log("priceSummary,", this.priceSummary)
  }

  closeModal() {
    $('#tax_fee_modal').modal('hide');
  }

  ngOnChanges(changes: SimpleChanges) {
    /* 
    if (typeof changes['cartPrices']!='undefined') {
      let isFlight = this.cartPrices.find(x=>{return x.type==='flight'});
      if(isFlight){
        this.flightCount=1;
      }
    } */


    try {
      let cartAlerts = localStorage.getItem("__alrt")
      if (cartAlerts) {
        this.cartAlerts = JSON.parse(cartAlerts)
      }
      else {
        this.cartAlerts = []
      }
    }
    catch (e) {
      this.cartAlerts = [];
    }
    this.insatllmentAmount = 0;
    if (typeof changes['priceSummary'].currentValue != 'undefined') {

      if ($('#flight_list_wrper').text() == "") {
        $('#flight_list_wrper').remove();
      }
      this.priceSummary = changes['priceSummary'].currentValue;
      if (typeof this.priceSummary.instalments !== 'undefined' && this.priceSummary.paymentType == 'instalment') {
        for (let i = 1; i < this.priceSummary.instalments.instalment_date.length; i++) {
          this.insatllmentAmount += this.priceSummary.instalments.instalment_date[i].instalment_amount
        }

        if (this.priceSummary.instalments.instalment_date.length > 2) {

          if (this.priceSummary.instalments.instalment_date[1].instalment_amount != this.priceSummary.instalments.instalment_date[this.priceSummary.instalments.instalment_date.length - 1].instalment_amount) {

            this.installmentVartion = this.priceSummary.instalments.instalment_date[this.priceSummary.instalments.instalment_date.length - 1].instalment_amount - this.priceSummary.instalments.instalment_date[1].instalment_amount;
            /* if(this.installmentVartion>0){
              let indexExist = this.cartAlerts.findIndex(x=>x.type=="installment_vartion");
              if(indexExist==-1){
                this.cartAlerts.push({
                  type : 'installment_vartion',
                  id : -1
                })
              }
              localStorage.setItem('__alrt',JSON.stringify(this.cartAlerts))
            } */
          }
        }
      }
    }
  }

  typeOf(value) {
    return typeof value;
  }

  closeInstallmentVartion(id) {
    /* try{
      let cartAlerts = localStorage.getItem("__alrt")
      if(cartAlerts){
        this.cartAlerts= JSON.parse(cartAlerts)
        let index = this.cartAlerts.findIndex(x=>x.id==id)
        this.cartAlerts.splice(index,1)
      }
      else{
        this.cartAlerts=[]
      }
    }
    catch(e){
      this.cartAlerts=[];
    }
    
    localStorage.setItem('__alrt',JSON.stringify(this.cartAlerts)) */
    this.installmentVartion = 0;

  }
}
