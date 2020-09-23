import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CommonFunction } from '../../../../_helpers/common-function';

@Component({
  selector: 'app-list-payment-history',
  templateUrl: './list-payment-history.component.html',
  styleUrls: ['./list-payment-history.component.scss']
})
export class ListPaymentHistoryComponent implements OnInit {
  loading = true;
  isNotFound = false
  perPageLimitConfig=[10,25,50,100];
  pageNumber:number;
  limit:number;
  historyResult:any;

  constructor(
    private userService: UserService,
    private commonFunction: CommonFunction
  ) { }

  ngOnInit() {
    this.loading = true;
    this.pageNumber=1;
    this.limit=this.perPageLimitConfig[0];
    this.getPaymentHistory();
  }

  getPaymentHistory(){
    this.userService.getPaymentHistory(this.pageNumber, this.limit).subscribe((res: any) => {
        this.historyResult = res.data;
        console.log(this.historyResult)

        this.isNotFound = false;
        this.loading = false;
      
    }, err => {
      this.isNotFound = true;
      if (err && err.status === 404) {
        this.loading = false;
      }
    });
    
  }
}
 