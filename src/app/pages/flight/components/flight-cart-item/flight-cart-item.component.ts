import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { environment } from '.././../../../../environments/environment';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../services/generic.service';
import { CartService } from '../../../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-flight-cart-item',
  templateUrl: './flight-cart-item.component.html',
  styleUrls: ['./flight-cart-item.component.scss']
})
export class FlightCartItemComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() cartItem;
  @Input() travelers: [];
  @Input() cartNumber;
  // CART VARIABLE
  cartItemsCount;
  cartItems;

  constructor(
    private commonFunction: CommonFunction,
    private genericService: GenericService,
    private cartService: CartService,
    public cd: ChangeDetectorRef,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    // this.getCartList();
  }

  getCartList() {
    this.cartService.getCartItems.subscribe((res: any) => {
      this.cartItems.push(res);
    });
  }

  deleteCart(id) {
    
    this.spinner.show();
    this.cartService.deleteCartItem(id).subscribe((res: any) => {
      this.spinner.hide();
      this.cartItems.splice(id, 1);
      this.cartService.setCartItems(this.cartItems);
      localStorage.setItem('$crt', JSON.stringify(this.cartItems.length));
    }, error => {
      console.log(error);
    });
  }

}
