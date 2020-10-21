import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

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
    public router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.userService.getSubscriptionList().subscribe((res: any) => {
      // console.log(res.data);
      if (res && res.data) {
        this.subscriptionList = res.data;
        this.loading = false;
      }
    });
  }

  subscribeNow(planId) {
    this.router.navigate(['/account/subscription', planId]);
  }

}
