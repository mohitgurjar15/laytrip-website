import { Component, OnInit, AfterContentChecked, OnDestroy, Input } from '@angular/core';
declare var $: any;
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { VacationRentalService } from '../../../../services/vacation-rental.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getLoginUserInfo } from '../../../../../app/_helpers/jwt.helper';
import { CommonFunction } from '../../../../_helpers/common-function';

@Component({
  selector: 'app-vacation-item-wrapper',
  templateUrl: './vacation-item-wrapper.component.html',
  styleUrls: ['./vacation-item-wrapper.component.scss']
})
export class VacationItemWrapperComponent implements OnInit, AfterContentChecked, OnDestroy {

  @Input() rentalDetails;
  s3BucketUrl = environment.s3BucketUrl;
  public defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';
  currency;
  subscriptions: Subscription[] = [];
  userInfo;
  rentalListArray = [];
  rentalDetailIdArray = [];
  isMapView = false;
  markers = [];
  zoom = 10;
  showHomeDetails = [];
  showFareDetails: number = 0;
  amenitiesObject = {

    ac: `${this.s3BucketUrl}assets/images/hotels/ac.svg`,
    wifi: `${this.s3BucketUrl}assets/images/hotels/wifi.svg`,
    coffe_tea: `${this.s3BucketUrl}assets/images/hotels/breakfast.svg`,
    no_smoking: `${this.s3BucketUrl}assets/images/hotels/no_smoking.svg`,
    tv: `${this.s3BucketUrl}assets/images/hotels/tv.svg`,
  }
  showMapDetails = [];

  constructor(
    private rentalService: VacationRentalService,
    private router: Router,
    private route: ActivatedRoute,
    private commonFunction: CommonFunction) { }

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

  infoWindowAction(template, event, action) {
    if (action === 'open') {
      template.open();
    } else if (action === 'close') {
      template.close();
    } else if (action === 'click') {
      this.showMapInfo(template);
    }
  }

  showMapInfo(index) {
    if (typeof this.showMapDetails[index] === 'undefined') {
      this.showMapDetails[index] = true;
      document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    else {
      this.showMapDetails[index] = !this.showMapDetails[index];
      document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  showDetails(index, flag = null) {
    if (typeof this.showHomeDetails[index] === 'undefined') {
      this.showHomeDetails[index] = true;
    } else {
      this.showHomeDetails[index] = !this.showHomeDetails[index];
    }

    if (flag == 'true') {
      this.showFareDetails = 1;
    }
    else {

      this.showFareDetails = 0;
    }

    this.showHomeDetails = this.showHomeDetails.map((item, i) => {
      return ((index === i) && this.showHomeDetails[index] === true) ? true : false;
    });
  }
   closeHomeDetail() {
    this.showFareDetails = 0;
    this.showHomeDetails = this.showHomeDetails.map(item => {
      return false;
    });
  }

  redirectToDetail(id,lat,long) {
    this.router.navigate(['/vacation-rental/detail', id],{ queryParams: { lat: lat,long :long}});
  }

}
