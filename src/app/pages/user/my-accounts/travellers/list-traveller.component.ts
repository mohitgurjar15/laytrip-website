import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { TravelerService } from '../../../../services/traveler.service';
import * as moment from 'moment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-list-traveller',
  templateUrl: './list-traveller.component.html',
  styleUrls: ['./list-traveller.component.scss']
})
export class ListTravellerComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  travelers = [];
  closeResult = '';
  userId: string;


  constructor(
    public travelerService:TravelerService,
    public router: Router,
    private modalService: NgbModal,
   
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

  ngDoCheck(){
    // this.getTravelers();
  }  

  ngOnChanges(changes: SimpleChanges)  {
    console.log('sds',changes)
  }

  modalReference: any;
  open(content, userId) {
   
    const modalRef = this.modalService.open(content);
    // modalRef.componentInstance.name = 'World';
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
