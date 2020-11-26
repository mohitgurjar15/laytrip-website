import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.scss']
})
export class ListBookingsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  filterForm: FormGroup;
  loading = false;
  flightLists = [];
  perPageLimitConfig=[10,25,50,100];
  pageNumber:number;
  limit:number;
  modules:[];
  result:any;
  endDate;
  startMinDate= new Date();
 

  constructor(
    private userService: UserService,
    private commonFunction: CommonFunction,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // this.loading = true;
    this.pageNumber=1;
    this.limit=this.perPageLimitConfig[0];
    this.getModule();

    this.filterForm = this.formBuilder.group({
      bookingId: [''],
      start_date: [''],
      end_date: [''],
      module: [''],
    });
  }

  getModule(){
    this.userService.getModules(this.pageNumber, this.limit).subscribe((res: any) => {
      this.modules  = res.data.map(function (module) {
        if(module.status == true){
          return {
            id:module.id,
            name:module.name.toUpperCase()
          } 
        }
      });
      console.log(this.modules)
   }, err => {
    
   }); 
  }

  getFlightResult() {
    this.result = this.filterForm.value;
     this.loading = true;
  }

  startDateUpdate(date) {
    this.endDate = new Date(date)
  }

}
