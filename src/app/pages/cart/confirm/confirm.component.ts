import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';
import { cardType } from '../../../_helpers/card.helper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingCompletionErrorPopupComponent } from '../../../components/booking-completion-error-popup/booking-completion-error-popup.component';

declare var $: any;

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  bookingId: string = '';
  cartDetails;
  loading:boolean=false;
  cardType = cardType;
  isFeedbackPage = false;
  anyBookingStatus:boolean=true;
  allBookingStatus:boolean=true;
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private cartService: CartService,
    public commonFunction: CommonFunction,
    private modalService: NgbModal,
  ) {
    this.bookingId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.renderer.addClass(document.body, 'cms-bgColor');
    this.getBookingDetails(this.bookingId);
    setTimeout(() => {
      if (localStorage.getItem('$bkg') !== this.cartDetails.laytripCartId) {
        this.isFeedbackPage = true;
      }
    }, 25000);
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'cms-bgColor');
  }

  getBookingDetails(bookingId) {

    this.loading = true;
    this.cartService.getBookingDetails(bookingId).subscribe((res: any) => {
      this.loading = false;
      this.cartDetails = res;
      let allBookingStatus=[];
      for(let i=0; i <this.cartDetails.booking.length; i ++){
        if(this.cartDetails.booking[i].bookingStatus==2){
          this.anyBookingStatus=false;
          allBookingStatus.push('failed')
        }
      }
      if(this.anyBookingStatus==false){
        this.openBookingCompletionErrorPopup();
      }

      if(allBookingStatus.length==this.cartDetails.booking.length){
        this.allBookingStatus=false;
      }
    }, error => {
      this.loading = false;
    })    
  }

  feedbackValueChange(event) {
    if (event) {
      this.isFeedbackPage = event.isModalOpen;
    }
  }

  openBookingCompletionErrorPopup() {
    this.modalService.open(BookingCompletionErrorPopupComponent, {
      windowClass: 'booking_completion_error_block', centered: true, backdrop: 'static',
      keyboard: false
    }).result.then((result) => {

    });
  }

  // Author: xavier | 2021/7/13
  // Description: Report total purchase amount back to GTM
  ngAfterViewInit() {
    //alert(this.cartDetails.totalAmount);
    window['dataLayer'].push({'event': this.cartDetails.totalAmount});
  }
}