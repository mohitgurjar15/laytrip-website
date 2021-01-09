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
  constructor(
    private checkOutService:CheckOutService
  ) { }

  ngOnInit(): void {
    //this.checkOutService.getTravelers.subscribe(travelers => this.travelers=travelers)
    
  }

  chooseTraveler(userId){

    let traveler = this.travelers.find(item=> item.userId==userId)
    traveler['traveler_number']=this.traveler_number
    this.checkOutService.selectTraveler(traveler)
    this.checkOutService.selectTravelerNumber(this.traveler_number)
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  
}
