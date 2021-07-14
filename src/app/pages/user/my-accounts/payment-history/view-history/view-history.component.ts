import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightCommonFunction } from '../../../../../_helpers/flight-common-function';
import { environment } from '../../../../../../environments/environment';
import { UserService } from '../../../../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() item;
  list:any;
  currencySymbol='';
  id;
  loader=false;
  constructor(    
    private commonFunction:CommonFunction,
    private flightCommonFunction :FlightCommonFunction,
    private userService: UserService,
    public route :ActivatedRoute

  ) { }

  ngOnInit() {
    this.loader = true;
    this.route.params.subscribe(params => this.id = params['id']);
    this.getPaytmentDetailView();
  }

  getPaytmentDetailView(){
    this.loader = true;
    var filterData = {bookingId : this.id};

    this.userService.getPaymentHistory(1, 1,filterData,'').subscribe((res: any) => {
      this.list  = res.data;
      this.loader = false;
      this.currencySymbol =  this.list[0].currency2.symbol ? this.list[0].currency2.symbol : '$';
    }, err => {
      this.loader = false;
     });   
  }
  dateConvert(date){
    return this.commonFunction.convertDateFormat(new Date(date),"MM/DD/YYYY")
  }
  
}
