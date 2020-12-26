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
      $("#add_class_sec_open").hide();
    });

    $("#add_class_sec").click(function (e) {
      e.stopPropagation();
      $("#add_class_sec_open").slideToggle();
    });

    $('#add_class_sec_open').click(
      function (e) {
        e.stopPropagation();
      }
    );

  }

 
  btnClickForChange(item){
    this.changeValue.emit(item.value);
    this.class = item.value;
    $("#add_class_sec_open").hide("slow");
  }
}

