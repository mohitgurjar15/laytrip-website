import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FlightClassComponent } from './flight-class.component';
declare var $: any;
@Component({
  selector: 'app-flight-class',
  templateUrl: './flight-class.component.html',
  styleUrls: ['./flight-class.component.scss']
})

describe('FlightClassComponent', () => {
  let component: FlightClassComponent;
  let fixture: ComponentFixture<FlightClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

export class TravellerInfoComponent implements OnInit {

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
