import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-search-trip',
  templateUrl: './search-trip.component.html',
  styleUrls: ['./search-trip.component.scss']
})
export class SearchTripComponent implements OnInit {
  SearchTripForm : FormGroup;
  submitted : boolean =  false;
  isTripNotFound = false;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
  ) { }

  ngOnInit() {
    $(document).find('.site_menu').removeClass("show");
    window.scroll(0,0);
    this.SearchTripForm = this.formBuilder.group({
      tripId: ['',Validators.required],
    });
  }

  onSubmit(){
    if (this.SearchTripForm.invalid) {
      this.submitted = true;
      return;
    } else {
      
      this.router.navigate(['/account/trip/'+ this.SearchTripForm.value.tripId]);
    }
  }

}
