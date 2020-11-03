import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-points',
  templateUrl: './add-points.component.html',
  styleUrls: ['./add-points.component.scss']
})
export class AddPointsComponent implements OnInit {

  @Output() addNewPoints = new EventEmitter();
  addPointsForm: FormGroup;
  add_points;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.addPointsForm = this.formBuilder.group({
      default_add_points: ['100'],
      custom_add_points: [''],
    });
    this.addNewPoints.emit(this.addPointsForm.value.default_add_points);
  }

  changeValue(event) {
    this.addNewPoints.emit(this.addPointsForm.value.default_add_points);
  }

  addCusomPoint(event) {
    this.addNewPoints.emit(this.addPointsForm.value.custom_add_points);
    if (!event.custom_add_points) {
      this.addPointsForm.controls.default_add_points.setValue('100');
      this.addNewPoints.emit(this.addPointsForm.value.default_add_points);
    }
  }
}
