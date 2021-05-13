import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunction } from 'src/app/_helpers/common-function';
import { CartService } from '../../../services/cart.service';
// import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  transaction_token: string;
  uuid: string;
  bookingRequest;
  carts;
  cartPrices;

  constructor(
    private route: ActivatedRoute,
    // private bookService: BookService,
    private router: Router,
    private cartService: CartService,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    this.transaction_token = this.route.snapshot.queryParamMap.get('transaction_token');
    this.cartService.getCartItems.subscribe(data => {
      if (data.length > 0) {
        this.carts = data;
      }
    })

    this.cartService.getCartPrice.subscribe(data => {
      this.cartPrices = data;
    })

    this.bookFlight();
  }

  bookFlight() {
    let queryParam: any = {};
    let bookingData: any = {
      uuid: this.uuid,
      transaction_token: this.transaction_token,
    };
    this.bookingRequest = JSON.parse(sessionStorage.getItem('__cbk'))
    this.bookingRequest.uuid = this.uuid;
    this.bookingRequest.transaction_token = this.transaction_token;
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      this.bookingRequest.referral_id = parms.utm_source ? parms.utm_source : '';
    }


    // this.bookService.bookFlight(bookingData).subscribe((res: any) => {
    //   console.log(res);
    //   if (res.status == 'complete') {
    //     this.router.navigateByUrl('/book/confirmation',{ skipLocationChange: false })
    //   } else {
    //     this.router.navigateByUrl('/book/failure',{ skipLocationChange: false })
    //   }
    // });

    this.cartService.bookCart(this.bookingRequest).subscribe((result: any) => {
      let successItem = result.carts.filter(cart => {
        if (cart.status == 1) {
          return { cart_id: cart.id }
        }
      });
      let failedItem = result.carts.filter(cart => {
        if (cart.status == 2) {
          return { car_id: cart.id }
        }
      });

      let index
      for (let item of successItem) {
        index = this.carts.findIndex(x => x.id == item.cart_id)
        this.carts.splice(index, 1)
        this.cartPrices.splice(index, 1)
      }
      this.cartService.setCartItems(this.carts);
      this.cartService.setCartPrices(this.cartPrices)

      localStorage.setItem('$crt', failedItem.length || 0);
      if (this.commonFunction.isRefferal()) {
        let parms = this.commonFunction.getRefferalParms();
        queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
        queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        this.router.navigate([`/cart/confirm/${result.laytripCartId}`], { queryParams: queryParam })
      } else {
        this.router.navigate([`/cart/confirm/${result.laytripCartId}`])
      }
    })
  }
}
