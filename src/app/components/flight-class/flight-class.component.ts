import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-flight-class',
  templateUrl: './flight-class.component.html',
  styleUrls: ['./flight-class.component.scss']
})
export class FlightClassComponent implements OnInit {
  
  @Output() changeValue = new EventEmitter<any>();
  class = 'Economy';
  constructor(private eRef: ElementRef) { }

  ngOnInit() {
    this.loadJquery();
  }
  
  loadJquery() {
    $("body").click(function () {
      $("#add_class_sec_open").hide("slow");
    });

    $("#add_class_sec").click(function (e) {
      e.stopPropagation();
      $("#add_class_sec_open").slideToggle("slow");
    });

    $('#add_class_sec_open').click(
      function (e) {
        e.stopPropagation();
      }
    );

  }

  @HostListener('body:click', ['$event'])
  clickout(event) {
    console.log(event.target)
    if(this.eRef.nativeElement.contains(event.target)) {
      console.log('inside')      
    } else {
      console.log('outside')
    }
  }
  btnClickForChange(item){
    this.changeValue.emit(item.value);
    this.class = item.value;
    $("#add_class_sec_open").hide("slow");
  }
}

