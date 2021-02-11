import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlightService } from 'src/app/services/flight.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.scss']
})
export class ListBookingsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  upComingloading = false;
  upComingbookings=[];

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private commonFunction: CommonFunction,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // this.loading = true;
    this.getIncomplteBooking();
  }

  getIncomplteBooking(){
    this.upComingloading=true;
    this.accountService.getIncomplteBooking().subscribe((res: any) => {
      this.upComingbookings=res.data;
      this.upComingloading=false;
      console.log(res)
   }, err => {
    this.upComingloading=false;
    this.upComingbookings=[];
   }); 
  }
}
