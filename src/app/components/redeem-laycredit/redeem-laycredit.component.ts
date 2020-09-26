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
  totalLaycreditPoints=0;
  value: number = 100;
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
    this.totalLaycredit();
  }

  totalLaycredit(){
    this.genericService.getAvailableLaycredit().subscribe((res:any)=>{
      this.totalLaycreditPoints=res.total_available_points;
      //this.laycreditOptions.ceil=res.total_available_points;
    },(error=>{

    }))
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
      /* const newOptions: Options = Object.assign({}, this.laycreditOptions);
      newOptions.floor = 0;
      this.laycreditOptions = newOptions; */
      this.laycreditOptions = Object.assign({}, this.laycreditOptions, {disabled: true});
      this.applyLaycredit.emit(0)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['sellingPrice'].currentValue!='undefined') {
      if(this.sellingPrice){
        this.sellingPrice = changes['sellingPrice'].currentValue;
        this.laycreditOptions.ceil=Math.floor(this.sellingPrice)
        
        const laycreditOptions: Options = Object.assign({}, this.laycreditOptions);
        if(this.totalLaycreditPoints > this.sellingPrice){
          laycreditOptions.ceil = this.sellingPrice;
        }
        else{
          laycreditOptions.ceil = this.totalLaycreditPoints;
        }
        this.laycreditOptions = laycreditOptions;
      }
    }
  }
}
