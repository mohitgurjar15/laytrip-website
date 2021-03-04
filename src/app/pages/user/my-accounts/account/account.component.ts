import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getLoginUserInfo, redirectToLogin } from '../../../../_helpers/jwt.helper';
import { environment } from '../../../../../environments/environment';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AddCardComponent } from '../../../../components/add-card/add-card.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  @ViewChild(AddCardComponent, {static: false}) addCardRef: AddCardComponent;
  loading : boolean = true; 
  isSocialLogin : boolean = false; 
  closeResult = '';
  s3BucketUrl = environment.s3BucketUrl;
  isRequireBackupFile : boolean = false;
  userDetails;
  cardListChangeCount: number = 0;
  is_add_new_card = false;

  constructor(
    private modalService: NgbModal,
    private userService : UserService,
    private toastrService : ToastrService,


  ) { }

  ngOnInit() {
    this.userDetails = getLoginUserInfo();
    this.isSocialLogin = this.userDetails.socialAccountId.length > 0 ? true : false;;
  }
  getLoadingValue(event){
    if(event === false){
      this.loading = false;
    } else {
      this.loading = true;      
    }
  }

  open(content) {
    this.modalService.open(content, {windowClass:'delete_account_window', centered: true, backdrop: 'static',
    keyboard: false}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  deleteAccount(){
    this.loading = true;
    
    this.userService.deleteAccount(this.isRequireBackupFile).subscribe((data: any) => {      
      this.modalService.dismissAll();
      this.loading = false;
      this.toastrService.success(data.message,'Deleted Account Successfully')
      redirectToLogin();
    }, (error: HttpErrorResponse) => {
      this.modalService.dismissAll();
      this.loading = false;
      this.toastrService.error(error.error.message,'Deleted Account Error')
      if(error.status == 401){
        // redirectToLogin();
      }       
    }); 
  }

  changeDeleteAccountForBackup(event){
    this.isRequireBackupFile = false;
    if(event.target.checked){
      this.isRequireBackupFile = true;
    }
  }

  ngOnDestroy() { 
    this.addCardRef.ngOnDestroy();
  }

  addNewCard() {
    this.is_add_new_card = true;
  }

  getCardListChange(data){
    this.is_add_new_card = false;
    this.cardListChangeCount=data;
  }
}
