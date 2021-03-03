import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    private router:Router
  ) { }

  ngOnInit() {
  }

  returnToCart() {
    this.router.navigate(['/cart/booking']);
  }

  close() {
    this.activeModal.close();
    //this.router.navigate(['/cart/booking']);
  }

}
