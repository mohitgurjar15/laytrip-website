import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-home-rentals',
  templateUrl: './home-rentals.component.html',
  styleUrls: ['./home-rentals.component.scss']
})
export class HomeRentalsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;

  isNotFound:boolean= true;
  constructor() { }

  ngOnInit() {
  }

}
