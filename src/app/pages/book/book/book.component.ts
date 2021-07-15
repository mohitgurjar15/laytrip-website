import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunction } from 'src/app/_helpers/common-function';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  transaction_token: string;
  auth_url: string;
  uuid: string;
  bookingRequest;
  carts;
  cartPrices;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    this.transaction_token = this.route.snapshot.queryParamMap.get('transaction_token');
    this.auth_url = this.route.snapshot.queryParamMap.get('auth_url') ? this.route.snapshot.queryParamMap.get('auth_url') : '';
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
    let bookingData: any = {
      uuid: this.uuid,
      transaction_token: this.transaction_token,
    };
    this.bookingRequest = JSON.parse(sessionStorage.getItem('__cbk'))
    this.bookingRequest.uuid = this.uuid;
    this.bookingRequest.transaction_token = this.transaction_token;
    this.bookingRequest.auth_url = this.auth_url;//'Payment-authorise-card-1623906251061_fde84f87-53e6-407a-8012-0a9d808d52c1.json'
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();      
      this.bookingRequest.referral_id = parms.utm_source ? parms.utm_source : '';
    }

    this.cartService.verifyAuth(this.transaction_token).subscribe((authRes: any) => {

      if(authRes.success==true){
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
          localStorage.setItem('$crt', failedItem.length || 0);
          if (this.commonFunction.isRefferal()) {
            let parms = this.commonFunction.getRefferalParms();
            var queryParams :any = {};
            queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
            if (parms.utm_medium) {
                queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
            }
            if (parms.utm_campaign) {
                queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
            }
            this.router.navigate([`/cart/confirm/${result.laytripCartId}`], { queryParams: queryParams })
          } else {
            this.router.navigate([`/cart/confirm/${result.laytripCartId}`])
          }
        })
      }
      else{
        if (this.commonFunction.isRefferal()) {
          let parms = this.commonFunction.getRefferalParms();
          var queryParams :any = {};
          queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
          if (parms.utm_medium) {
              queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
          }
          if (parms.utm_campaign) {
              queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
          }
          this.router.navigate([`/cart/checkout`], { queryParams: queryParams })
        } else {
          this.router.navigate([`/cart/checkout`])
        }
      }
      
    })    

    
  }
}
