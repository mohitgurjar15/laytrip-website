import { SliderLabelDirective } from '@angular-slider/ngx-slider/slider-label.directive';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
declare var $: any;
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
export class CarouselComponent  implements OnInit{

  @Input() slides;
  @Input() currentChangeCounter=0;
  @Input() swipeDirection:string='';
  @Output() activeSlide=new EventEmitter();
  previousChangeCounter=0;
  landingPageName;
  currentSlide = 0;
showSlide = false;
  ngOnInit() {
    if(typeof this.slides != 'undefined'){
      this.showSlide = true
    }else{
      this.showSlide = false
    }
    this.landingPageName = this.route.snapshot.queryParams['utm_source']
    this.homeService.getSwipeSlide.subscribe((direction)=>{
      if(direction=='left'){
        this.onPreviousClick();
      }
      if(direction=='right'){
        this.onNextClick();
      }   
    })
  } 

  constructor(public homeService:HomeService,
    private route: ActivatedRoute,
    ) {
    this.landingPageName = this.route.snapshot.queryParams['utm_source']
      this.activityWatcher();
  }

  onPreviousClick() {
    
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    let slide ="#slide_"+this.currentSlide;
    $(document).ready(function(){
      $(slide).attr('src', $(slide).attr('data'))
      $(slide).removeAttr('data')
    })
    this.activeSlide.emit(this.currentSlide)
  }
  
  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    let slide ="#slide_"+this.currentSlide;
    $(document).ready(function(){
      $(slide).attr('src', $(slide).attr('data'))
      $(slide).removeAttr('data')
    })
    this.activeSlide.emit(this.currentSlide)
  }

  activityWatcher(){

    var secondsSinceLastActivity = 0;
    var maxInactivity = 4;
    let self=this;
    setInterval(function(){
      if(self.currentChangeCounter!=self.previousChangeCounter){ 
        secondsSinceLastActivity=0;
        self.previousChangeCounter=self.currentChangeCounter;
        return;
      }
      secondsSinceLastActivity++;
      
      if(secondsSinceLastActivity > maxInactivity){
        self.onNextClick();
        secondsSinceLastActivity = 0;
      }
    }, 1000);
    var activityEvents = [];
    
    //register the activity function as the listener parameter.
    activityEvents.forEach(function(eventName) {
        document.addEventListener(eventName, ()=>{
          secondsSinceLastActivity = 0;
        }, true);
    });
  }

  ngOnChanges(change:SimpleChange){
    if(typeof change['currentChangeCounter']!='undefined'){
      this.currentChangeCounter=change['currentChangeCounter'].currentValue;
      this.previousChangeCounter=change['currentChangeCounter'].previousValue;
    }
  }

  booletsClick(i,slides){
    this.currentSlide = i;
    let slide ="#slide_"+this.currentSlide;
    $(document).ready(function(){
      $(slide).attr('src', $(slide).attr('data'))
      $(slide).removeAttr('data')
    })
    this.activeSlide.emit(this.currentSlide)
  }
}
