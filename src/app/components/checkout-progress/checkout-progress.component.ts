import { Component, OnInit, Input } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-progress',
  templateUrl: './checkout-progress.component.html',
  styleUrls: ['./checkout-progress.component.scss']
})
export class CheckoutProgressComponent implements OnInit {

  @Input() progressStep;
  progressArray = [];
  s3BucketUrl = environment.s3BucketUrl;
 

  constructor(
    private cartService: CartService,
  ) { }

  ngOnInit() {
    
  }

}
