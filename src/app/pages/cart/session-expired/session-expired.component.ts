import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    window.location.reload();
  }
}
