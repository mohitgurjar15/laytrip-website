import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var $ : any;
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { GenericService } from 'src/app/services/generic.service';
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
  

  isLoading: boolean;
  constructor(
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private genericService:GenericService
  ) {
    this.flightOneWayDepartureDate = calendar.getToday();
    this.flightOneWayArrivalDate = calendar.getNext(calendar.getToday(), 'd', 7);
    console.log(this.flightOneWayDepartureDate)

    this.isLoading = true;
   }


 

  ngAfterViewInit() {
    this.isLoading = false;
  }

  ngOnInit(): void {
    
     this.loadJquery();
  } 

  onDateSelection(date: NgbDate) {
    console.log(date)
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
    console.log(input)
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
      arrows: false
    });
  }

  
}
