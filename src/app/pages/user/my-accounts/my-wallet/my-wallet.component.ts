import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TravelerService } from '../../../../services/traveler.service';
import { environment } from '../../../../../environments/environment';
import { CommonFunction } from '../../../../_helpers/common-function';

@Component({
  selector: 'app-my-wallet',
  templateUrl: './my-wallet.component.html',
  styleUrls: ['./my-wallet.component.scss']
})
export class MyWalletComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  earnedPoints:any;
  redeemedPoints:any;
  page :1;
  pageSize =10;
  perPageLimitConfig = [10, 25, 50, 100];
  limit: number;
  showPaginationBar: boolean = false;
  isEarningPointNotFound: boolean = false;
  isRedeedemPointNotFound: boolean = false;
  public loading: boolean = true;
  public pointsLoading: boolean = true;
  totalItems = 0;
  travellerPoints;
  
  constructor(
    public travelerService : TravelerService,
    private commonFunction:CommonFunction,
  ) { }

  ngOnInit() {
    this.page = 1;
    this.isEarningPointNotFound = false;
    this.isRedeedemPointNotFound = false;
    this.loading = true;
    this.limit = this.perPageLimitConfig[0];
    this.getEarnedPoint();
    this.getTotalAvailabePoints();
    this.getRedeemedPoint();
  }

  getEarnedPoint(){
    this.loading = true;
    this.travelerService.getEarnedPoint(this.page, this.limit).subscribe((result: any) => {
      this.loading = false;
      this.isEarningPointNotFound = false;  
      console.log(result)
 
      this.earnedPoints = result.data;
    }, (error: HttpErrorResponse) => {
      this.isEarningPointNotFound = true;   
      this.loading = false;    
      // this.apiError = error.message;
    });
  }

  getDateFormat(date){
    return this.commonFunction.convertDateFormat( new Date(date) ,'DD/MM/YYYY');
  }

  getTotalAvailabePoints(){
    this.pointsLoading = true;
    this.travelerService.getTotalAvailablePoints(this.page, this.limit).subscribe((result: any) => {
      this.pointsLoading = false;   
      this.travellerPoints = result;
    }, (error: HttpErrorResponse) => {   
      this.pointsLoading = false;    
      // this.apiError = error.message;
    });
  }
  pageChange(event) {
    this.page = event;    
    this.showPaginationBar = false;
  }
  getRedeemedPoint(){
    this.travelerService.getRedeemedPoint(this.page, this.limit).subscribe((result: any) => {
      this.redeemedPoints = result.data;
      this.loading = false;
      this.isRedeedemPointNotFound = false;
    }, (error: HttpErrorResponse) => {  
      this.loading = false;
      this.isRedeedemPointNotFound = true;
    });
  }
}
