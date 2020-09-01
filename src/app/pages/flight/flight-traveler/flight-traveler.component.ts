import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TravelerService } from '../../../services/traveler.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-flight-traveler',
  templateUrl: './flight-traveler.component.html',
  styleUrls: ['./flight-traveler.component.scss']
})
export class FlightTravelerComponent implements OnInit {

  constructor(
    private travelerService:TravelerService,
    private route: ActivatedRoute
  ) { }
  s3BucketUrl = environment.s3BucketUrl;
  travelers:any=[]
  routeCode:string='';

  ngOnInit() {
    this.routeCode = this.route.snapshot.paramMap.get('rc')
    this.getTravelers();
  }

  getTravelers(){

    this.travelerService.getTravelers().subscribe((res:any)=>{
      this.travelers = res.data;
      console.log(this.travelers )
    })
  }
}
