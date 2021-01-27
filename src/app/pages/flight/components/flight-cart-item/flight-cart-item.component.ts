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
    this.getCartList();
  }

  getCartList() {
    // GET CART LIST FROM GENERIC SERVICE
    this.cartService.getCartList().subscribe((res: any) => {
      if (res) {
        // SET CART ITEMS IN CART SERVICE
        this.cartService.setCartItems(res.data);
        this.cartItems = res.data;
        localStorage.setItem('$crt', JSON.stringify(this.cartItems.length));
        if (res.count) {
          this.cartItemsCount = res.count;
        }
        this.cd.detectChanges();
      }
    }, (error) => {
      if (error && error.status === 404) {
        this.cartItems = [];
      }
    });
  }

  deleteCart(id) {
    this.spinner.show();
    this.cartService.deleteCartItem(id).subscribe((res: any) => {
      this.spinner.hide();
      this.cartItems.splice(id, 1);
      let queryParams = {};
      let urlData = this.commonFunction.decodeUrl(this.router.url);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([`${urlData.url}`], { queryParams: queryParams, queryParamsHandling: 'merge' });
      });
      localStorage.removeItem('$crt');
      this.cartItemsCount = '';
      this.cartService.setCartItems(this.cartItemsCount);
    }, error => {
      console.log(error);
    });
  }

}
