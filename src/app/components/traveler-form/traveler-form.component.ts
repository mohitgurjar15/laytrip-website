import { Component, OnInit, Input,  ViewChild, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder,  FormArray, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunction } from '../../_helpers/common-function';
import { environment } from '../../../environments/environment';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../_helpers/ngbDateCustomParserFormatter';
import { CheckOutService } from '../../services/checkout.service';
import { travelersFileds } from '../../_helpers/traveller.helper';
import { CartService } from '../../services/cart.service';
declare var $: any;
import * as moment from 'moment';
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
  @Input() cartNumber:number;
  traveler_number;
  /* travelers = {
    type: {
      adults : []
    }
  }; */
  travelers={
    type0 : {
      adults : []
    },
    type1 : {
      adults : []
    }
  };
  dobMinDate= new Date();
  
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public commonFunction: CommonFunction,
    config: NgbDatepickerConfig,
    private checkOutService:CheckOutService,
    private cartService:CartService
  ) { }

  ngOnInit() {
    
    //this.travelers[`type${this.cartNumber}`].adults=[];

    this.cartService.getCartTravelers.subscribe((travelers:any)=>{
      this.travelers =travelers;
    })

      //this.travelers = travelers;
    for(let i=0; i < this.totalTraveler.adult_count; i++){
      //Object.assign({},this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({},travelersFileds.flight.adult)))
      this.travelers[`type${this.cartNumber}`].adults.push(Object.assign({},travelersFileds.flight.adult));
      this.cartService.setCartTravelers(this.travelers)
    }
    
    this.travelerForm = this.formBuilder.group({
      type0: this.formBuilder.group({
        adults: this.formBuilder.array([])
      }),
      type1: this.formBuilder.group({
        adults: this.formBuilder.array([])
      })
    });
    this.patch();

    this.travelerForm.valueChanges.subscribe(value=>{
      this.checkOutService.emitTravelersformData(this.travelerForm)
    })
    
    this.cartService.getSelectedCart.subscribe(cartNumber=>{
      this.cartNumber = cartNumber;
    })

    
    this.checkOutService.getTraveler.subscribe((traveler:any)=>{
      if(Object.keys(traveler).length>0){
        console.log("Current Cart",this.cartNumber,traveler)
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].first_name=traveler.firstName;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].last_name=traveler.lastName;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].email=traveler.email;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].userId=traveler.userId;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].gender=traveler.gender;
        this.travelers[`type${this.cartNumber}`].adults[traveler.traveler_number].dob=moment(traveler.dob).format('MMM d, yy');

        //this.travelers= Object.assign({},this.travelers)
        
        this.patch()
      }
    })

    
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  patch() {
    let control:any = <FormArray>this.travelerForm.get(`type${this.cartNumber}.adults`);
    control.controls=[];
    this.travelers[`type${this.cartNumber}`].adults.forEach((x,i) => {
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
      gender:[x.gender],
      userId:[x.userId]
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
