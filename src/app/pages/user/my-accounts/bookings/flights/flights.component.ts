import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { environment } from '../../../../../../environments/environment';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() cartItem: any={};
  @Input() laytrip_cart_id='';
  closeResult = '';
  bookingId = '';
  @Output() laytripCartId = new EventEmitter();
  @Output() upCommingloadingValue = new EventEmitter<boolean>();

  
  constructor(
    private commonFunction: CommonFunction,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if(typeof changes['cartItem'].currentValue!='undefined'){
      this.cartItem=changes['cartItem'].currentValue; 
      this.laytrip_cart_id=changes['laytrip_cart_id'].currentValue;

      // Author: xavier | 2021/8/13
      // Description: Translate cabin class for each flight rout
      if((this.cartItem != null) && (this.cartItem.moduleInfo[0] != null)) {
        for(let i: number = 0; i < this.cartItem.module_info[0].routes.length; i++) {
          const stops = this.cartItem.module_info[0].routes[i].stops;
          for(let j: number = 0; j < stops.length; j++) {
            const key: string = stops[j].cabin_class.toLowerCase() + "_class";
            this.translate.
                get(key).
                subscribe((res: string) => stops[j].cabin_class = res);
          }
        }
      }
    }
  } 

  convertHHMM(time){
    time = time.replace(' AM','');
    time = time.replace(' PM','');
    return time;   // 5:04 PM
  }

  cancelCartIdRemove(event){
    this.laytripCartId.emit(event);  
  }

}
