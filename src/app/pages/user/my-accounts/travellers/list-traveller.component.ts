import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { TravelerService } from '../../../../services/traveler.service';
import * as moment from 'moment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TravellerFormComponent } from './traveller-form/traveller-form.component';
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
  loading = true;
  loops = [0, 1, 2, 3, 4, 5];
  dataPassToChild: any = null;
  modalReference: any;
  notFound = false;
  perPageLimitConfig=[10,25,50,100];
  pageNumber:1;
  limit:number;
  pageSize=10;
  showPaginationBar: boolean = false;

  constructor(
    public travelerService: TravelerService,
    public router: Router,
    public modalService: NgbModal,
    private toastr: ToastrService

  ) { }


  ngOnInit() {
    this.pageNumber=1;
    this.limit=this.perPageLimitConfig[0];
  
    this.loading = true;
    this.getTravelers();
  }
  pageChange(event) {
    this.loading = false;
    this.pageNumber = event;    
  }

  getTravelers() {
    this.travelerService.getTravelers().subscribe((data: any) => {
      this.travelers = data.data;
      console.log( this.travelers.length)
      this.loading = false;
      this.showPaginationBar =true;
      if(this.travelers.length === 0){
        this.notFound = true;
      }
    }, (error: HttpErrorResponse) => {

      this.loading  = this.showPaginationBar =false;
      this.notFound = true;
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  calculateAge(birthdate: any): number {
    return moment().diff(birthdate, 'years');
  }

  getGender(type) {
    if (type == 'M')
      return 'Male';
    if (type == 'F')
      return 'Female';
    if (type == 'N')
      return 'Non Binary';
  }

  ngDoCheck() {
    // this.getTravelers();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('sds', changes)
  }


  openTravellerModal(content, userId = '') {
    this.modalReference = this.modalService.open(TravellerFormComponent, { windowClass: 'cmn_add_edit_modal add_traveller_modal' });
    (<TravellerFormComponent>this.modalReference.componentInstance).travellerId = userId;
    this.modalReference.componentInstance.travelersChanges.subscribe(($e) => {
      const index = this.travelers.indexOf($e.userId, 0);
      if(index){
        this.travelers = this.travelers.filter(item => item.userId != $e.userId );            
      }
      this.travelers.push($e);
    })
  }

  deleteTravellerModal(content, userId = '') {
    this.modalReference = this.modalService.open(content, { windowClass: 'cmn_delete_modal' });
    this.userId = userId;
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.getTravelers();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult)
    });
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

  pushTraveler(event) {
    console.log("event", event)
  }

  deleteTraveller() {

    this.travelerService.delete(this.userId).subscribe((data: any) => {
      this.getTravelers();
      if (data.message) {
        this.toastr.success('Traveler deleted successfully.', 'Success');
      } else {
        this.toastr.error(data.message, 'Failure');
      }
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.toastr.error(error.error.errorMsg, 'Error');
        this.router.navigate(['/']);
      } else {
        this.getTravelers();
        this.toastr.error(error.error.errorMsg, 'Error');
      }
    });
    this.modalReference.close();
  }

}
