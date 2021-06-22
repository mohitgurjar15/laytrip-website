import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { CommonFunction } from '../../../../_helpers/common-function';

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
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.planId = this.route.snapshot.paramMap.get('id');
    this.userInfo = getLoginUserInfo();
    if (typeof this.userInfo.roleId == 'undefined') {
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
        this.router.navigate(['/'], { queryParams: queryParams });
      } else {
        this.router.navigate(['/']);
      }
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
    this.userService.payNowSubscription(data).subscribe((res: any) => {
      this.loading = true;
      // this.toastr.success(res.message, 'Plan Subscription');
      this.toastr.show(res.message, 'Plan Subscription', {
        toastClass: 'custom_toastr',
        titleClass: 'custom_toastr_title',
        messageClass: 'custom_toastr_message',
      });
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
        this.router.navigate(['/'], { queryParams: queryParams });
      } else {
        this.router.navigate(['/']);
      }
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      // this.toastr.error(error.error.message);
      this.toastr.show(error.error.message, '', {
        toastClass: 'custom_toastr',
        titleClass: 'custom_toastr_title',
        messageClass: 'custom_toastr_message',
      });
    });
  }

}
