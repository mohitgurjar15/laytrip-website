import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { redirectToLogin } from '../../../../_helpers/jwt.helper';
import { environment } from '../../../../../environments/environment';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  loading : boolean = true; 
  closeResult = '';
  s3BucketUrl = environment.s3BucketUrl;
  isRequireBackupFile : boolean = false;
  
  constructor(
    private modalService: NgbModal,
    private userService : UserService,
    private toastrService : ToastrService,


  ) { }

  ngOnInit() {
    
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
    let data = {"requireBackupFile": this.isRequireBackupFile};
    this.userService.deleteAccount(data).subscribe((data: any) => {      
      this.loading = false;
      this.modalService.dismissAll();
      this.toastrService.success(data.message,'Deleted Account Successfully')
      redirectToLogin();
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.modalService.dismissAll();

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
}
