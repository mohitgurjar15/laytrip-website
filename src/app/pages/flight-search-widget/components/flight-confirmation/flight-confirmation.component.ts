import { Component, OnInit, Input } from '@angular/core';
import { getLoginUserInfo } from '../../../../_helpers/jwt.helper';
import { CommonFunction } from '../../../../_helpers/common-function';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-confirmation',
  templateUrl: './flight-confirmation.component.html',
  styleUrls: ['./flight-confirmation.component.scss']
})
export class FlightConfirmationComponent implements OnInit {

  constructor(
    private commonFunction:CommonFunction,
    public router:Router
  ) { }
  userData;
  s3BucketUrl = environment.s3BucketUrl;
  @Input() bookingData;

  ngOnInit() {
    this.userData = getLoginUserInfo();
  }
  backToHome(){
    this.router.navigate([''])
  }

}
