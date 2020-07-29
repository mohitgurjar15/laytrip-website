import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var $ : any;
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { GenericService } from 'src/app/services/generic.service';
import { ModuleModel, Module } from 'src/app/model/module.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  hoveredDate: NgbDate | null = null;

  flightOneWayDepartureDate: NgbDate | null;
  flightOneWayArrivalDate: NgbDate | null;
  
  modules:Module[];
  moduleList:any={};

  constructor(
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private genericService:GenericService
  ) {
    this.flightOneWayDepartureDate = calendar.getToday();
    this.flightOneWayArrivalDate = calendar.getNext(calendar.getToday(), 'd', 7);

   }



  ngOnInit(): void {
    
    this.getModules();
    this.loadJquery();
  } 

  onDateSelection(date: NgbDate) {
    if (!this.flightOneWayDepartureDate && !this.flightOneWayArrivalDate) {
      this.flightOneWayDepartureDate = date;
    } else if (this.flightOneWayDepartureDate && !this.flightOneWayArrivalDate && date && date.after(this.flightOneWayDepartureDate)) {
      this.flightOneWayArrivalDate = date;
    } else {
      this.flightOneWayArrivalDate = null;
      this.flightOneWayDepartureDate = date;
    }

  }

  isHovered(date: NgbDate) {
    return this.flightOneWayDepartureDate && !this.flightOneWayArrivalDate && this.hoveredDate && date.after(this.flightOneWayDepartureDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.flightOneWayArrivalDate && date.after(this.flightOneWayDepartureDate) && date.before(this.flightOneWayArrivalDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.flightOneWayDepartureDate) || (this.flightOneWayArrivalDate && date.equals(this.flightOneWayArrivalDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  loadJquery(){
      $(".features-discover").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        centerMode: false,
        focusOnSelect: false,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 481,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
  }

  /**
     * Get All module like (hotel, flight & VR)
     */
    getModules(){
      this.genericService.getModules().subscribe(
        (response:ModuleModel)=>{
          
          response.data.forEach(module=>{
            this.moduleList[module.name] = module; 
          })
          console.log(this.moduleList)
        },
        (error)=>{

        }
      )
    }
  
}
