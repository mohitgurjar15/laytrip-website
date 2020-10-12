import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-booking-as-login-or-guest-popup',
  templateUrl: './booking-as-login-or-guest-popup.component.html',
  styleUrls: ['./booking-as-login-or-guest-popup.component.scss']
})
export class BookingAsLoginOrGuestPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  userType:string='login';
  routeCode:string;
  @Output() isShowGuestPopupValueChange = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router:Router
  ) { }
  ngOnInit() {
  	this.routeCode = this.route.snapshot.paramMap.get('rc');
  }

  bookingAs(type){

    this.userType=type;
    console.log(this.userType)
  	if(type=='guest'){
  	}
  	if(type=='login'){
  	}
  }

  btnContinue(type){
    if(type == 'login'){
      this.isShowGuestPopupValueChange.emit(false);
      $("#sign_in_modal").modal('show');
    } if (type == 'guest'){      
      this.router.navigate(['/flight/traveler',this.routeCode]);      
    }
  }
}
