import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';
import { AccountService } from '../../../../services/account.service';
import { CartService } from '../../../../services/cart.service';
import * as moment from 'moment';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.scss']
})
export class ListBookingsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  upComingloading = false;
  upComingbookings = [];
  upComingbookingsForFilter = [];
  completeLoading = false;
  completeBookings = [];
  completeBookingsForFilter = [];
  selectedInCompletedTabNumber: number = 0;
  selectedCompletedTabNumber: number = 0;
  cartItemsCount: number = 0;
  searchTextLength = 0;

  searchText = '';

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private commonFunction: CommonFunction,
    private cartService: CartService,
    private renderer: Renderer2

  ) { }

  ngOnInit() {
    this.getIncomplteBooking();
    this.getComplteBooking();
    this.renderer.addClass(document.body, 'cms-bgColor');

  }

  getIncomplteBooking(search = '') {
    this.upComingloading = true;
    this.accountService.getIncomplteBooking(search).subscribe((res: any) => {
      this.upComingbookings = res.data;
      this.upComingbookingsForFilter = res.data;
      this.upComingloading = false;
    }, err => {

      this.upComingloading = false;
      this.upComingbookings = [];
    });
  }

  getComplteBooking(search = '') {
    this.completeLoading = true;
    this.accountService.getComplteBooking(search).subscribe((res: any) => {
      this.completeBookings = res.data;
      this.completeBookingsForFilter = res.data;
      this.completeLoading = false;
    }, err => {
      this.completeLoading = false;
      this.completeBookings = [];
    });
  }

  filterBooking(items, searchValue) {
    let result = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].laytripCartId.toLowerCase().toString().includes(searchValue)) {
        result.push(items[i]);
      }
      for (let j = 0; j < items[i].booking.length; j++) {

        if(items[i].booking[j].moduleId==1){
          if (items[i].booking[j].moduleInfo[0].departure_code.toLowerCase().toString().includes(searchValue) ||
            items[i].booking[j].moduleInfo[0].arrival_code.toLowerCase().toString().includes(searchValue) ||
            items[i].booking[j].moduleInfo[0].airline_name.toLowerCase().toString().includes(searchValue) ||
            items[i].booking[j].moduleInfo[0].departure_info.city.toLowerCase().toString().includes(searchValue) ||
            items[i].booking[j].moduleInfo[0].arrival_info.city.toLowerCase().toString().includes(searchValue)
          ) {
            result.push(items[i]);
          }
        }
        if(items[i].booking[j].moduleId==3){
          if (items[i].booking[j].moduleInfo[0].hotel_name.toLowerCase().toString().includes(searchValue) ||
            items[i].booking[j].moduleInfo[0].title.toLowerCase().toString().includes(searchValue)
          ) {
            result.push(items[i]);
          }
        }
        
      }
    }
    return result;
  }

  searchBooking(searchValue: any) {
    this.searchTextLength = searchValue.length;
    if (this.searchTextLength > 0) {
      // UPCOMING BOOKING
      this.upComingbookings = this.filterBooking(this.upComingbookingsForFilter, searchValue.toLowerCase().toString());
      // COMPLETED BOOKING
      this.completeBookings = this.filterBooking(this.completeBookingsForFilter, searchValue.toLowerCase().toString());
    } else {
      this.upComingbookings = [...this.upComingbookingsForFilter];
      this.completeBookings = [...this.completeBookingsForFilter];
    }
  }

  selectInCompletedTab(cartNumber) {
    this.selectedInCompletedTabNumber = cartNumber;
    this.cartService.setCartNumber(cartNumber);
  }

  selectCompletedTab(cartNumber) {
    this.selectedCompletedTabNumber = cartNumber;
    this.cartService.setCartNumber(cartNumber);
  }

  getProgressPercentage(value, totalValue) {
    return { 'width': Math.floor((value / totalValue) * 100) + '%' };
  }

  cancelCartIdRemove(event) {
    var filterData = this.upComingbookings.filter(function (obj) {
      return obj.laytripCartId != event
    });
    this.upComingbookings = [];
    this.upComingbookings = filterData;
  }

  loadUpcomming(event) {
    this.upComingloading = event;
  }
}
