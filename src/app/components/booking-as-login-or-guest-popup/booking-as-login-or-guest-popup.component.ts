import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-as-login-or-guest-popup',
  templateUrl: './booking-as-login-or-guest-popup.component.html',
  styleUrls: ['./booking-as-login-or-guest-popup.component.scss']
})
export class BookingAsLoginOrGuestPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  userType:string='login';
  routeCode:string;

  constructor(
    private route: ActivatedRoute
  ) { }
  ngOnInit() {
  	this.routeCode = this.route.snapshot.paramMap.get('rc');
  }

  bookingAs(type){

  	this.userType=type;
  	if(type=='guest'){
  	}
  }

}
