import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-baggage-policy-popup',
  templateUrl: './baggage-policy-popup.component.html',
  styleUrls: ['./baggage-policy-popup.component.scss']
})
export class BaggagePolicyPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  loadBaggageDetails:boolean=false;
  baggageDetails=[]
  isError:boolean=false;
  errorMessage:string;
  constructor(
    private flightService:FlightService,
    private route:ActivatedRoute
  ) { }
  

  ngOnInit() {
    let routeCode = this.route.snapshot.paramMap.get('rc')
    this.getBaggageDetails(routeCode);  
  }

  getBaggageDetails(routeCode) {
    this.loadBaggageDetails = true;
    this.flightService.getBaggageDetails(routeCode).subscribe((data:[]) => {
      this.baggageDetails = data;
      this.loadBaggageDetails = false;
    },
    (error)=>{
      this.isError=true;
      this.loadBaggageDetails = false;
      this.errorMessage=error.message;
    }
    );
  }

}
