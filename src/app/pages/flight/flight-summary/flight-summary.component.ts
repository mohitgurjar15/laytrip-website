import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FlightService } from '../../../services/flight.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunction } from '../../../_helpers/common-function';

@Component({
  selector: 'app-flight-summary',
  templateUrl: './flight-summary.component.html',
  styleUrls: ['./flight-summary.component.scss']
})
export class FlightSummaryComponent implements OnInit {

  routeCode:string='';
  constructor(
    public flightService:FlightService,
    private route: ActivatedRoute,
    private router:Router,
    private commonFunction:CommonFunction
  ) { 
      
  }
  s3BucketUrl = environment.s3BucketUrl;
  flightDetail:any=[];
  outwardDetails:boolean=false;
  inwardDetails:boolean=false;
  outWardStopCount:number=0;
  inWardStopCount:number=0;
  flightSummaryLoader:boolean=true;
  totalTraveler:number=1;
  currency;
  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.airRevalidate();
  }
  
  
  airRevalidate(){

      let routeData={
        route_code: this.route.snapshot.paramMap.get('rc')
      }
      this.flightService.airRevalidate(routeData).subscribe((response:any)=>{
          this.flightDetail=response;
          this.flightSummaryLoader=false;
          this.outWardStopCount=response[0].routes[0].stops.length-1;
          this.totalTraveler = parseInt(response[0].adult_count) + (parseInt(response[0].child_count) || 0) + ( parseInt(response[0].infant_count) || 0)  
          this.inWardStopCount =typeof response[0].routes[1]!='undefined' ? response[0].routes[1].stops.length-1:0;
      },(error)=>{
          console.log("error",error)
          if(error.status==404){
            //this.router.navigate(['/'])
          }
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
