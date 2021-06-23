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
      this.router.navigate(['/about/'], { queryParams: queryParams });
    } else {
      this.router.navigate(['/about/']);
    }
  }
}
