import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sort-vacation-rental',
  templateUrl: './sort-vacation-rental.component.html',
  styleUrls: ['./sort-vacation-rental.component.scss']
})
export class SortVacationRentalComponent implements OnInit {
  
  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
