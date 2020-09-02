import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-adult-list',
  templateUrl: './adult-list.component.html',
  styleUrls: ['./adult-list.component.scss']
})
export class AdultListComponent implements OnInit {
  @Output() adultsCount = new EventEmitter();
  @Input() travelers:any=[];
  @Input() username:string;

  counter : any = 0;
  checked : boolean = false;
  isLoggedIn : boolean = false;
  showAddAdultForm : boolean = false;
  count =0;
  containers = [];
  constructor() { }

  ngOnInit() {
    this.checkUser();
  } 


  checkBox(event){
   
    this.counter++; // counter is the varible
    if(this.counter%2==1){
      this.checked= true; //checked is the variable
    } else{
      this.checked=false;
    }
    this.adultsCount.emit(this.counter); 
  }


  ngOnChanges(changes) {
    if (changes['traveler']) {
      console.log("this.traveler",this.travelers)
    }
  }
  
  onSubmit() {
    
  }
  ngDoCheck() {
    this.containers = this.containers;
  }
  
  addAdultForm() {    
    this.showAddAdultForm = true;
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');
    
    if( userToken) {
      this.isLoggedIn = true;
    }
  }

  pushTraveler(event){
    this.travelers.push(event);
    this.showAddAdultForm = false;
  }
}
