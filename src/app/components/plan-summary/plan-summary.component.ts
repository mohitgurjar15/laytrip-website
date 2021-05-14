import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonFunction } from '../../_helpers/common-function';

@Component({
  selector: 'app-plan-summary',
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.scss']
})
export class PlanSummaryComponent implements OnInit, AfterContentChecked {

  @Input() planSummaryData;
  currency;
  showCancellationPolicy: boolean = false;
  todayDate;
  validityDaysRange;
  constructor(
    public router: Router,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
  }

  ngAfterContentChecked() {
    if (this.planSummaryData) {
      this.todayDate = moment().format("MM/DD/YYYY");
      this.validityDaysRange = this.todayDate + ' to ' + moment().add(this.planSummaryData.validityDays, 'days').format("MM/DD/YYYY");
    }
  }

  toggleCancellationPolicy() {
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
      this.router.navigate(['cancellation-policy'], { queryParams: queryParams });
    } else {
      this.router.navigate(['cancellation-policy']);
    }
  }

}
