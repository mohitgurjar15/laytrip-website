import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChangeContext, Options } from 'ng5-slider';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-redeem-laycredit',
  templateUrl: './redeem-laycredit.component.html',
  styleUrls: ['./redeem-laycredit.component.scss']
})
export class RedeemLaycreditComponent implements OnInit {

  @Output() applyLaycredit = new EventEmitter();
  @Input() sellingPrice:number;
  @Input() redeemableLayPoints:number;
  @Input() totalLaycreditPoints:number;
  value: number = 0;
  selectedLayCredit=0;
  laycreditOptions: Options = {
    floor: 0,
    ceil: 0,
    step: 0.1,
    disabled:true
  };
  constructor(
    private genericService:GenericService
  ) { }

  ngOnInit() {
  }

  selectLaycredit(changeContext: ChangeContext): void {
    
    this.selectedLayCredit=changeContext.value;
    this.applyLaycredit.emit(this.selectedLayCredit)
  }

  toggleLayCredit(event){
    if(event.target.checked){
      this.laycreditOptions = Object.assign({}, this.laycreditOptions, {disabled: false});
      this.applyLaycredit.emit(this.selectedLayCredit)
    }
    else{
      this.laycreditOptions = Object.assign({}, this.laycreditOptions, {disabled: true});
      this.applyLaycredit.emit(0)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['redeemableLayPoints']!='undefined') {

      if(this.totalLaycreditPoints > Number(this.sellingPrice)){
        this.laycreditOptions = Object.assign({}, this.laycreditOptions, {ceil : changes['redeemableLayPoints'].currentValue});    
      }
      else if(changes['redeemableLayPoints'].currentValue < this.totalLaycreditPoints){
        this.laycreditOptions = Object.assign({}, this.laycreditOptions, {ceil : changes['redeemableLayPoints'].currentValue});    
      }
      else{
        this.laycreditOptions = Object.assign({}, this.laycreditOptions, {ceil : this.totalLaycreditPoints});
      }
    }
  }
}
