import { Component, OnInit, Input } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-progress',
  templateUrl: './checkout-progress.component.html',
  styleUrls: ['./checkout-progress.component.scss']
})
export class CheckoutProgressComponent implements OnInit {

  @Input() progressStep;
  progressArray = [];
  s3BucketUrl = environment.s3BucketUrl;
  // CART VARIABLE
  cartItemsCount;

  constructor(
    private cartService: CartService,
  ) { }

  ngOnInit() {
    //console.log("progressStep",this.progressStep, Object.values(this.progressStep))
    // GET CART LIST FROM GENERIC SERVICE
    this.cartService.getCartItems.subscribe((res: any) => {
      console.log('RES::', res);
      console.log(JSON.parse(localStorage.getItem('$crt')));
      this.cartItemsCount = JSON.parse(localStorage.getItem('$crt')) | 0;
    });
  }

}
