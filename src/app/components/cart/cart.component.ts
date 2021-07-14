import {  ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { CommonFunction } from '../../_helpers/common-function';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  selectedCart: number = 0;
  @Input() carts;
  @Output() ismaxCartAdded = new EventEmitter();
  totalCarts: any = localStorage.getItem('$crt') ? localStorage.getItem('$crt') : 0;
  constructor(
    private cartService: CartService,
    public cd: ChangeDetectorRef,
    public commonFunction: CommonFunction,
    public router: Router    
  ) { }

  ngOnInit() {
    this.cartService.getCartDeletedItem.subscribe(index => {
      if (index > 0) {
        this.selectedCart = index - 1;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['carts']) {
      this.carts = changes['carts'].currentValue;
      this.cd.detectChanges();
    }
  }

  selectCart(cartNumber) {
    this.selectedCart = cartNumber;
    this.cartService.setCartNumber(cartNumber);
  }
  
  saveAndSearch() {
    let totalCarts: any = localStorage.getItem('$crt');

    if (totalCarts == 10) {
      this.ismaxCartAdded.emit(true);
    } else {
      this.ismaxCartAdded.emit(false);
      if (this.commonFunction.isRefferal()) {
        var parms = this.commonFunction.getRefferalParms();
        var queryParams: any = {};
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if(parms.utm_medium){
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if(parms.utm_campaign){
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate(['/'], { queryParams:queryParams });
      } else {
        this.router.navigate(['/']);
      }
    }
  }

}
