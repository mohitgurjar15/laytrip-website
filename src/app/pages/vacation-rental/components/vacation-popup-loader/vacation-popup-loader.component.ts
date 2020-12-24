import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-vacation-popup-loader',
  templateUrl: './vacation-popup-loader.component.html',
  styleUrls: ['./vacation-popup-loader.component.scss']
})
export class VacationPopupLoaderComponent implements OnInit {
 
  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
