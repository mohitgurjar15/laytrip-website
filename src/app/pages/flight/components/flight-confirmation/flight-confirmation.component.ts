import { Component, OnInit } from '@angular/core';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';

@Component({
  selector: 'app-flight-confirmation',
  templateUrl: './flight-confirmation.component.html',
  styleUrls: ['./flight-confirmation.component.scss']
})
export class FlightConfirmationComponent implements OnInit {

  constructor() { }
  userData;

  ngOnInit() {

    this.userData = getLoginUserInfo();
  }

}
