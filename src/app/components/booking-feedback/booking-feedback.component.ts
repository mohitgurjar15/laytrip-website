import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-feedback',
  templateUrl: './booking-feedback.component.html',
  styleUrls: ['./booking-feedback.component.scss']
})
export class BookingFeedbackComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() bookingId:number;
  feedbackForm: FormGroup;
  submitted : boolean = false;
  is_rating = true;
  loading = false;
  ratingValue = 5;
  _rating = 'Excllent';
  @Output() feedbackValueChange = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      rating: [''],
      comment: ['', Validators.required],
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.feedbackForm.invalid) {
      this.submitted = true;
      this.loading = false;
      return;
    } else {
      let jsonData = {
        booking_id: this.bookingId,
        rating: this.ratingValue,
        message: this.feedbackForm.value.comment,
      };
      this.flightService.addFeedback(jsonData).subscribe((data: any) => {
        this.feedbackValueChange.emit(true);
        this.loading = false;
      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(error.message, 'Error',{positionClass:'toast-top-center',easeTime:1000});
      });
    }
  }

  selectRating(event, rating) {
   
    if (rating == 'Terrible') {
      this._rating = 'Terrible';
      this.ratingValue = 1;
    } else if (rating == 'Bad') {
      this._rating = 'Bad';
      this.ratingValue = 2;
    } else if (rating == 'Okay') {
      this._rating = 'Okay';
      this.ratingValue = 3;
    }  else if (rating == 'Good') {
      this._rating = 'Good';
      this.ratingValue = 4;
    } else if (rating == 'Excllent') {
      this.ratingValue = 5;
      this._rating = 'Excllent';
    } 
  }

  close() {
    this.feedbackValueChange.emit(true);
  }
}
