import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})

export class CartItemComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() cartItem;
  @Input() travelers: [];
  @Input() cartNumber: number;
  priceFluctuationAmount:number=0;


  constructor(
    public commonFunction: CommonFunction,
    private cd: ChangeDetectorRef,
    private cartService:CartService
  ) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['cartItem']) {
      this.cartItem = changes['cartItem'].currentValue;

      if(this.cartItem.old_module_info.selling_price!=this.cartItem.module_info.selling_price){
        this.priceFluctuationAmount = this.cartItem.module_info.selling_price - this.cartItem.old_module_info.selling_price;
      }
      this.cd.detectChanges();
    }
  }

  closePricePopup(){
    this.priceFluctuationAmount=0;
  }

  deleteCart(id){
    this.cartService.setCardId(id);
  }
  
}
