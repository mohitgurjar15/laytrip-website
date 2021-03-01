import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.scss']
})
export class FailureComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;

  constructor() { }

  ngOnInit() {
  }

}
