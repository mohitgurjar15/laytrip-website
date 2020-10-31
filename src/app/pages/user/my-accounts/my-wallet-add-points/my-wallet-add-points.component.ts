import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { environment } from '../../../../../environments/environment';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';

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

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.userInfo = getLoginUserInfo();
    if (typeof this.userInfo.roleId === 'undefined') {
      this.router.navigate(['/']);
    }
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
  }

  toggleCancellationPolicy() {
    this.router.navigate(['cancellation-policy']);
  }

  addPoints() {
    this.loading = true;
    const data = { points: this.addedPoints, card_token: this.cardToken };
    this.userService.addNewPoints(data).subscribe((res: any) => {
      this.loading = true;
      this.toastr.success(res.message, 'Points');
      this.router.navigate(['/account/my-wallet']);
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.toastr.error(error.error.message);
    });
  }

}
