import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

  @Output() applyLaycredit = new EventEmitter();
  @Output() selectInstalmentMode = new EventEmitter();
  constructor() { }

  isInstalemtMode:boolean=false;
  value: number = 100;
  laycreditOptions: Options = {
    floor: 0,
    ceil: 600
  };

  ngOnInit() {
  }

  triggerPayemntMode(type){

    if(type=='instalment'){

      this.isInstalemtMode = true;
    }

    if(type=='noinstalment'){

      this.isInstalemtMode = false;
    }
    this.selectInstalmentMode.emit(type)

  }

  selectLaycredit(changeContext: ChangeContext): void {
    
    this.applyLaycredit.emit(changeContext.value)
  }
}
