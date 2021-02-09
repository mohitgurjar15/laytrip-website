import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  selectedCart:number=0;
  @Input() carts;
  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.cartService.getCartDeletedItem.subscribe(index=>{
      console.log("ondexxxx",index)
      if(index>0){
        console.log(this.carts,"---------------",index)
        this.selectedCart=index-1
      }
    })
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log("I am in changes",changes)
    if (changes['carts']) {
      this.carts = changes['carts'].currentValue;
    }
  }

  selectCart(cartNumber) {
    this.cartService.setCardNumber(cartNumber);
  }
  
}
