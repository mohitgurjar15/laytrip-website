import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../_helpers/common-function';
import { environment } from '../../../../environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;

  constructor(
    private router: Router,
    private commonFunction: CommonFunction,
    public activeModal: NgbActiveModal
) { }

  ngOnInit() {
  }

  refresh() {
    this.activeModal.dismiss();
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      var queryParams: any = {};
      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if (parms.utm_medium) {
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if (parms.utm_campaign) {
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['cart/checkout'], { queryParams: queryParams }));
    } else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['cart/checkout']));
    }
  }
}
