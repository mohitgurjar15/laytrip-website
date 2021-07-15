import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-popup-term-condition',
  templateUrl: './popup-term-condition.component.html',
  styleUrls: ['./popup-term-condition.component.scss']
})
export class PopupTermConditionComponent implements OnInit {

  @Output() acceptTermCondtion=new EventEmitter()
  @Output() closeTermCoditionPopup=new EventEmitter()
  constructor() { }
  s3BucketUrl = environment.s3BucketUrl;
  ngOnInit() {
  }

  acceptTermAndCondtion(){
    this.acceptTermCondtion.emit(true)
  }
  
  closePopup(){
    this.closeTermCoditionPopup.emit(false)
  }
}
