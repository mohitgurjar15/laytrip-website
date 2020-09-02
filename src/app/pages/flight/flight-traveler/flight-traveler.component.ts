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
  clickCounter = 0;  
  routeCode:string='';
  loading=true;
  progressStep={ step1:true, step2:false, step3:false };
  ngOnInit() {
    this.routeCode = this.route.snapshot.paramMap.get('rc')
    this.getTravelers();
  }

  getTravelers(){
    this.travelerService.getTravelers().subscribe((res:any)=>{
      this.travelers = res.data;
      this.loading = false;
      console.log(this.travelers )
    })
  }

  getAdultCount(count: number) {    
    this.clickCounter = count;
  }
}
