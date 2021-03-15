import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() cartItem={};
  @Input() laytrip_cart_id='';
  closeResult = '';
  bookingId = '';
  @Output() laytripCartId = new EventEmitter();
  @Output() upCommingloadingValue = new EventEmitter<boolean>();

  
  constructor(
    private commonFunction: CommonFunction,
    private modalService: NgbModal,

  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if(typeof changes['cartItem'].currentValue!='undefined'){
      this.cartItem=changes['cartItem'].currentValue; 
      this.laytrip_cart_id=changes['laytrip_cart_id'].currentValue;
    }
  } 

  convertHHMM(time){
    time = time.replace(' AM','');
    time = time.replace(' PM','');
    return time;   // 5:04 PM
  }

  cancelCartIdRemove(event){
    // console.log(event)
    this.laytripCartId.emit(event);  
  }

}
