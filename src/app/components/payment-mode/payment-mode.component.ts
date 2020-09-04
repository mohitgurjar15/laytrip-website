import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

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

    if(type=='no-instalment'){

      this.isInstalemtMode = false;
    }

  }
}
