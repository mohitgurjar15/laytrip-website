import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-vacation-rental-search-bar',
  templateUrl: './vacation-rental-search-bar.component.html',
  styleUrls: ['./vacation-rental-search-bar.component.scss']
})
export class VacationRentalSearchBarComponent implements OnInit {
  
  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
