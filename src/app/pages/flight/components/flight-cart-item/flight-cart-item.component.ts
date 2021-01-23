import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { environment } from '.././../../../../environments/environment';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../services/generic.service';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-flight-cart-item',
  templateUrl: './flight-cart-item.component.html',
  styleUrls: ['./flight-cart-item.component.scss']
})
export class FlightCartItemComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() cartItem;
  @Input() travelers:[];
  @Input() cartNumber;
  totalTraveler={
    adult_count :0,
    child_count :0,
    infant_count:0
  };
  // CART VARIABLE
  cartItemsCount;
  cartItems;

  constructor(
    private commonFunction: CommonFunction,
    private genericService: GenericService,
    private cartService: CartService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getCartList();
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
    // GET CART LIST FROM GENERIC SERVICE
    this.cartService.getCartList().subscribe((res: any) => {
      if (res) {
        // SET CART ITEMS IN CART SERVICE
        this.cartService.setCartItems(res.data);
        this.cartItems = res.data;
        console.log(this.cartItems);
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
    this.cartService.deleteCartItem(id).subscribe((res: any) => {
      this.cartItems.splice(id, 1);
      // this.cartService.setCartItems(this.cartItems);
      this.ngOnInit();
    }, error => {
      console.log(error);
    });
  }

}
