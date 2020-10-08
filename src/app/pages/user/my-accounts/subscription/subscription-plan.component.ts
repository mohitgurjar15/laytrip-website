import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss']
})
export class SubscriptionPlanComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  subscriptionList;
  currency;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.userService.getSubscriptionList().subscribe((res: any) => {
      // console.log(res.data);
      if (res && res.data) {
        this.subscriptionList = res.data;
      }
    });
  }

  subscribeNow() {
    console.log('SUBSCRIBE NOW:::');
  }

}
