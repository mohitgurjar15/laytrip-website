import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { environment } from '../../../../../environments/environment';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';
import { GenericService } from '../../../../services/generic.service';
import { CommonFunction } from '../../../../_helpers/common-function';

@Component({
  selector: 'app-my-wallet-add-points',
  templateUrl: './my-wallet-add-points.component.html',
  styleUrls: ['./my-wallet-add-points.component.scss']
})
export class MyWalletAddPointsComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  userInfo;
  currency;
  newCard;
  cardToken: string = '';
  showAddCardForm: boolean = false;
  addedPoints;
  loading = false;
  laycreditpoints: number = 0;
  customInstalmentData: any;
  isDisableAddButton = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private genericService: GenericService,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.userInfo = getLoginUserInfo();
    if (typeof this.userInfo.roleId === 'undefined') {
      let queryParam: any = {};
      if (this.commonFunction.isRefferal()) {
        let parms = this.commonFunction.getRefferalParms();
        queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
        queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        this.router.navigate(['/'], { queryParams: queryParam });
      } else {
        this.router.navigate(['/']);
      }
    }
    this.getLayCreditInfo();
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
    if (count === 0) {
      this.showAddCardForm = true;
    }
  }

  addNewPoints(event) {
    this.addedPoints = event;
    if (event && event < 10) {
      this.isDisableAddButton = true;
    } else if (event === 0) {
      this.isDisableAddButton = true;
    } else if (event === null) {
      this.isDisableAddButton = true;
    } else {
      this.isDisableAddButton = false;
    }
  }

  toggleCancellationPolicy() {
    let queryParam: any = {};
    if (this.commonFunction.isRefferal()) {
      let parms = this.commonFunction.getRefferalParms();
      queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
      queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      this.router.navigate(['cancellation-policy'], { queryParams: queryParam });
    } else {
      this.router.navigate(['cancellation-policy']);
    }
  }

  addPoints() {
    this.loading = true;
    const data = { points: this.addedPoints, card_token: this.cardToken };
    this.userService.addNewPoints(data).subscribe((res: any) => {
      this.loading = false;
      this.getLayCreditInfo();
      // this.toastr.success(res.message, 'Points');
      let queryParam: any = {};
      if (this.commonFunction.isRefferal()) {
        let parms = this.commonFunction.getRefferalParms();
        queryParam.utm_source = parms.utm_source ? parms.utm_source : '';
        queryParam.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        this.router.navigate(['/account/lay-credit-points'], { queryParams: queryParam });
      } else {
        this.router.navigate(['/account/lay-credit-points']);
      }
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      // this.toastr.error(error.error.message);
    });
  }

  getLayCreditInfo() {
    this.genericService.getAvailableLaycredit().subscribe((res: any) => {
      document.getElementById("layPoints").innerHTML = res.total_available_points;
    }, (error => {
    }))
  }

}
