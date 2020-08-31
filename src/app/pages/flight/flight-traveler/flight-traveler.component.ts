import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TravelerService } from '../../../services/traveler.service';

@Component({
  selector: 'app-flight-traveler',
  templateUrl: './flight-traveler.component.html',
  styleUrls: ['./flight-traveler.component.scss']
})
export class FlightTravelerComponent implements OnInit {

  constructor(
    private travelerService:TravelerService
  ) { }
  s3BucketUrl = environment.s3BucketUrl;
  travelers:any=[]

  ngOnInit() {
    this.getTravelers();
  }

  getTravelers(){

    this.travelerService.getTravelers().subscribe((res:any)=>{
      this.travelers = res.data;
      console.log(this.travelers )
    })
  }
}
