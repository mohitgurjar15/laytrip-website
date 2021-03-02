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

  constructor(public commonFunction:CommonFunction) {
    this.installmentType= installmentType.en;
   }

  ngOnInit(): void { 
  }

  ngOnChanges(changes: SimpleChanges) {

    if(typeof changes['cartItem'].currentValue!='undefined'){
      this.cartItem = changes['cartItem'].currentValue;
      var loop=0;
      this.cartItem.cartInstallments.forEach(element => {
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
    }
  }
 
  setLoopNumber(loopNumber){
    // console.log(loopNumber)
    this.cartDueLoopNum = loopNumber;
    return loopNumber;
  }

  
}
