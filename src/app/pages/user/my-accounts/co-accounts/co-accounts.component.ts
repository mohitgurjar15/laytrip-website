import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { TravelerService } from '../../../../services/traveler.service';
import * as moment from 'moment';
import { CommonFunction } from 'src/app/_helpers/common-function';

@Component({
  selector: 'app-co-accounts',
  templateUrl: './co-accounts.component.html',
  styleUrls: ['./co-accounts.component.scss']
})
export class CoAccountsComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  travelers = [];
  constructor(
    public travelerService:TravelerService,
    public router: Router   
  ) { }


  ngOnInit() {
    this.getTravelers();
  }

  getTravelers(){
    this.travelerService.getTravelers().subscribe((data: any) => {
          this.travelers = data.data; 
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  calculateAge(birthdate: any): number {
    return moment().diff(birthdate, 'years');
  }

  getGender(type) {
    if(type == 'M')
      return 'Male';
      if(type == 'F')
      return 'Female';
      if(type == 'N')      
      return 'Non Binary';
  }

}
