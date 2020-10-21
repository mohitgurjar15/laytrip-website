import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { getLoginUserInfo } from 'src/app/_helpers/jwt.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
  public loading: boolean = false;
  planId;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.planId = this.route.snapshot.paramMap.get('id');
    this.userInfo = getLoginUserInfo();
    if (typeof this.userInfo.roleId == 'undefined') {
      this.router.navigate(['/']);
    }
    const payload = { id: this.planId, currency: this.currency.id };
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

  onPayNow() {
    this.loading = true;
    const data = { plan_id: this.planId, currency_id: this.currency.id, card_token: this.cardToken };
    console.log(this.planId, this.currency.id, this.cardToken);
    this.userService.payNowSubscription(data).subscribe((res: any) => {
      this.loading = true;
      this.toastr.success(res.message, 'Plan Subscription');
      this.router.navigate(['/']);
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.toastr.error(error.error.message);
    });
  }

}
