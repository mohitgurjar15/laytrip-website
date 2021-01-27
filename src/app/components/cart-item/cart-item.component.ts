import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})

export class CartItemComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() cartItem;
  @Input() travelers: [];
  @Input() cartNumber: number;
  

  constructor(
    public commonFunction: CommonFunction
  ) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cartItem']) {
      this.cartItem = changes['cartItem'].currentValue;
    }
  }
  random() {
    return Math.floor((Math.random() * 100) + 1);
  }
}
