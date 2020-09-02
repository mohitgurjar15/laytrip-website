import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-adult-list',
  templateUrl: './adult-list.component.html',
  styleUrls: ['./adult-list.component.scss']
})
export class AdultListComponent implements OnInit {
  @Output() checkekCounter = new EventEmitter();
  @Input() travelers:any=[];
  @Input() username:string;
  
  constructor() { }

  ngOnInit() {
    console.log(this)
  } 
  counter : any = 0;
  checked : boolean = false;
  
  checkBox(enent){
    this.counter++; // counter is the varible
    if(this.counter%2==1){
      this.checked= true; //checked is the variable
    } else{
      this.checked=false;
    }
    this.checkekCounter.emit(this.counter);
  }


  ngOnChanges(changes) {
    if (changes['traveler']) {
      console.log("this.traveler",this.travelers)
    }
  }

  onSubmit() {

  }
}
