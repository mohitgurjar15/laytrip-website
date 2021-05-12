import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunction } from '../../_helpers/common-function';
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
    private router: Router,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
  }

  returnToCart() {
    let queryParam: any = {};
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
      queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      this.router.navigate(['/cart/booking'], { queryParams: queryParam });
    } else {
      this.router.navigate(['/cart/booking']);
    }
  }

  close() {
    this.activeModal.close();
    //this.router.navigate(['/cart/booking']);
  }

}
