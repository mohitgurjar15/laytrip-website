import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';

export enum MODAL_TYPE {
  CLOSE,
}

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  cookieExpiredDate = new Date();

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private cookieService: CookieService,
    private router: Router,
    private commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    this.cookieExpiredDate.setDate(this.cookieExpiredDate.getSeconds() + 5);
  }

  close() {
    this.cookieService.put('__cke', JSON.stringify(true), { expires: new Date(moment().add(50, "years").format()) });
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }

  acceptCookiePolicy() {
    this.cookieService.put('__cke', JSON.stringify(true), { expires: new Date(moment().add(50, "years").format()) });
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }

  goToPrivacyPolicy() {
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
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
      this.router.navigate(['/privacy-policy'], { queryParams: queryParams });
    } else {
      this.router.navigate(['/privacy-policy'])
    }
  }

}
