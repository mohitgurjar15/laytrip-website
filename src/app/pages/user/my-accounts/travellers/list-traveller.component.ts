import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { TravelerService } from '../../../../services/traveler.service';
import * as moment from 'moment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TravellerFormComponent } from './traveller-form/traveller-form.component';
import { ThrowStmt } from '@angular/compiler';
import { GenericService } from '../../../../services/generic.service';
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
  countries: any = [];
  countries_code: any = [];
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
  isMasterSel:boolean;
  categoryList:any;
  checkedCategoryList:any;
  selectedAll: any;
  selectedAllSecondname: any;
  name: any;

  constructor(
    public travelerService: TravelerService,
    public router: Router,
    public modalService: NgbModal,
    private toastr: ToastrService,
    private genericService: GenericService


  ) {
    this.isMasterSel = false;

   }


  ngOnInit() {
    window.scroll(0,0);
    this.getCountry();
    this.pageNumber=1;
    this.limit=this.perPageLimitConfig[0];
  
    this.loading = true;
    this.getTravelers();
    this.getCheckedItemList();
  }
  pageChange(event) {
    this.loading = false;
    this.pageNumber = event;    
  }

  getTravelers() {
    this.travelerService.getTravelers().subscribe((data: any) => {
      this.travelers = data.data;
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

  calculateAge(birthdate: any) {
    return moment().diff(birthdate, 'years') ? moment().diff(birthdate, 'years')+" yrs, ":"";
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


  openTravellerModal(content, userId = '',traveler='') {
    this.modalReference = this.modalService.open(TravellerFormComponent, { windowClass: 'cmn_add_edit_modal add_traveller_modal',centered: true });
    (<TravellerFormComponent>this.modalReference.componentInstance).travellerId = userId;
    (<TravellerFormComponent>this.modalReference.componentInstance).travelerInfo = traveler;
    (<TravellerFormComponent>this.modalReference.componentInstance).countries = this.countries;
    (<TravellerFormComponent>this.modalReference.componentInstance).countries_code = this.countries_code;
    this.modalReference.componentInstance.travelersChanges.subscribe(($e) => {
      const index = this.travelers.indexOf($e.userId, 0);
      if(index){
        this.travelers = this.travelers.filter(item => item.userId != $e.userId );            
      }
      this.travelers.push($e);
    })
  }

  deleteTravellerModal(content, userId = '') {
    this.modalReference = this.modalService.open(content, { windowClass: 'cmn_delete_modal',centered: true });
    this.userId = userId;
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.getTravelers();
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
        this.toastr.success('Traveller deleted successfully.', 'Success');
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
 
  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries = data.map(country => {
        return {
          id: country.id,
          name: country.name,
          code: country.phonecode,
          flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.jpg'
        }
      }),
        this.countries_code = data.map(country => {
          return {
            id: country.id,
            name: country.phonecode+' ('+country.iso2+')',
            code:country.phonecode,
            country_name:country.name+ ' ' +country.phonecode,
            flag: this.s3BucketUrl+'assets/images/icon/flag/'+ country.iso3.toLowerCase()+'.jpg'
          }
        });
    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  checkUncheckAll() {
    var checkboxes = document.getElementsByClassName('travelerCheckbox');
    for (var i = 0; i < checkboxes.length; i++) {
      this.travelers[i].isSelected = this.isMasterSel;      
    }
    console.log( this.travelers)
    this.getCheckedItemList();
  }
  
  isAllSelected() {
    this.isMasterSel = this.travelers.every(function(item:any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList(){
    this.checkedCategoryList = [];
    for (var i = 0; i < this.travelers.length; i++) {
      if(this.travelers[i].isSelected)
      this.checkedCategoryList.push(this.travelers[i]);
    }
    this.checkedCategoryList = JSON.stringify(this.checkedCategoryList);
  }
  
}
