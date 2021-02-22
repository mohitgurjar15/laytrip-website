import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CheckOutService } from '../../services/checkout.service'
@Component({
  selector: 'app-my-traveler',
  templateUrl: './my-traveler.component.html',
  styleUrls: ['./my-traveler.component.scss']
})
export class MyTravelerComponent implements OnInit {

  travelers;
  @Input() traveler_number;
  @Input() travelerId;
  @Input() traveler_type: string;
  traveler: any = {}
  constructor(
    private checkOutService: CheckOutService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkOutService.getTravelers.subscribe(travelers => this.travelers = travelers)
  }

  selectTraveler(traveler) {

    traveler.traveler_number = this.traveler_number;
    this.travelerId = traveler.userId;
    this.checkOutService.selectTraveler(traveler);
    this.cd.detectChanges();
  }

  // removeTraveler(userId) {
  //   this.travelerId = '';
  //   let traveler = { traveler_number: this.traveler_number };
  //   this.checkOutService.selectTraveler(traveler);
  //   this.cd.detectChanges();
  // }
}
