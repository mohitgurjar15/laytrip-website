import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

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
    console.log(this.planSummaryData);
  }

  toggleCancellationPolicy() {
    this.router.navigate(['cancellation-policy']);
  }

}
