import { Component, Input, OnInit, Output,EventEmitter, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunction } from 'src/app/_helpers/common-function';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {

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
