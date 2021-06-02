import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CarouselComponent {

  @Input() slides;
  @Input() currentChangeCounter=0;
  @Output() activeSlide=new EventEmitter();
  previousChangeCounter=0;

  currentSlide = 0;

  constructor(public homeService:HomeService) {

    /* setInterval(( )=>{
      this.onNextClick()
    },4000) */

    this.activityWatcher();

  }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    this.activeSlide.emit(this.currentSlide)
  }
  
  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    this.activeSlide.emit(this.currentSlide)
  }

  activityWatcher(){

    //The number of seconds that have passed
    //since the user was active.
    var secondsSinceLastActivity = 0;

    //Five minutes. 60 x 5 = 300 seconds.
    var maxInactivity = 4;

    //Setup the setInterval method to run
    //every second. 1000 milliseconds = 1 second.
    let self=this;
    setInterval(function(){
      // console.log(self.currentChangeCounter,self.previousChangeCounter)
      if(self.currentChangeCounter!=self.previousChangeCounter){ 
        secondsSinceLastActivity=0;
        self.previousChangeCounter=self.currentChangeCounter;
        return;
      }
      secondsSinceLastActivity++;
      //console.log(secondsSinceLastActivity + ' seconds since the user was last active');
      //if the user has been inactive or idle for longer
      //then the seconds specified in maxInactivity
      if(secondsSinceLastActivity > maxInactivity){
          //console.log('User has been inactive for more than ' + maxInactivity + ' seconds');
          self.onNextClick();
          secondsSinceLastActivity = 0;
      }
    }, 1000);

    //The function that will be called whenever a user is active
    /* function activity(){
        //reset the secondsSinceLastActivity variable
        //back to 0
        secondsSinceLastActivity = 0;
    } */

    //An array of DOM events that should be interpreted as
    //user activity.
    var activityEvents = [
        
    ];
    /* var activityEvents = [
      'scroll'
    ]; */

    //add these events to the document.
    //register the activity function as the listener parameter.
    activityEvents.forEach(function(eventName) {
        document.addEventListener(eventName, ()=>{
          secondsSinceLastActivity = 0;
        }, true);
    });


  }

  ngOnChanges(change:SimpleChange){
    if(typeof change['currentChangeCounter'].currentValue!='undefined'){
      this.currentChangeCounter=change['currentChangeCounter'].currentValue;
      this.previousChangeCounter=change['currentChangeCounter'].previousValue;
    }
  }
}
