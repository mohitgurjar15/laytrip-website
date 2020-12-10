import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { VacationRentalService } from '../../../../services/vacation-rental.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonFunction } from '../../../../_helpers/common-function';
import { GenericService } from '../../../../../app/services/generic.service';
import * as moment from 'moment'
import { getLoginUserInfo } from '../../../../../app/_helpers/jwt.helper';

@Component({
  selector: 'app-vacation-item-wrapper',
  templateUrl: './vacation-item-wrapper.component.html',
  styleUrls: ['./vacation-item-wrapper.component.scss']
})
export class VacationItemWrapperComponent implements OnInit, AfterContentChecked, OnDestroy {
  
  @Input() rentalDetails;

  s3BucketUrl = environment.s3BucketUrl;
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_im.svg';
  currency;
  rentalList;
  subscriptions: Subscription[] = [];
  userInfo;
  rentalListArray = [];
  rentalDetailIdArray=[];
  constructor(  
  	private rentalService: VacationRentalService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private commonFunction:CommonFunction,
    private genericService:GenericService) { }

  ngOnInit() {

    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.rentalList = this.rentalDetails;
    this.userInfo = getLoginUserInfo();
  }

  ngAfterContentChecked() {
    this.rentalListArray = this.rentalList;
  }

   ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
