import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonFunction } from '../../_helpers/common-function';

@Component({
  selector: 'app-price-summary',
  templateUrl: './price-summary.component.html',
  styleUrls: ['./price-summary.component.scss']
})
export class PriceSummaryComponent implements OnInit {

  @Input() priceSummary;
  @Input() cartPrices=[];
  insatllmentAmount:number=0;
  s3BucketUrl=environment.s3BucketUrl;
  installmentVartion:number=0;
  
  constructor(
    private commonFunction:CommonFunction
  ) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['priceSummary'].currentValue!='undefined') {
      this.priceSummary = changes['priceSummary'].currentValue;
      if(typeof this.priceSummary.instalments!=='undefined' && this.priceSummary.paymentType=='instalment'){
       for(let i =1 ; i<this.priceSummary.instalments.instalment_date.length; i++){
          this.insatllmentAmount += this.priceSummary.instalments.instalment_date[i].instalment_amount
       }

       if(this.priceSummary.instalments.instalment_date.length>2){

          if(this.priceSummary.instalments.instalment_date[1].instalment_amount!=this.priceSummary.instalments.instalment_date[this.priceSummary.instalments.instalment_date.length-1].instalment_amount){
            this.installmentVartion = this.priceSummary.instalments.instalment_date[this.priceSummary.instalments.instalment_date.length-1].instalment_amount-this.priceSummary.instalments.instalment_date[1].instalment_amount;
          }
          console.log(this.installmentVartion,"this.instllamntVartion")
       }
      }
    }
  }

  typeOf(value) {
    return typeof value;
  }

  closeInstallmentVartion(){
    this.installmentVartion=0;
  }
}
