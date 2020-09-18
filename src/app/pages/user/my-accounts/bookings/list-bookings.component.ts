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
  loading = true;
  isNotFound = false
  flightLists = [];
  perPageLimitConfig=[10,25,50,100];
  pageNumber:number;
  limit:number;

  constructor(
    private userService: UserService,
    private commonFunction: CommonFunction
  ) { }

  ngOnInit() {
    this.pageNumber=1;
    this.limit=this.perPageLimitConfig[0];
    this.getBookings();
  }

  getBookings(){
    this.userService.getBookings(this.pageNumber, this.limit).subscribe((res: any) => {
      if (res) {
        this.flightLists = res.data.map(flight=>{
          if(flight.moduleId == 1){
            return {
              tripId : flight.id,
              bookingDate : this.commonFunction.convertDateFormat(flight.bookingDate,'YYYY-MM-DD'),
              departure_time : flight.moduleInfo[0].routes[0].stops[0].departure_time,
              arrival_time : flight.moduleInfo[0].routes[0].stops[0].arrival_time,
              departure_city : flight.moduleInfo[0].routes[0].stops[0].departure_info.city,
              arrival_city : flight.moduleInfo[0].routes[0].stops[0].arrival_info.city,
              duration : flight.moduleInfo[0].total_duration,
              airline_logo : flight.moduleInfo[0].routes[0].stops[0].airline_logo,
              airline_name : flight.moduleInfo[0].routes[0].stops[0].airline_name,
              airline : flight.moduleInfo[0].routes[0].stops[0].airline,
              flight_number : flight.moduleInfo[0].routes[0].stops[0].flight_number,
              instalment_amount : flight.moduleInfo[0].start_price,
              selling_price : flight.moduleInfo[0].selling_price,
              stop_count : flight.moduleInfo[0].instalment_details.stop_count,
              is_refundable : flight.moduleInfo[0].instalment_details.is_refundable,
            }
          }
        });
        this.isNotFound = false;
        this.loading = false;
      }
    }, err => {
      this.isNotFound = true;
      if (err && err.status === 404) {
        this.loading = false;
      }
    });
  }
}
