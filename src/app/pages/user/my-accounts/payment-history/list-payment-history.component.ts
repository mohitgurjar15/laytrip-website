import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-list-payment-history',
  templateUrl: './list-payment-history.component.html',
  styleUrls: ['./list-payment-history.component.scss']
})
export class ListPaymentHistoryComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  loading = true;  
  perPageLimitConfig=[10,25,50,100];
  pageNumber:number;
  limit:number;
  historyResult:any;
  filterForm: FormGroup;
  itemDetail:any;
  startMinDate= new Date();
  modules:[];
  endDate;
  notFound=false;

  constructor(
    private userService: UserService,
    private commonFunction: CommonFunction,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loading = true;
    this.pageNumber=1;
    this.limit=this.perPageLimitConfig[0];
    this.getModule();
    
    this.filterForm = this.formBuilder.group({
      bookingId: [''],
      start_date: [''],
      end_date: [''],
      module: [''],
    });
    this.getPaymentHistory();
  }

  getPaymentHistory() {
    this.loading = true;
    this.userService.getPaymentHistory(this.pageNumber, this.limit,this.filterForm.value).subscribe((res: any) => {
        this.historyResult = res.data;
        this.loading = this.notFound  = false;
    }, err => {
      if (err && err.status === 404) {
        this.loading = false;
        this.notFound = true;
      }
    });   
  }
  
  getBookingHistory(event) {
    this.itemDetail = event
  }

  getModule(){
    this.userService.getModules(this.pageNumber, this.limit).subscribe((res: any) => {
      this.modules  = res.data.map(function (module) {
        if(module.status){
          return {
            id:module.id,
            name:module.name.toUpperCase()
          } 
        }
      });
   }, err => {
    
   }); 
  }
  
  startDateUpdate(date) {
    this.endDate = new Date(date)
  }
}
 