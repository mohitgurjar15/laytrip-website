import { Component, Input, OnInit,  SimpleChanges } from '@angular/core';
import { CheckOutService } from '../../services/checkout.service';
@Component({
  selector: 'app-traveler-list',
  templateUrl: './traveler-list.component.html',
  styleUrls: ['./traveler-list.component.scss']
})
export class TravelerListComponent implements OnInit {

  @Input() totalPassenger;
  @Input() travelers:[];
  selectedTravelers;

  constructor(
    private checkOutService:CheckOutService
  ) { }

  ngOnInit(): void {
    this.checkOutService.getTraveler.subscribe(
      traveler => {
        this.selectedTravelers=traveler;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['travelers']) {
      this.travelers = changes['travelers'].currentValue;
    }
  }
}
