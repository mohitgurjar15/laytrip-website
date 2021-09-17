import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { environment } from '../../../../environments/environment';
import { CommonFunction } from '../../../_helpers/common-function';
import { cardType } from '../../../_helpers/card.helper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingCompletionErrorPopupComponent } from '../../../components/booking-completion-error-popup/booking-completion-error-popup.component';
import { DecimalPipe } from '@angular/common';

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
    public modalService: NgbModal,
    private decimalPipe: DecimalPipe
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
        if (this.cartDetails.booking[i].bookingStatus == 2) {
          this.anyBookingStatus=false;
          allBookingStatus.push('failed')
        }
      }
      if(allBookingStatus.length==this.cartDetails.booking.length){
        this.allBookingStatus=false;
      }
      console.log(this.allBookingStatus)
      if(this.anyBookingStatus==false){
        this.openBookingCompletionErrorPopup();
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
    const modalRef = this.modalService.open(BookingCompletionErrorPopupComponent, {
      windowClass: 'booking_completion_error_block', centered: true, backdrop: 'static',
      keyboard: false
    });
    (<BookingCompletionErrorPopupComponent>modalRef.componentInstance).isSingleBooingConfirmedFromCart = this.allBookingStatus;
  }

  ngAfterViewInit() {
    this.setupGTMEventHandlers();
  }

  // Author: xavier | 2021/7/16
  // Description: Report total purchase amount back to GTM
  setupGTMEventHandlers() {
    let details = $('.detail_liners');
    if(details.length == 0) {
      setTimeout(() => this.setupGTMEventHandlers(), 500);
      return;
    }

    for(let i = 0; i < details.length; i++) {
      if(details[i].innerText.indexOf("Total Price") > -1) {
        let spans: HTMLSpanElement[] = details.eq(i).find('span');
        let totalStr: string = spans[spans.length - 1].innerText;
        let totalNum: number = (+totalStr.replace(/[^0-9]/g, '')) / 100.0;
        window['dataLayer'].push({'event': 'revenue', 'total_amount': totalNum});

        break;
      }
    }
  }

  beforeDesimal(value){
    value = this.transformDecimal(value)
    return (value.toString().split(".")[0]) == 0 ? "00" : (value.toString().split(".")[0])
  }

  afterDesimal(value){
    value = this.transformDecimal(value)
    return (value.toString().split(".")[1]) == 0 ? "00" : (value.toString().split(".")[1])
  }

  transformDecimal(num) {
    return this.decimalPipe.transform(num, '1.2-2');
  }
}