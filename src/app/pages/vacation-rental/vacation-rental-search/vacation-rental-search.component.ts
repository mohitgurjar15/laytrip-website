import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Location } from '@angular/common';
import * as moment from 'moment';
import { CommonFunction } from '../../../_helpers/common-function';
import { VacationRentalService } from '../../../services/vacation-rental.service';

@Component({
  selector: 'app-vacation-rental-search',
  templateUrl: './vacation-rental-search.component.html',
  styleUrls: ['./vacation-rental-search.component.scss']
})
export class VacationRentalSearchComponent implements OnInit, OnDestroy {

  s3BucketUrl = environment.s3BucketUrl;
  loading = true;
  isNotFound = false;
  errorMessage:string='';
  rentalSearchInfo;
  rentalDetails;
  rentalFilterDetails;
  subscriptions: Subscription[] = [];
  constructor(  
  	private route: ActivatedRoute,
    private rentalService: VacationRentalService,
    public router: Router,
    public location: Location,
    public commonFunction: CommonFunction,) { }

  ngOnInit() {
    window.scroll(0, 0);
    let payload: any = {};
    const info = JSON.parse(localStorage.getItem('_rental'));
    this.route.queryParams.forEach(params => {
      this.rentalSearchInfo = params;
        payload = {
          id: info.id,
          type: params.type,
          check_in_date: params.check_in_date,
          check_out_date: params.check_out_date,
          adult_count: parseInt(params.adult_count),
          number_and_children_ages:info.number_and_children_ages,
        }; 
        console.log("---54545454----",payload);
      this.getRentalSearchData(payload);
    });
  }

  async getRentalSearchData(payload){
      this.loading = true;
      this.errorMessage='';
      this.rentalService.getRentalDetailSearchData(payload).subscribe((res: any) => {
        if (res) {
          console.log("---------------------------",res);
          this.loading = false;
          this.isNotFound = false;
          this.rentalDetails = res.items;
          console.log("----------11111-----------------",this.rentalDetails);
          this.rentalFilterDetails = res;    
        }
      }, err => {
        if (err && err.status === 404) {
          this.errorMessage=err.message;
          this.isNotFound = true;
        }
        else{
          this.isNotFound = true;
        }

        this.loading = false;
      });
   
  }
    ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getSearchItem(event) {
    console.log(event);
    this.getRentalSearchData(event);
  }
}
