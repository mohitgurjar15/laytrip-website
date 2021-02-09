import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewRef } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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

  ngOnInit() {
    this.cartService.getCartDeletedItem.subscribe(index => {
      if (index > 0) {
        this.selectedCart = index - 1;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['carts']) {
      this.carts = changes['carts'].currentValue;
    }
  }

  selectCart(cartNumber) {
    this.cartService.setCartNumber(cartNumber);
  }

}
