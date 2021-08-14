import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { environment } from '.././../../../../environments/environment';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../services/generic.service';
import { CartService } from '../../../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCartitemConfirmationPopupComponent, MODAL_TYPE } from '../../../../components/delete-cartitem-confirmation-popup/delete-cartitem-confirmation-popup.component';
import { TranslateService } from '@ngx-translate/core';

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
  modalRef;

  constructor(
    private commonFunction: CommonFunction,
    private genericService: GenericService,
    private cartService: CartService,
    public cd: ChangeDetectorRef,
    public router: Router,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getCartList();

    // Author: xavier | 2021/8/13
    // Description: Translate cabin class for each flight rout
    if(this.cartItem.module_info != null) {
      for(let i: number = 0; i < this.cartItem.module_info.routes.length; i++) {
        const stops = this.cartItem.module_info.routes[i].stops;
        for(let j: number = 0; j < stops.length; j++) {
          const key: string = stops[j].cabin_class.toLowerCase() + "_class";
          this.translate.
              get(key).
              subscribe((res: string) => stops[j].cabin_class = res);
        }
      }
    }
  }

  getCartList() {
    this.cartService.getCartItems.subscribe(cartItems => {
      this.cartItems = cartItems;
    });
  }

  openDeleteConfirmationPopup(cartId) {
    this.modalRef = this.modalService.open(DeleteCartitemConfirmationPopupComponent, {
      windowClass: 'delete_cart_item_block', centered: true, backdrop: 'static',
      keyboard: false
    }).result.then((result) => {
      if (result.STATUS === MODAL_TYPE.DELETE) {
        this.deleteCart(cartId);
      }
    });
  }

  deleteCart(id) {
    this.cartService.setCardId(id);
  }

}
