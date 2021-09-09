import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import {installmentType} from '../../../../../_helpers/generic.helper';

@Component({
  selector: 'app-cart-price-summary',
  templateUrl: './cart-price-summary.component.html',
  styleUrls: ['./cart-price-summary.component.scss']
})
export class CartPriceSummaryComponent implements OnInit {

  @Input() cartItem: any = {}; 
  cartDueLoopNum=0;
  installmentType;
  totalInstallmentAmount : any = 0;
  userLang: string = "en";

  constructor(public commonFunction:CommonFunction,
    private decimalPipe: DecimalPipe
    ) {
    // Author: xavier | 2021/7/28
    // Description: Translates installment type
    this.userLang = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
    this.installmentType = installmentType;
   }

  ngOnInit(): void { 
  }

  ngOnChanges(changes: SimpleChanges) {

    if(typeof changes['cartItem'].currentValue!='undefined'){
      this.cartItem = changes['cartItem'].currentValue;
      var loop=0;
      var totalInstallment =0;
      
      this.cartItem.cartInstallments.forEach(function(element,i) {
        if(i != 0){
          totalInstallment  += element.amount;
        }
        if(element.instalmentStatus == 0){
          loop += 1;
          if(loop == 1){
            element.dueInstallment=1;
          }else {
            element.dueInstallment=0;
          }
        } else {
          element.dueInstallment=0;
        }
      });
      this.totalInstallmentAmount = totalInstallment;
    }

  }
 
  setLoopNumber(loopNumber){
    this.cartDueLoopNum = loopNumber;
    return loopNumber;
  }

  beforeDesimal(value){
    value = this.transformDecimal(value)
    return (value.toString().split(".")[0]) == 0 ? "00" : (value.toString().split(".")[0])
  }

  afterDesimal(value){
    value = this.transformDecimal(value)
    return (value.toString().split(".")[1]) == 0 ? "00" : (value.toString().split(".")[1])
  }

  transformDecimal(num) {
    return this.decimalPipe.transform(num, '1.2-2');
  }
  
}
