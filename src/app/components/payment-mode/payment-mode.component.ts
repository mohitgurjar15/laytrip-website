import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

  constructor() { }
  isInstalemtMode:boolean=false;

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
