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
    this.totalLaycredit();
    console.log("Im in",this.sellingPrice)
    
  }

  totalLaycredit(){
    this.genericService.getAvailableLaycredit().subscribe((res:any)=>{
      this.totalLaycreditPoints=res.total_available_points;
      if(this.totalLaycreditPoints){
        if(this.totalLaycreditPoints > Number(this.sellingPrice)){
          this.laycreditOptions = Object.assign({}, this.laycreditOptions, {ceil : this.sellingPrice});    
        }
        else{
          this.laycreditOptions = Object.assign({}, this.laycreditOptions, {ceil : this.totalLaycreditPoints});
        }
      }
    },(error=>{

    }))
  }

  selectLaycredit(changeContext: ChangeContext): void {
    
    this.selectedLayCredit=changeContext.value;
    this.applyLaycredit.emit(this.selectedLayCredit)
  }

  toggleLayCredit(event){
    console.log("Innn")
    if(event.target.checked){
      console.log(this.laycreditOptions)
      this.laycreditOptions = Object.assign({}, this.laycreditOptions, {disabled: false});
      this.applyLaycredit.emit(this.selectedLayCredit)
    }
    else{
      this.laycreditOptions = Object.assign({}, this.laycreditOptions, {disabled: true});
      this.applyLaycredit.emit(0)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("yupp",changes)
    if (changes['sellingPrice'].currentValue!='undefined') {
      
        this.sellingPrice = changes['sellingPrice'].currentValue;
        console.log("sp",this.sellingPrice)
        if(this.totalLaycreditPoints > Number(this.sellingPrice)){
          this.laycreditOptions = Object.assign({}, this.laycreditOptions, {ceil : this.sellingPrice});    
        }
        else{
          this.laycreditOptions = Object.assign({}, this.laycreditOptions, {ceil : this.totalLaycreditPoints});
        }

        console.log("===",this.laycreditOptions)
            
    }
  }
}
