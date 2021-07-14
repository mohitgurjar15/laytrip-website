import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightCommonFunction } from '../../../../../_helpers/flight-common-function';
import { environment } from '../../../../../../environments/environment';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';
import { InstalmentType } from '../../../../../constant/instalment-type.const';


@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})

export class HistoryListComponent implements OnInit {
  @Output() bookingData = new EventEmitter();
  s3BucketUrl = environment.s3BucketUrl;
  @Input() historyResult;
  @Input() payment_status;
  list: any = [];
  historys: [];
  public filterData = {};
  filterInfo = {};
  item: any;
  listLength = 0;
  pageSize = 10;
  page: 1;
  loading = true;
  perPageLimitConfig = [10, 25, 50, 100];
  limit: number;
  showPaginationBar: boolean = false;
  pageNumber: number;
  notFound = false;
  activeBookings = [];
  failedBookings = [];
  instalmentType;

  constructor(
    private commonFunction: CommonFunction,
    private flightCommonFunction: FlightCommonFunction,
    private userService: UserService,
    public router: Router

  ) {
    this.instalmentType = InstalmentType
  }

  ngOnInit() {
    this.page = 1;
    this.limit = this.perPageLimitConfig[0];
    this.getPaymentHistory();
  }


  ngOnChanges(changes: SimpleChanges) {
    this.filterData = changes.historyResult.currentValue;
    if (this.filterData) {
      this.showPaginationBar = false;
      this.getPaymentHistory();
    }
  }

  getPaymentHistory() {
    this.loading = true;
    this.filterInfo = null;
    if (this.filterData != 'undefined') {
      this.filterInfo = this.filterData;
    }
    this.userService.getPaymentHistory(this.page, this.limit, this.filterInfo, this.payment_status).subscribe((res: any) => {
      // this.activeBooking = res.map 
      this.list = res.data;

      this.showPaginationBar = true;
      this.listLength = res.total_result;
      this.loading = this.notFound = false;
    }, err => {
      this.notFound = true;
      this.loading = this.showPaginationBar = false;
    });
  }

  pageChange(event) {
    window.scroll(0, 0);
    this.showPaginationBar = false;
    this.page = event;
    this.getPaymentHistory();
  }

  viewDetailClick(item) {
    this.item = item;
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
      this.router.navigate(['/account/payment/detail/' + item.laytripBookingId], { queryParams: queryParams });
    } else {
      this.router.navigate(['/account/payment/detail/' + item.laytripBookingId]);
    }
  }

  dateConvert(date) {
    return this.commonFunction.convertDateFormat(new Date(date), "MM/DD/YYYY")
  }

  getPercentage1(value, totalValue, type) {
    let configValue: any = document.querySelector('.progress-bar');
    configValue.style.width = 24;
  }

  getPercentage(value, totalValue, type) {
    if (type == 1) {
      return { 'width': (Math.floor((value / totalValue) * 100) + 2) + '%' };
    } else {
      return { 'left': Math.floor((value / totalValue) * 100) + '%' };
    }
    const styles = { 'width': '25%' };
    return styles;
  }
}
