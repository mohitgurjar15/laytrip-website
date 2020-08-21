import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-benefit',
  templateUrl: './user-benefit.component.html',
  styleUrls: ['./user-benefit.component.scss']
})
export class UserBenefitComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
