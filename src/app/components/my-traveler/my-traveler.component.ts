import { Component, Input, OnInit, Output, SimpleChanges,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CheckOutService } from '../../services/checkout.service'
@Component({
  selector: 'app-my-traveler',
  templateUrl: './my-traveler.component.html',
  styleUrls: ['./my-traveler.component.scss']
})
export class MyTravelerComponent implements OnInit {

  @Input() travelers;
  @Input() traveler_number;
  @Input() travelerId;
  traveler:any={}
  constructor(
    private checkOutService:CheckOutService
  ) { }

  ngOnInit(): void {
    console.log("Helllo", this.travelerId)
    /* if(this.travelerId){
      this.selectedTraveler=this.travelerId;
    } */
    this.checkOutService.getTravelers.subscribe(travelers => this.travelers=travelers)
    
  }

  selectTraveler(traveler){
    //console.log("My traveler",traveler)

    traveler.traveler_number=this.traveler_number;

    this.travelerId=traveler.userId;

    //console.log(this.selectedTraveler,"Selected traveler:::::")

    //setTimeout(()=>{this.checkOutService.selectTraveler(traveler)},100)
    this.checkOutService.selectTraveler(traveler)
    
  }

  removeTraveler(userId){
    /* this.selectedTraveler='';
    let  traveler = { traveler_number: this.traveler_number };
    this.checkOutService.selectTraveler(traveler) */
  }
}
