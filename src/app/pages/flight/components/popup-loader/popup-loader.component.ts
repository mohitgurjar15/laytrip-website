import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-popup-loader',
  templateUrl: './popup-loader.component.html',
  styleUrls: ['./popup-loader.component.scss']
})
export class PopupLoaderComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
