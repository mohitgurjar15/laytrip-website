import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-confirm',
  templateUrl: './flight-confirm.component.html',
  styleUrls: ['./flight-confirm.component.scss']
})
export class FlightConfirmComponent implements OnInit {

  bookingResult: any = {};

  priceData: any = [];

  constructor() { }

  ngOnInit() {
  }

}
