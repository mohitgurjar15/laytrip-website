import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  isResetFilter: string = 'no';
  constructor(  
  	private route: ActivatedRoute,
    private rentalService: VacationRentalService) { }

 async ngOnInit() {
    window.scroll(0, 0);
    let payload: any = {};
    this.route.queryParams.forEach(params => {
    const info = JSON.parse(localStorage.getItem('_rental'));
     this.rentalSearchInfo = params;
        payload = {
          id: params.id,
          type: params.type,
          check_in_date: params.check_in_date,
          check_out_date: params.check_out_date,
          adult_count: parseInt(params.adult_count),
          number_and_children_ages:info.number_and_children_ages,
        }; 
      this.getRentalSearchData(payload);
    });
  }

  async getRentalSearchData(payload){
      this.loading = true;
      this.errorMessage='';
      this.rentalService.getRentalDetailSearchData(payload).subscribe((res: any) => {
        if (res) {
          console.log(res.items);
          this.loading = false;
          this.isNotFound = false;
          this.rentalDetails = res.items;
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
   

  getSearchItem(event) {
    console.log(event);
    this.getRentalSearchData(event);
  }

  //Sort Section Start
   sortRentals(event) {
     console.log(event);
    let { key, order } = event;
    if (key === 'total') {
      this.rentalDetails = this.sortJSON(this.rentalDetails, key, order);
    }else if (key === 'property_name') {
      this.rentalDetails = this.sortByRental(this.rentalDetails, key, order);
    }
  }

  sortJSON(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    } else {
      return data.sort(function (a, b) {
        var x = a.selling_price;
        var y = b.selling_price;
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

   sortByRental(data, key, way) {
    if (typeof data === "undefined") {
      return data;
    } else {
      return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (way === 'ASC') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'DESC') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
      });
    }
  }

  filterRental(event) {
    console.log(event);
    this.rentalDetails = event;
    console.log(this.rentalDetails);
  }

  resetFilter() {
    this.isResetFilter = (new Date()).toString();
  }

   ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
