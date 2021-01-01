import { Component, Input, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { CheckOutService } from '../../services/checkout.service'
@Component({
  selector: 'app-my-traveler',
  templateUrl: './my-traveler.component.html',
  styleUrls: ['./my-traveler.component.scss']
})
export class MyTravelerComponent implements OnInit {

  @Input() travelers;
  constructor(
    private checkOutService:CheckOutService
  ) { }

  ngOnInit(): void {
  }

  chooseTraveler(userId){

    let traveler = this.travelers.find(item=> item.userId==userId)
    this.checkOutService.selectTraveler(traveler)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['travelers']) {
      this.travelers = changes['travelers'].currentValue;
    }
  }

  
}
