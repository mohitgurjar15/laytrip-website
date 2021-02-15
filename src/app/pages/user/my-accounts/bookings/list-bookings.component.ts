import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';
import { AccountService } from '../../../../services/account.service';
import { CartService } from '../../../../services/cart.service';

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
  selectedInCompletedTabNumber: number = 0;
  selectedCompletedTabNumber: number = 0;
  cartItemsCount: number = 0;
  searchTextLength=0;

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

  getIncomplteBooking(search = ''){
    this.upComingloading=true;
    this.accountService.getIncomplteBooking(search).subscribe((res: any) => {
      this.upComingbookings=res.data;
      this.upComingloading=false;
   }, err => {
     
    this.upComingloading=false;
    this.upComingbookings=[];
   }); 
  }

  getComplteBooking(search = ''){
    this.completeLoading=true;
    this.accountService.getComplteBooking(search).subscribe((res: any) => {
      this.completeBookings=res.data;
      this.completeLoading=false;
   }, err => {
    this.completeLoading=false;
    this.completeBookings=[];
   }); 
  }

  searchBooking(searchKey:any){
    this.searchTextLength = searchKey.length;
    this.getComplteBooking(searchKey);
    this.getIncomplteBooking(searchKey);
  }

  selectInCompletedTab(cartNumber) {
    this.selectedInCompletedTabNumber = cartNumber;
  }

  selectCompletedTab(cartNumber) {
    this.selectedCompletedTabNumber = cartNumber;
  }


  getProgressPercentage(value,totalValue){
    return  {'width' : Math.floor((value/totalValue)*100) +'%'};
  }
  

}
