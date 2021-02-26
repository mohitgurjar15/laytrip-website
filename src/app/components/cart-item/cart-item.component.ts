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
  cartAlerts=[];
  origin:string='';


  constructor(
    public commonFunction: CommonFunction,
    private cd: ChangeDetectorRef,
    private cartService:CartService
  ) {
   
   }

  ngOnInit(): void {
    this.origin = window.location.pathname;
  }

  ngOnChanges(changes: SimpleChanges) {

    try{
      let cartAlerts = localStorage.getItem("__alrt")
      if(cartAlerts){
        this.cartAlerts= JSON.parse(cartAlerts)
      }
      else{
        this.cartAlerts=[]
      }
    }
    catch(e){
      this.cartAlerts=[];
    }

    if (changes && changes['cartItem']) {
      this.cartItem = changes['cartItem'].currentValue;

      if(this.cartItem.old_module_info.selling_price!=this.cartItem.module_info.selling_price){
        this.priceFluctuationAmount = this.cartItem.module_info.selling_price - this.cartItem.old_module_info.selling_price;
        let indexExist = this.cartAlerts.findIndex(x=>x.id==this.cartItem.id);

        if(indexExist==-1){
          this.cartAlerts.push({
            type : 'price_change',
            id : this.cartItem.id
          })
          localStorage.setItem('__alrt',JSON.stringify(this.cartAlerts))
        }
        
      }
      this.cd.detectChanges();
    }
  }

  closePricePopup(id){
    try{
      let cartAlerts = localStorage.getItem("__alrt")
      if(cartAlerts){
        this.cartAlerts= JSON.parse(cartAlerts)
        let index = this.cartAlerts.findIndex(x=>x.id==id)
        this.cartAlerts.splice(index,1)
      }
      else{
        this.cartAlerts=[]
      }
    }
    catch(e){
      this.cartAlerts=[];
    }
    localStorage.setItem('__alrt',JSON.stringify(this.cartAlerts))
    this.priceFluctuationAmount=0;
  }

  deleteCart(id){
    this.cartService.setCardId(id);
  }
  
}
