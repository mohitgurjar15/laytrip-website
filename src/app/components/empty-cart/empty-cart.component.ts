import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-empty-cart',
  templateUrl: './empty-cart.component.html',
  styleUrls: ['./empty-cart.component.scss']
})
export class EmptyCartComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor(
    private renderer: Renderer2,
    public router: Router,
    public activeModal: NgbActiveModal,
    public commonFunction: CommonFunction
  ) { }

  ngOnInit(): void {
    $('#cart_modal').modal('show');
    this.renderer.addClass(document.body, 'cms-bgColor');
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'cms-bgColor');
  }

  redirectToHome() {
    $('#cart_modal').modal('hide');
    this.activeModal.close();
    if(this.commonFunction.isRefferal()){
      var parms = this.commonFunction.getRefferalParms();
      this.router.navigate(['/'],{ queryParams : {utm_source:parms.utm_source,utm_medium:parms.utm_medium}});
    } else {
      this.router.navigate(['/']);
    }

  }

  close() {
    $('#cart_modal').modal('hide');
    this.activeModal.close();
    let url = window.location.href;
    if (url.includes('cart/booking') || url.includes('cart/checkout')) {
      if(this.commonFunction.isRefferal()){
        var parms = this.commonFunction.getRefferalParms();
        this.router.navigate(['/'],{ queryParams : {utm_source:parms.utm_source,utm_medium:parms.utm_medium}});
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}
