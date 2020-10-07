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
  is_rating = false;
  _rating = '';
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
    if (this.feedbackForm.invalid) {
      this.submitted = true;
      return;
    } else {
      let jsonData = {
        booking_id: this.bookingId,
        rating: 5,
        message: this.feedbackForm.value.comment,
      };
      this.flightService.addFeedback(jsonData).subscribe((data: any) => {
        this.feedbackValueChange.emit(true);
      }, (error: HttpErrorResponse) => {
        this.toastr.error(error.message, 'Error',{positionClass:'toast-top-center',easeTime:1000});
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

  close() {
    this.feedbackValueChange.emit(true);
  }
}
