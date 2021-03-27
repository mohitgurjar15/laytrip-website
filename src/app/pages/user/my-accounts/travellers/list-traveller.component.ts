import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { TravelerService } from '../../../../services/traveler.service';
import * as moment from 'moment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TravellerFormComponent } from './traveller-form/traveller-form.component';
import { GenericService } from '../../../../services/generic.service';
import { CookieService } from 'ngx-cookie';
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
  perPageLimitConfig = [10, 25, 50, 100];
  pageNumber: 1;
  limit: number;
  pageSize = 10;
  showPaginationBar: boolean = false;
  showNewForm: boolean = false;
  isMasterSel: boolean;
  categoryList: any;
  checkedCategoryList: any;
  selectedAll: any;
  selectedAllSecondname: any;
  name: any;
  // @ViewChild('child',{static:false}) childCompopnent: any;
  @ViewChild(TravellerFormComponent, { static: false }) childComponent: TravellerFormComponent;
  location;
  traveller: any = [];
  @Output() loadingValue = new EventEmitter<boolean>();
  travellerTabClass = '';

  constructor(
    public travelerService: TravelerService,
    public router: Router,
    public modalService: NgbModal,
    private toastr: ToastrService,
    private genericService: GenericService,
    private cookieService: CookieService,
    private renderer: Renderer2

  ) {
    this.isMasterSel = false;
  }


  ngOnInit() {
    let location: any = this.cookieService.get('__loc');
    try {
      this.location = JSON.parse(location);
    }
    catch (e) {
    }
    window.scroll(0, 0);
    this.getCountry();
    this.pageNumber = 1;
    this.limit = this.perPageLimitConfig[0];

    this.loading = true;
    this.getTravelers();
    this.getCheckedItemList();
  }

  pageChange(event) {
    this.loading = false;
    this.pageNumber = event;
  }

  getTravelers() {
    this.travelerService.getTravelers().subscribe((res: any) => {
      // this.travelers = res.data;
      

      this.travelers  = res.data.filter(function(e){
        if(e.roleId !=6 ){
          return e;
        }
      });
      if(this.travelers.length == 0){
        this.showNewForm = true;
      }
      this.loading = false;
      this.showPaginationBar = true;
      if (this.travelers.length === 0) {
        this.notFound = true;
      }
    }, (error: HttpErrorResponse) => {

      this.loading = this.showPaginationBar = false;
      this.notFound = true;
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  calculateAge(birthdate: any) {
    return moment().diff(birthdate, 'years') ? moment().diff(birthdate, 'years') + " yrs, " : "";
  }

  openDeleteModal(content, userId = '') {
    this.modalReference = this.modalService.open(content, { windowClass: 'cmn_delete_modal', centered: true });
    this.userId = userId;
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.getTravelers();
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }




  getCountry() {
    this.genericService.getCountry().subscribe((data: any) => {
      this.countries =  data.map(country => {
        return {
          id: country.id,
          name: country.name,
          countryCode: country.phonecode,
          flag: this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg'
        }
      });
        this.countries_code = data.map(country => {
          return {
            id: country.id,
            name: country.phonecode + ' (' + country.iso2 + ')',
            countryCode: country.phonecode,
            country_name: country.name + ' ' + country.phonecode,
            flag: this.s3BucketUrl + 'assets/images/icon/flag/' + country.iso3.toLowerCase() + '.jpg',
            iso2: country.iso2
          }
      });
      const filteredArr = this.countries_code.reduce((acc, current) => {
        const x = acc.find(item => item.countryCode == current.countryCode);
        if (!x) {        
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      this.countries_code = [];
      this.countries_code = filteredArr;  

      this.setUSCountryInFirstElement(this.countries);

    }, (error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.router.navigate(['/']);
      }
    });
  }

  setUSCountryInFirstElement(countries){
    var usCountryObj = countries.find(x=> x.id === 233);
    var removedUsObj = countries.filter( obj => obj.id !== 233);
    this.countries=[];
    removedUsObj.sort(function(a, b) {
      return (a['name'].toLowerCase() > b['name'].toLowerCase()) ? 1 : ((a['name'].toLowerCase() < b['name'].toLowerCase()) ? -1 : 0);          
    });
    removedUsObj.unshift(usCountryObj); 
    this.countries = removedUsObj; 

  }
  
  checkUncheckAll() {
    var checkboxes = document.getElementsByClassName('travelerCheckbox');
    for (var i = 0; i < checkboxes.length; i++) {
      this.travelers[i].isSelected = this.isMasterSel;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.isMasterSel = this.travelers.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedCategoryList = [];
    for (var i = 0; i < this.travelers.length; i++) {
      if (this.travelers[i].isSelected)
        this.checkedCategoryList.push(this.travelers[i]);
    }
    this.checkedCategoryList = JSON.stringify(this.checkedCategoryList);
  }

  submitTravellerForm() {
    this.loadingValue.emit(true);


    var formData = this.childComponent.travellerForm;


    if (formData.invalid) {
      Object.keys(formData.controls).forEach(controlName =>
        formData.controls[controlName].markAsTouched()
      );
      this.loadingValue.emit(false);
      return;
    } else {
      let country_id = formData.value.country_id.id;
      if (!Number(country_id)) {
        if (this.traveller.country) {
          country_id = (this.traveller.country.id) ? this.traveller.country.id : '';
        } else {
          country_id = 233;
        }
      }

      let jsonData = {
        first_name: formData.value.firstName,
        last_name: formData.value.lastName,
        dob: typeof formData.value.dob === 'object' ? moment(formData.value.dob).format('YYYY-MM-DD') : moment(this.stringToDate(formData.value.dob, '/')).format('YYYY-MM-DD'),
        gender: formData.value.gender ? formData.value.gender : 'M',
        country_id: country_id ? country_id : '',
        passport_expiry: typeof formData.value.passport_expiry === 'object' ? moment(formData.value.passport_expiry).format('YYYY-MM-DD') : null,
        passport_number: formData.value.passport_number,
        country_code: formData.value.country_code ? formData.value.country_code : '',
        phone_no: formData.value.phone_no,
      };
      let emailObj = { email: formData.value.email ? formData.value.email : '' };

      this.travelerService.addAdult(jsonData).subscribe((data: any) => {
        this.getTravelers();
        this.childComponent.travellerForm.reset();
        this.loadingValue.emit(false);
      }, (error: HttpErrorResponse) => {
        this.loadingValue.emit(false);
        if (error.status === 401) {
          this.router.navigate(['/']);
        } else {
        }
      });
    }
  }

  stringToDate(string, saprator) {
    let dateArray = string.split(saprator);
    return new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
  }

  getLoadingValue(event) {
    this.loadingValue.emit(event ? event : false);
  }


  getTravellerIdFromChild(travelerId) {
    this.openDeleteModal('deleteContent', travelerId);
  }
  
  
  pushTraveler(traveler) {
    if (typeof traveler == 'string') {
      this.travelers = this.travelers.filter(obj => obj.userId !== traveler);
    } else {
      this.travelers = this.travelers.filter(obj => obj.userId !== traveler.userId);
      this.travelers.push(traveler)
    }
    if(this.travelers.length == 0){
      this.showNewForm = true;
    } else {
      this.showNewForm = false;
    }
    //For add class show in traveler tab 
    this.travellerTabClass = traveler.userId; 
  }

  showForm(){
    this.showNewForm = true;
  }

}
