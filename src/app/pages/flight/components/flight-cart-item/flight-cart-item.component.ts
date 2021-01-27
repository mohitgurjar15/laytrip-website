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
  totalTraveler = {
    adult_count: 0,
    child_count: 0,
    infant_count: 0
  };
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
    try {
      let _itinerary: any = sessionStorage.getItem("_itinerary");
      _itinerary = JSON.parse(_itinerary);
      this.totalTraveler.adult_count = Number(_itinerary.adult);
      this.totalTraveler.child_count = Number(_itinerary.child);
      this.totalTraveler.infant_count = Number(_itinerary.infant);
    }
    catch (e) {
      console.log("Error", e)
    }
  }

  getCartList() {
    this.cartService.getCartItems.subscribe((res: any) => {
      this.cartItems.push(res);
    });
  }

  deleteCart(id) {
    this.cartItems = this.cartItems.splice(id, 1);
    console.log(this.cartItems);
    this.cartService.setCartItems(this.cartItems);
    localStorage.setItem('$crt', JSON.stringify(this.cartItems.length));
    // this.spinner.show();
    // this.cartService.deleteCartItem(id).subscribe((res: any) => {
    //   this.spinner.hide();
    //   this.cartItems.splice(id, 1);
    //   let queryParams = {};
    //   let urlData = this.commonFunction.decodeUrl(this.router.url);
    //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     this.router.navigate([`${urlData.url}`], { queryParams: queryParams, queryParamsHandling: 'merge' });
    //   });
    //   localStorage.removeItem('$crt');
    //   this.cartItemsCount = '';
    //   this.cartService.setCartItems(this.cartItemsCount);
    // }, error => {
    //   console.log(error);
    // });
  }

}
