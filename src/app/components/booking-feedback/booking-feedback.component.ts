import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-booking-feedback',
  templateUrl: './booking-feedback.component.html',
  styleUrls: ['./booking-feedback.component.scss']
})
export class BookingFeedbackComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  feedbackForm: FormGroup;
  submitted : boolean = false;
  is_rating = false;
  _rating = '';
  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,

  ) { }

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      rating: [''],
      comment: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.feedbackForm.invalid) {
      this.submitted = true;
      return;
    } else {
      let jsonData = {
        booking_id: 22323,
        rating: 5,
        message: this.feedbackForm.value.comment,
      };
      this.flightService.addFeedback(jsonData).subscribe((data: any) => {
        
      }, (error: HttpErrorResponse) => {

      });
    }
  }

  selectRating(event, rating) {
    this._rating = '';
    this.is_rating = false;
    if (rating == 'B') {
      this._rating = 'B';
    } else if (rating == 'G') {
      this._rating = 'G';
    } else if (rating == 'E') {
      this._rating = 'E';
    } else {
      this.is_rating = false;
      this._rating = '';
    }
    this.is_rating = true;
  }
}
