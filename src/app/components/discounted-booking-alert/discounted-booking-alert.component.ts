import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-discounted-booking-alert',
  templateUrl: './discounted-booking-alert.component.html',
  styleUrls: ['./discounted-booking-alert.component.scss']
})
export class DiscountedBookingAlertComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

}
