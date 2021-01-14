import { Component, OnInit, Input,  SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder,  FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { phoneAndPhoneCodeValidation, WhiteSpaceValidator } from '../../_helpers/custom.validators';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../_helpers/ngbDateCustomParserFormatter';
import { CheckOutService } from '../../services/checkout.service';
declare var $: any;
@Component({
  selector: 'app-traveler-form',
  templateUrl: './traveler-form.component.html',
  styleUrls: ['./traveler-form.component.scss'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ]
})

export class TravelerFormComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() totalTraveler;
  travelerForm: FormGroup;
  traveler_number;
  travelers;
  
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public commonFunction: CommonFunction,
    config: NgbDatepickerConfig,
    private checkOutService:CheckOutService
  ) { }

  ngOnInit() {

    this.travelers = {
      type: {
        adults : [],
        childs : [],
        infants: []
      }
    };

    for(let i=0; i < this.totalTraveler.adult_count; i++){
      this.travelers.type.adults.push(
        {
          first_name: '',
          last_name: '',
          email: '',
          phone_number:'',
          dob:'',
          country:'',
          gender:''
        }
      )
    }

    console.log( this.travelers.type)


    this.travelerForm = this.formBuilder.group({
      type: this.formBuilder.group({
        adults: this.formBuilder.array([])
      })
    });
    this.patch();
    /* this.travelerForm = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone_number: ['', [Validators.required, Validators.maxLength(4)]],
        gender: ['', [Validators.required, Validators.maxLength(20)]],
        email: ['', Validators.required]
    }); */

    this.checkOutService.getTravelerNumber.subscribe((traveler_number:any)=>{ 
      this.checkOutService.getTraveler.subscribe((traveler:any)=>{
        this.travelers.type.adults[traveler.traveler_number].first_name=traveler.firstName;
        this.travelers.type.adults[traveler.traveler_number].last_name=traveler.lastName;
        this.travelers.type.adults[traveler.traveler_number].email=traveler.email;
        this.patch()
      })
    })
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['traveler']) {
      /* this.traveler= changes['traveler'].currentValue;
      this.travelerForm.controls.first_name.setValue(this.traveler.firstName)
      this.travelerForm.controls.last_name.setValue(this.traveler.lastName)
      this.travelerForm.controls.email.setValue(this.traveler.email) */
    }
  }

  patch() {
    let control:any = <FormArray>this.travelerForm.get('type.adults');
    control.controls=[];
    this.travelers.type.adults.forEach(x => {
      control.push(this.patchValues(x))
    })

  }

  patchValues(x) {
    return this.formBuilder.group({
      first_name: [x.first_name],
      last_name: [x.last_name],
      email: [x.email],
      phone_number: [x.phone_number],
      dob: [x.dob],
      country:[x.country],
      gender:[x.gender]
    })
  }

  submit(value){
    console.log("value",value)
  }
}
