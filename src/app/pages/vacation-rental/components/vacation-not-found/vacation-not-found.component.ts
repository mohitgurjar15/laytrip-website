import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-vacation-not-found',
  templateUrl: './vacation-not-found.component.html',
  styleUrls: ['./vacation-not-found.component.scss']
})
export class VacationNotFoundComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor() { }

  ngOnInit() {
  }

}
