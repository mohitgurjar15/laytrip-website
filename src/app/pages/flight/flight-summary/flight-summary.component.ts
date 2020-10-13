import { Component, OnInit, Output,EventEmitter, Input, SimpleChanges } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FlightService } from '../../../services/flight.service';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { CommonFunction } from '../../../_helpers/common-function';
@Component({
  selector: 'app-flight-summary',
  templateUrl: './flight-summary.component.html',
  styleUrls: ['./flight-summary.component.scss']
})
export class FlightSummaryComponent implements OnInit {
  @Output() totalTravelerValue = new EventEmitter();
  @Output() flightAvailable= new EventEmitter();
  @Input() showPartialPayemntOption:boolean=false;
  @Input() checkAvailability:string;
  @Input() flightSummary:string;
  @Input() partialPaymentAmount:number=0;
  @Input() payNowAmount:number=0;

  routeCode:string='';
  constructor(
    public flightService:FlightService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
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
  showBaggePolicy:boolean=false;
  showCancellationPolicy:boolean=false;

  @Output() getRouteDetails = new EventEmitter();

  ngOnInit() {

    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.routeCode=this.route.snapshot.paramMap.get('rc');

    if(this.checkAvailability=='local'){
      this.getFlightSummary()
    } else if(this.checkAvailability=='trip-details') {
      this.flightDetail = this.flightSummary;
      this.flightSummaryLoader = false;
    }else{      
      this.airRevalidate();
    }
    
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
          this.totalTravelerValue.emit(this.totalTraveler);
          
          this.getRouteDetails.emit(response);

        },(error)=>{
          
          this.flightAvailable.emit(true)
      })
  }

  getFlightSummary(){

    let __route = sessionStorage.getItem('__route');
    let _itinerary = sessionStorage.getItem('_itinerary');
    try{
      let response  = JSON.parse(__route);
      let response_itinerary  = JSON.parse(_itinerary);
      response[0]=response;
      this.flightDetail=response;
      this.flightSummaryLoader=false;
      this.outWardStopCount=response[0].routes[0].stops.length-1;
      // this.totalTraveler = parseInt(response[0].adult_count) + (parseInt(response[0].child_count) || 0) + ( parseInt(response[0].infant_count) || 0)  
      this.totalTraveler = parseInt(response_itinerary.adult) + (parseInt(response_itinerary.child) || 0) + ( parseInt(response_itinerary.infant) || 0)  
      this.inWardStopCount =typeof response[0].routes[1]!='undefined' ? response[0].routes[1].stops.length-1:0;
      this.totalTravelerValue.emit(this.totalTraveler);
      this.getRouteDetails.emit(response);
    }
    catch(error){

      this.flightAvailable.emit(true)
    }
  }

  toggleRouteDetails(type){

    if(type=='onward'){
      this.outwardDetails=!this.outwardDetails;
    }
    if(type=='inward'){
      this.inwardDetails = !this.inwardDetails;
    }
  }

  toggleBaggagePolicy(){
    this.showBaggePolicy=true;
  }

  toggleCancellationPolicy(){
    this.showCancellationPolicy=true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['partialPaymentAmount']) {
      this.partialPaymentAmount = changes['partialPaymentAmount'].currentValue;
    }
  }
}
