import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-trip-not-found',
  templateUrl: './trip-not-found.component.html',
  styleUrls: ['./trip-not-found.component.scss']
})
export class TripNotFoundComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;

  constructor(private _location: Location) { }

  ngOnInit() {
    window.scroll(0,0);
  }
  backClicked() {
    this._location.back();
  }

}
