import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, Input} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-flight-class',
  templateUrl: './flight-class.component.html',
  styleUrls: ['./flight-class.component.scss']
})
export class FlightClassComponent implements OnInit {
  
  @Output() changeValue = new EventEmitter<any>();
  
  @Input() flightClass;
  showClass:boolean=false;

  constructor(private eRef: ElementRef) { }

  ngOnInit() {
    this.loadJquery();
  }
  
  loadJquery() {
    $("body").click(function () {
      $(".add_class_sec_open_").hide();
    });

    $(".class_sec_info").click(function (e) {
      e.stopPropagation();
      if((e.target.nextSibling != null && e.target.nextSibling.classList[2] == 'panel_hide') || 
      (e.target.offsetParent.nextSibling != null && e.target.offsetParent.nextSibling.classList[2] == 'panel_hide')
      ){         
        $(".add_class_sec_open_").hide();      
      } else {      
        $(".add_class_sec_open_").show();
      }

      $(".add_traveler__open").hide();
    });

    $('.add_class_sec_open_').click(
      function (e) {
        e.stopPropagation();
      }
    );

  }

  toggleTraveller(){
    this.showClass=!this.showClass;
  }
  btnClickForChange(item){
    this.changeValue.emit(item.value);
    this.flightClass = item.value;
    $(".add_class_sec_open_").hide();
  }
}

