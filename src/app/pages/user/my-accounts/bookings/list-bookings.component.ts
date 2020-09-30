import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.scss']
})
export class ListBookingsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  loading = false;
  flightLists = [];
  perPageLimitConfig=[10,25,50,100];
  pageNumber:number;
  limit:number;

  constructor(
    private userService: UserService,
    private commonFunction: CommonFunction
  ) { }

  ngOnInit() {
    // this.loading = true;
    this.pageNumber=1;
    this.limit=this.perPageLimitConfig[0];
    // this.getBookings();
  }

}
