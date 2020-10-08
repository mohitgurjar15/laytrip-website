import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TravelerService } from '../../../../services/traveler.service';
import { environment } from '../../../../../environments/environment';

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
  isNotFound: boolean = false;
  public loading: boolean = true;
  totalItems = 0;
  travellerPoints;

  constructor(
    public travelerService : TravelerService 
  ) { }

  ngOnInit() {
    this.page = 1;
    this.isNotFound = false;
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
      this.earnedPoints = result.data;
    }, (error: HttpErrorResponse) => {   
      this.loading = false;    
      // this.apiError = error.message;
    });
  }

  getTotalAvailabePoints(){
    this.travelerService.getTotalAvailablePoints(this.page, this.limit).subscribe((result: any) => {
      this.loading = false;   
      this.travellerPoints = result;
    }, (error: HttpErrorResponse) => {   
      this.loading = false;    
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
    }, (error: HttpErrorResponse) => {  
      this.loading = false;
      // this.apiError = error.message;
    });
  }
}
