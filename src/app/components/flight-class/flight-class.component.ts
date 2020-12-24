import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-flight-class',
  templateUrl: './flight-class.component.html',
  styleUrls: ['./flight-class.component.scss']
})
export class FlightClassComponent implements OnInit {

  constructor() { }

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
}

