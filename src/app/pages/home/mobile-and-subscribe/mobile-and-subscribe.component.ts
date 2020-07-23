import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mobile-and-subscribe',
  templateUrl: './mobile-and-subscribe.component.html',
  styleUrls: ['./mobile-and-subscribe.component.scss']
})
export class MobileAndSubscribeComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
