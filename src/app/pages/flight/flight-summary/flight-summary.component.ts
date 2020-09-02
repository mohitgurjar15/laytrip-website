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
  outwardDetails:boolean=false;
  inwardDetails:boolean=false;
  outWardStopCount:number=0;
  inWardStopCount:number=0;
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
          this.outWardStopCount=response[0].routes[0].stops.length-1;
          this.inWardStopCount =typeof response[0].routes[1] ? response[0].routes[1].stops.length-1:0;
      })
  }

  toggleRouteDetails(type){

    if(type=='onward'){
      this.outwardDetails=!this.outwardDetails;
    }
    if(type=='inward'){
      this.inwardDetails = !this.inwardDetails;
    }
  }
}
