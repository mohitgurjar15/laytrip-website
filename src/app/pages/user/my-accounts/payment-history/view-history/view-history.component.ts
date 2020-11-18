import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { FlightCommonFunction } from '../../../../../_helpers/flight-common-function';
import { environment } from '../../../../../../environments/environment';
import { UserService } from 'src/app/services/user.service';
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
  constructor(    
    private commonFunction:CommonFunction,
    private flightCommonFunction :FlightCommonFunction,
    private userService: UserService,
    public route :ActivatedRoute

  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.id = params['id']);
    this.getPaytmentDetailView();
  }

/*   ngOnChanges(changes:SimpleChanges){
    this.list = changes.item.currentValue;
    if(this.list){
      this.currencySymbol =  this.list.currency2.symbol ? this.list.currency2.symbol : '$';
    }
    if(this.list &&  this.list != 'undefined' ){
    }
  }
 */  

  getPaytmentDetailView(){
    var filterData = {bookingId : this.id};

    this.userService.getPaymentHistory(1, 1,filterData,'').subscribe((res: any) => {
      // this.activeBooking = res.map 
      this.list  = res.data;
      this.currencySymbol =  this.list[0].currency2.symbol ? this.list[0].currency2.symbol : '$';
    
        /* this.showPaginationBar = true;
        this.listLength =res.total_result;
        this.loading = this.notFound  = false; */
    }, err => {
     /*  this.notFound = true;
      this.loading = this.showPaginationBar = false; */
    });   
  }
  dateConvert(date){
    return this.commonFunction.convertDateFormat(new Date(date),"MM/DD/YYYY")
  }
  
}
