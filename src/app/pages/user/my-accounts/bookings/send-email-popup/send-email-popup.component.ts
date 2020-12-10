import { Component, OnInit } from '@angular/core';
import { resetCompiledComponents } from '@angular/core/src/render3/jit/module';
import { AbstractControl, FormArray,FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-send-email-popup',
  templateUrl: './send-email-popup.component.html',
  styleUrls: ['./send-email-popup.component.scss']
})
export class SendEmailPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  emailForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
      ) {
        // this.emailForm = this.formBuilder.group({
        //   email: this.formBuilder.array([
        //     this.formBuilder.control(null)
        //   ])
        // })
  }

  ngOnInit() {
    this.validate();
  }

  public validate(): void {
    this.emailForm = new FormGroup({
      'formArray1': new FormArray([
        this.initX()
      ])
    });
    // this.formGroup.valueChanges.subscribe(data => console.log(data));
  }

  get f() { return this.emailForm.controls; }

  public initX(): FormGroup {
    return new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,4}$')]),
      
    });
  }

  public addX(): void {
    const control = <FormArray>this.f.formArray1;
    control.push(this.initX());
  }


  removeEmail(ix) {
    const control = <FormArray>this.f.formArray1;
    control.removeAt(ix); 
  }

  onSubmit(){
    this.submitted = true;

    const control = <FormArray>this.f.formArray1;
    console.log(control)
    if(control.invalid){
      control.markAsTouched();
    }
  }
}
