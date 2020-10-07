import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { environment } from '../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardActionFormComponent } from './card-action-form/card-action-form.component';
import { ConfirmationModalComponent, MODAL_TYPE } from '../../../../components/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-list',
  templateUrl: './account-card-list.component.html',
  styleUrls: ['./account-card-list.component.scss']
})
export class AccountCardListComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  cardList;
  isNotFound = false;
  loading = false;
  modalReference: any;

  constructor(
    private userService: UserService,
    public modalService: NgbModal,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.userService.getCardList().subscribe((res: any) => {
      if (res && res.length) {
        this.cardList = res;
        this.loading = false;
        this.isNotFound = false;
      }
    }, err => {
      if (err && err.status === 404) {
        this.isNotFound = true;
        this.loading = false;
      }
    });
  }

  openCardModal() {
    this.modalReference = this.modalService.open(CardActionFormComponent,
      { windowClass: 'cmn_add_edit_modal add_traveller_modal', centered: true }).result.then((result) => {
        if (result === 'SAVE') {
          this.ngOnInit();
        }
      });
  }

  deleteCard(card) {
    const options = {
      header: 'Delete Card',
      message: 'Are you sure you want to delete Card?',
      type: 'DELETE',
      button_text: 'Yes',
    };
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'cmn_delete_modal',
      centered: true,
    });
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    (<ConfirmationModalComponent>modalRef.componentInstance).data = options;
    modalRef.result.then(result => {
      if (result.STATUS === MODAL_TYPE.YES) {
        console.log(result);
        // this.userService.deleteCard().subscribe((res: any) => {
        //   if (res && res.message) {
        //     this.toastr.success('Card deleted successfully.', 'Success');
        //     this.ngOnInit();
        //   }
        // }, (error => {
        //   this.toastr.error(error.message, 'Error');
        // }));
      }
    });
  }

}
