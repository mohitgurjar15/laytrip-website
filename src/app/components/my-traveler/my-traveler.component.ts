import { Component, Input, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { CheckOutService } from '../../services/checkout.service'
@Component({
  selector: 'app-my-traveler',
  templateUrl: './my-traveler.component.html',
  styleUrls: ['./my-traveler.component.scss']
})
export class MyTravelerComponent implements OnInit {

  @Input() travelers;
  @Input() traveler_number;
  selectedTraveler:string='123';
  constructor(
    private checkOutService:CheckOutService
  ) { }

  ngOnInit(): void {
    this.checkOutService.getTravelers.subscribe(travelers => this.travelers=travelers)
    
  }

  selectTraveler(userId){

    this.selectedTraveler=userId;
    console.log(this.selectedTraveler)
    let traveler = this.travelers.find(item=> item.userId==userId)
    traveler['traveler_number']=this.traveler_number
    this.checkOutService.selectTraveler(traveler)
  }

  removeTraveler(userId){
    this.selectedTraveler='';
    let  traveler = { traveler_number: this.traveler_number };
    this.checkOutService.selectTraveler(traveler)
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  
}
