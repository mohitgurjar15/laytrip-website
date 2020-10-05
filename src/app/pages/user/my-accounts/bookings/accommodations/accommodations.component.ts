import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.scss']
})
export class AccommodationsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;

  isNotFound:boolean= true;
  constructor() { }

  ngOnInit() {
  }

}
