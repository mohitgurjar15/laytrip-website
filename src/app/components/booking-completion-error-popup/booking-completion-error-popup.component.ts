import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-booking-completion-error-popup',
  templateUrl: './booking-completion-error-popup.component.html',
  styleUrls: ['./booking-completion-error-popup.component.scss']
})
export class BookingCompletionErrorPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  returnToCart() {
    console.log('RETURN TO CART');
  }

  close() {
    this.activeModal.close();
  }

}
