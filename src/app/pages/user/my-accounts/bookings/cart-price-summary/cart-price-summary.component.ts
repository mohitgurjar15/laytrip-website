import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from 'src/app/_helpers/common-function';

@Component({
  selector: 'app-cart-price-summary',
  templateUrl: './cart-price-summary.component.html',
  styleUrls: ['./cart-price-summary.component.scss']
})
export class CartPriceSummaryComponent implements OnInit {

  @Input() cartItem = {};

  constructor(public commonFunction:CommonFunction) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

    if(typeof changes['cartItem'].currentValue!='undefined'){
      this.cartItem=changes['cartItem'].currentValue;
      // console.log("cartItem=====>",this.cartItem)
    }
  }
}
