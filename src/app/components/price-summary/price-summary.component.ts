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
  userLang: string = "en";
  
  constructor(
    private commonFunction: CommonFunction,
  ) {
    // Author: xavier | 2021/7/28
    // Description: To support localized installment types
    this.userLang = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    this.installmentType = installmentType;
  }

  ngOnInit(): void {
    // console.log("priceSummary,", this.priceSummary)
  }

  closeModal() {
    $('#tax_fee_modal').modal('hide');
  }

  ngOnChanges(changes: SimpleChanges) {
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

        /* if (this.priceSummary.instalments.instalment_date.length > 2) {

          if (this.priceSummary.instalments.instalment_date[1].instalment_amount != this.priceSummary.instalments.instalment_date[this.priceSummary.instalments.instalment_date.length - 1].instalment_amount) {

            this.installmentVartion = this.priceSummary.instalments.instalment_date[this.priceSummary.instalments.instalment_date.length - 1].instalment_amount - this.priceSummary.instalments.instalment_date[1].instalment_amount;
          }
        } */
      }
    }
  }

  typeOf(value) {
    return typeof value;
  }
}
