import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flight-summary',
  templateUrl: './flight-summary.component.html',
  styleUrls: ['./flight-summary.component.scss']
})
export class FlightSummaryComponent implements OnInit {

  constructor(
    public flightService:FlightService
  ) { }
  s3BucketUrl = environment.s3BucketUrl;
  flightDetail:any=[];
  ngOnInit() {
    this.airRevalidate();
  }

  airRevalidate(){

      let routeData={
        route_code: "RTBmaEIzTHFrSWRXeTczSXVaUmIrbGhuMTgrd3FQazNDSmdIUU0xOW1VR0NWOTh3cVNVempyRlZRSEMzMlhRSmtDY01wZGVvS2JiSlRmSnZ5NVJMUW1oMC9ENTU1djYzcm5DRnJ2bGlCbXBjbzlYdEcwKzRXOXl3SHp1QytTdk4="
      }
      this.flightService.airRevalidate(routeData).subscribe((response:any)=>{
          console.log(response)
          this.flightDetail=response;
      })
  }
}
