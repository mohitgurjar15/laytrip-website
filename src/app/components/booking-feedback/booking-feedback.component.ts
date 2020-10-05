import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-booking-feedback',
  templateUrl: './booking-feedback.component.html',
  styleUrls: ['./booking-feedback.component.scss']
})
export class BookingFeedbackComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;

  constructor() { }

  ngOnInit() {
  }

}
