import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-plan-subscription',
  templateUrl: './plan-subscription.component.html',
  styleUrls: ['./plan-subscription.component.scss']
})
export class PlanSubscriptionComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  currency;
  userInfo;
  newCard;
  cardToken: string = '';
  isDisableBookBtn: boolean = true;
  isTandCaccepeted: boolean = false;
  laycreditpoints: number = 0;
  sellingPrice: number;
  showAddCardForm: boolean = false;
  isShowCardOption: boolean = true;
  guestCardDetails;
  instalmentMode = 'instalment';
  instalmentType: string = 'weekly';
  showPartialPayemntOption: boolean = false;
  customInstalmentData: any;
  additionalAmount: number;
  customAmount: number | null;
  customInstalment: number | null;
  planSummaryData;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    const planId = this.route.snapshot.paramMap.get('id');
    this.userInfo = getLoginUserInfo();
    if (typeof this.userInfo.roleId == 'undefined') {
      this.router.navigate(['/']);
    }
    const payload = { id: planId, currency: this.currency.id };
    this.userService.getSubscriptionPlanDetail(payload).subscribe((res: any) => {
      if (res) {
        this.planSummaryData = res;
      }
    });
  }

  emitNewCard(event) {
    this.newCard = event;
  }

  selectCreditCard(cardToken) {
    this.cardToken = cardToken;
  }

  toggleAddcardForm() {
    this.showAddCardForm = !this.showAddCardForm;
  }

  totalNumberOfcard(count) {
    if (count == 0) {
      this.showAddCardForm = true;
    }
  }

}
