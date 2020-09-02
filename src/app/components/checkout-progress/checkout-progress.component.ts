import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout-progress',
  templateUrl: './checkout-progress.component.html',
  styleUrls: ['./checkout-progress.component.scss']
})
export class CheckoutProgressComponent implements OnInit {

  constructor() { }
  @Input() progressStep;
  s3BucketUrl = environment.s3BucketUrl;
  ngOnInit() {
  }

}
