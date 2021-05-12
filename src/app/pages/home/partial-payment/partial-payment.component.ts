import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../_helpers/common-function';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-partial-payment',
  templateUrl: './partial-payment.component.html',
  styleUrls: ['./partial-payment.component.scss']
})
export class PartialPaymentComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor(public router: Router,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
  }

  redirectToAboutPage() {
    let queryParam: any = {};
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
      queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      this.router.navigate(['/about/'], { queryParams: queryParam });
    } else {
      this.router.navigate(['/about/']);
    }
  }
}
