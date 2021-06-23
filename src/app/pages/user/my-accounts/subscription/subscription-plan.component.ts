import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { CommonFunction } from '../../../../_helpers/common-function';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss']
})
export class SubscriptionPlanComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  subscriptionList;
  currency;
  loading = false;

  constructor(
    private userService: UserService,
    public router: Router,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.loading = true;
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.userService.getSubscriptionList().subscribe((res: any) => {
      if (res && res.data) {
        this.subscriptionList = res.data;
        this.loading = false;
      }
    });
  }

  subscribeNow(planId) {
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
      this.router.navigate(['/account/subscription', planId], { queryParams: queryParams });
    } else {
      this.router.navigate(['/account/subscription', planId]);
    }
  }

}
