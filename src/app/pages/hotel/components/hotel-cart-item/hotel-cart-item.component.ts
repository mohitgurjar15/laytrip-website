import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { MODAL_TYPE } from '../../../../components/confirmation-modal/confirmation-modal.component';
import { DeleteCartitemConfirmationPopupComponent } from '../../../../components/delete-cartitem-confirmation-popup/delete-cartitem-confirmation-popup.component';
import { CartService } from '../../../../services/cart.service';
import { GenericService } from '../../../../services/generic.service';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-hotel-cart-item',
  templateUrl: './hotel-cart-item.component.html',
  styleUrls: ['./hotel-cart-item.component.scss']
})
export class HotelCartItemComponent implements OnInit {

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
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getCartList();
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
