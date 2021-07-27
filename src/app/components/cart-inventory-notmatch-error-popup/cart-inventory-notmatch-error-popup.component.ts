import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart-inventory-notmatch-error-popup',
  templateUrl: './cart-inventory-notmatch-error-popup.component.html',
  styleUrls: ['./cart-inventory-notmatch-error-popup.component.scss']
})
export class CartInventoryNotmatchErrorPopupComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

}
