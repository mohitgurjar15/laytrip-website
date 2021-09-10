import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonFunction } from '../../../../../_helpers/common-function';
import { environment } from '../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

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

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateCabinClasses();
  });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(typeof changes['cartItem'].currentValue!='undefined'){
      this.cartItem=changes['cartItem'].currentValue; 
      this.laytrip_cart_id=changes['laytrip_cart_id'].currentValue;

      this.translateCabinClasses();
    }
  }

  // Author: xavier | 2021/8/13
  // Description: Translate cabin class for each flight route
  translateCabinClasses() {
    //console.log(this.cartItem && this.cartItem.moduleInfo && this.cartItem.moduleInfo[0] && this.cartItem.moduleInfo[0] != null)
    if((this.cartItem && this.cartItem.moduleInfo && this.cartItem.moduleInfo[0] != null)) {
      for(let k: number = 0; k < this.cartItem.moduleInfo.length; k++) {
        const module = this.cartItem.moduleInfo[k];
        for(let i: number = 0; i < module.routes.length; i++) {
          const stops = module.routes[i].stops;
          for(let j: number = 0; j < stops.length; j++) {
            let key: string;
            if(stops[j].original_cabin_class) {
              key = stops[j].original_cabin_class.toLowerCase() + "_class";
            } else {
              key = stops[j].cabin_class.toLowerCase() + "_class";
              stops[j].original_cabin_class = stops[j].cabin_class;
            }
            stops[j].cabin_class = this.translate.instant(key);
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
