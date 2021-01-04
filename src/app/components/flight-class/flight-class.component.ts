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
      $('#add_traveler_open').hide();
    });

    $('#add_class_sec_open').click(
      function (e) {
        e.stopPropagation();
      }
    );

  }

 
  btnClickForChange(item){
    this.changeValue.emit(item.value);
    this.flightClass = item.value;
    $("#add_class_sec_open").hide();
  }
}

