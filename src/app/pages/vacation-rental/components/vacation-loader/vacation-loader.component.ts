import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-vacation-loader',
  templateUrl: './vacation-loader.component.html',
  styleUrls: ['./vacation-loader.component.scss']
})
export class VacationLoaderComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {

 
  }

}
