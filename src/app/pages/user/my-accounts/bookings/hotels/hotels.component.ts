import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {
  isNotFound:boolean= true;
  s3BucketUrl = environment.s3BucketUrl;

  
  constructor() { }

  ngOnInit() {
  }

}
