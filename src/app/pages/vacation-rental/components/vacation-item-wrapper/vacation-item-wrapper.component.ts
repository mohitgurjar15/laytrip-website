import { Component, OnInit, AfterContentChecked, OnDestroy, Input, SimpleChanges } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { VacationRentalService } from '../../../../services/vacation-rental.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
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
  subscriptions: Subscription[] = [];
  userInfo;
  rentalListArray = [];
  rentalDetailIdArray = [];
  isMapView = false;
  markers = [];
  zoom = 10;
  constructor(
    private rentalService: VacationRentalService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {

    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.rentalListArray = this.rentalDetails;
    this.userInfo = getLoginUserInfo();
  }

  ngAfterContentChecked() {
    this.rentalListArray = this.rentalDetails;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  changeView(view) {
    if (view === 'listView') {
      this.isMapView = false;
    } else {
       this.isMapView = true;
    }
  }

  onMouseOver(infoWindow, gm) {

    if (gm.lastOpen != null) {
      gm.lastOpen.close();
    }

    gm.lastOpen = infoWindow;

    infoWindow.open();
  }
  onMouseOut(infoWindow, gm) {
    infoWindow.close();
  }
}
