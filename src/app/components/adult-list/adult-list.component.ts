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
  @Input() type:string;
  @Input() age:string;

  counter  = 0;
  checked : boolean = false;
  isLoggedIn : boolean = false;
  showAddAdultForm : boolean = false;
  adultFormStatus : boolean = false;
  count =0;
  containers = [];
  constructor() { }

  ngOnInit() {
    this.checkUser();
    if(this.type == 'adult' && !this.isLoggedIn){
      this.showAddAdultForm = true;
    }
  } 


  checkBox(event){
    if(event.target.checked){
      this.counter++;
    } else {
      this.counter--;
    }
    console.log(this.counter)
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
    this.showAddAdultForm = !this.showAddAdultForm;
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

  getFormStatus(status){  
    this.adultFormStatus = status;
  }
}
