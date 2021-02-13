import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { environment } from '../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  bookingId:string='';
  bookingDetails;
  constructor(
    private renderer: Renderer2,
    private route:ActivatedRoute,
    private cartService:CartService
  ) {
    this.bookingId = this.route.snapshot.paramMap.get('id');
   }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'cms-bgColor');
    this.getBookingDetails(this.bookingId)
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'cms-bgColor');
  }

  getBookingDetails(bookingId){

    this.cartService.getBookingDetails(bookingId).subscribe((res:any)=>{
      
    },error=>{

    })
  }
}
