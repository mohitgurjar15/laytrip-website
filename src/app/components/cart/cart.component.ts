import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewRef } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  selectedCart: number = 0;
  @Input() carts;
  constructor(
    private cartService: CartService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cartService.getCartDeletedItem.subscribe(index => {
      // console.log("ondexxxx", index)
      if (index > 0) {
        // console.log(this.carts, "---------------", index)
        this.selectedCart = index - 1;
        // this.carts = [...this.carts];
        // this.carts = Object.assign([], this.carts);
        // this.cd.detectChanges();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("I am in changes", changes)
    if (changes['carts']) {
      this.carts = changes['carts'].currentValue;
      this.cd.detectChanges();
    }
  }

  selectCart(cartNumber) {
    this.cartService.setCartNumber(cartNumber);
  }

}
