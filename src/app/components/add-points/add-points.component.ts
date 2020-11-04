import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunction } from '../../_helpers/common-function';

@Component({
  selector: 'app-add-points',
  templateUrl: './add-points.component.html',
  styleUrls: ['./add-points.component.scss'],
})
export class AddPointsComponent implements OnInit {

  @Output() addNewPoints = new EventEmitter();
  addPointsForm: FormGroup;
  currency;

  constructor(
    private formBuilder: FormBuilder,
    public commonFunction: CommonFunction,
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    this.addPointsForm = this.formBuilder.group({
      default_add_points: ['100'],
      custom_add_points: ['', Validators.min(10)],
    });
    this.addNewPoints.emit(this.addPointsForm.value.default_add_points);
    this.addPointsForm.controls.custom_add_points.setValue(this.addPointsForm.value.default_add_points);
  }

  changeValue(event) {
    this.addPointsForm.controls.custom_add_points.setValue(this.addPointsForm.value.default_add_points);
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
