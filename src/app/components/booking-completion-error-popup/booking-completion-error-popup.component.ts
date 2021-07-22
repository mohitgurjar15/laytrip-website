import { Component, Input, OnInit } from '@angular/core';
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
  @Input() isSingleBooingConfirmedFromCart: boolean= true;


  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public commonFunction: CommonFunction,

  ) { }

  ngOnInit() {
  }

  returnToCart() {
    this.activeModal.close();
  
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      var queryParams: any = {};
      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if(parms.utm_medium){
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if(parms.utm_campaign){
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
      this.router.navigate(['/cart/checkout'], { queryParams: queryParams });
    } else {
      this.router.navigate(['/cart/checkout']);
    }
  }

  close() {
    this.activeModal.close();
    //Check if single booing confirm then stay on confirm page
    if (!this.isSingleBooingConfirmedFromCart) {
      if (this.commonFunction.isRefferal()) {
        let parms = this.commonFunction.getRefferalParms();
        var queryParams: any = {};
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if(parms.utm_medium){
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if(parms.utm_campaign){
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate(['/cart/checkout'], { queryParams: queryParams });
      } else {
        this.router.navigate(['/cart/checkout']);
      }
    }
  }

}
