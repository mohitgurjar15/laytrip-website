import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../../../services/flight.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-flight-trip-detail',
  templateUrl: './flight-trip-detail.component.html',
  styleUrls: ['./flight-trip-detail.component.scss']
})
export class FlightTripDetailComponent implements OnInit {
  
  s3BucketUrl = environment.s3BucketUrl;
  bookingId;
  bookingResult: any = {};
  isFlightNotAvailable = false;
  isTripDetailloading = false;

  constructor(
    private route: ActivatedRoute,
    public flightService: FlightService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.bookingId = params['id']);
    this.getBookingDetails();
  }

  getBookingDetails() {
    this.flightService.getFlightBookingDetails(this.bookingId).subscribe((res: any) => {
      this.bookingResult.booking_details = res;
      this.isTripDetailloading = true;
    }, (error: HttpErrorResponse) => {
      this.isTripDetailloading =  false;
      this.isFlightNotAvailable =  true;
      if (error.status === 404) {
      }
    });
  }

}
