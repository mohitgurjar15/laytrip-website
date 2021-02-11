import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlightService } from '../../../../services/flight.service';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.scss']
})
export class ListBookingsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  upComingloading = false;
  upComingbookings=[];
  completeLoading = false;
  completeBookings=[];

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    this.getIncomplteBooking();
    this.getComplteBooking();
  }

  getIncomplteBooking(){
    this.upComingloading=true;
    this.accountService.getIncomplteBooking().subscribe((res: any) => {
      this.upComingbookings=res.data;
      this.upComingloading=false;
   }, err => {
    this.upComingloading=false;
    this.upComingbookings=[];
   }); 
  }

  getComplteBooking(){
    this.completeLoading=true;
    this.accountService.getComplteBooking().subscribe((res: any) => {
      console.log(res)

      this.completeBookings=res.data;
      this.completeLoading=false;
   }, err => {
    this.completeLoading=false;
    this.completeBookings=[];
   }); 
  }
}
