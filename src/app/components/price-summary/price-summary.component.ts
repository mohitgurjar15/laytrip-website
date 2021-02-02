import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
      }
    }
  }

  typeOf(value) {
    return typeof value;
  }

}
