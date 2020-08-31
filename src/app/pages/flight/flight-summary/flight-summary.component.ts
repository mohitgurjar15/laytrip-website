import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FlightService } from '../../../services/flight.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-summary',
  templateUrl: './flight-summary.component.html',
  styleUrls: ['./flight-summary.component.scss']
})
export class FlightSummaryComponent implements OnInit {

  routeCode:string='';
  constructor(
    public flightService:FlightService,
    private route: ActivatedRoute
  ) { 
      
  }
  s3BucketUrl = environment.s3BucketUrl;
  flightDetail:any=[];
  ngOnInit() {
    this.airRevalidate();
  }

  airRevalidate(){

      let routeData={
        route_code: this.route.snapshot.paramMap.get('rc')
      }
      this.flightService.airRevalidate(routeData).subscribe((response:any)=>{
          console.log(response)
          this.flightDetail=response;
      })
  }
}
