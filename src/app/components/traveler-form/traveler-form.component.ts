import { Component, OnInit, Input,  ViewChild } from '@angular/core';
import { FormGroup, FormBuilder,  FormArray, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../_helpers/ngbDateCustomParserFormatter';
import { CheckOutService } from '../../services/checkout.service';
import { travelersFileds } from '../../_helpers/traveller.helper';
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
  travelers = {
    type: {
      adults : [],
      childs : [],
      infants: []
    }
  };
  
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public commonFunction: CommonFunction,
    config: NgbDatepickerConfig,
    private checkOutService:CheckOutService
  ) { }

  ngOnInit() {
   
    for(let i=0; i < this.totalTraveler.adult_count; i++){
      this.travelers.type.adults.push(Object.assign({},travelersFileds.flight.adult))
    }
    for(let i=0; i < this.totalTraveler.child_count; i++){
      this.travelers.type.adults.push(Object.assign({},travelersFileds.flight.child))
    }
    console.log(this.travelers,"....")
    this.travelerForm = this.formBuilder.group({
      type: this.formBuilder.group({
        adults: this.formBuilder.array([])
      })
    });
    this.patch();

    this.travelerForm.valueChanges.subscribe(value=>{
      this.checkOutService.emitTravelersformData(this.travelerForm)
    })
   
    
    this.checkOutService.getTraveler.subscribe((traveler:any)=>{
      if(Object.keys(traveler).length>0){
        this.travelers.type.adults[traveler.traveler_number].first_name=traveler.firstName;
        this.travelers.type.adults[traveler.traveler_number].last_name=traveler.lastName;
        this.travelers.type.adults[traveler.traveler_number].email=traveler.email;
        this.patch()
      }
    })

    
  }

  /* ngOnChanges(changes: SimpleChanges) {
    
  } */

  patch() {
    let control:any = <FormArray>this.travelerForm.get('type.adults');
    control.controls=[];
    this.travelers.type.adults.forEach((x,i) => {
      control.push(this.patchValues(x))
    })

  }

  patchValues(x) {
    return this.formBuilder.group({
      first_name: [x.first_name,[Validators.required]],
      last_name: [x.last_name],
      email: [x.email],
      phone_number: [x.phone_number],
      dob: [x.dob],
      country:[x.country],
      gender:[x.gender]
    })
  }

  submit(value){
    //console.log(this.travelerForm.get('type.adults')['controls']);
    console.log("value",value)
  }

  typeOf(value) {
    return typeof value;
  }
}
