import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../../../services/flight.service';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cancellation-policy-popup',
  templateUrl: './cancellation-policy-popup.component.html',
  styleUrls: ['./cancellation-policy-popup.component.scss']
})
export class CancellationPolicyPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  cancellationPolicy:string;
  errorMessage:string;
  loadCancellationPolicy:boolean=false;
  constructor(
    private flightService:FlightService,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    let routeCode = this.route.snapshot.paramMap.get('rc')
    this.getCancellationPolicy(routeCode);
  }

  getCancellationPolicy(routeCode) {
    this.loadCancellationPolicy=true;
    this.flightService.getCancellationPolicy(routeCode).subscribe((data:any) => {
      this.cancellationPolicy = data.cancellation_policy;
      this.loadCancellationPolicy=false;
    }, (err) => {
      this.errorMessage = err.message;
      this.loadCancellationPolicy=false;
    });
  }
}
