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
    private accountService: AccountService,

  ) { }

  ngOnInit() {
  
    
  }
  ngOnChanges(changes: SimpleChanges) {
    if(typeof changes['cartItem'].currentValue!='undefined'){
      this.cartItem=changes['cartItem'].currentValue; 
      console.log(this.cartItem)

      this.laytrip_cart_id=changes['laytrip_cart_id'].currentValue;
    }
  } 

  convertHHMM(time){
    time = time.replace(' AM','');
    time = time.replace(' PM','');
    return time;   // 5:04 PM
  }

  open(content,bookingId) {
    this.bookingId = bookingId;
    this.modalService.open(content, {
      windowClass: 'delete_account_window', centered: true, backdrop: 'static',
      keyboard: false
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cancelBooking(){
    // this.upCommingloadingValue.emit(true);
    this.accountService.cancelBooking(this.bookingId).subscribe((data: any) => {
      this.laytripCartId.emit(this.bookingId);
      // this.upCommingloadingValue.emit(false);
      this.modalService.dismissAll();
    }, (error: HttpErrorResponse) => {
      // this.upCommingloadingValue.emit(false);
      this.modalService.dismissAll();
    });
  }
}
