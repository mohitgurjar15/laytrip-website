import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-partial-payment',
  templateUrl: './partial-payment.component.html',
  styleUrls: ['./partial-payment.component.scss']
})
export class PartialPaymentComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor(    public router: Router
    ) { }

  ngOnInit() {
  }

  redirectToAboutPage(){
    this.router.navigate(['/about/']);
  }
}
