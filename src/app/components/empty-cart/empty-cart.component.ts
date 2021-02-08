import { Component, OnInit, Renderer2 } from '@angular/core';
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
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    $('#cart_modal').modal('show');
    this.renderer.addClass(document.body, 'bg_color');
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'bg_color');
  }

}
