import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

export enum MODAL_TYPE {
  DELETE,
}

@Component({
  selector: 'app-delete-cartitem-confirmation-popup',
  templateUrl: './delete-cartitem-confirmation-popup.component.html',
  styleUrls: ['./delete-cartitem-confirmation-popup.component.scss']
})
export class DeleteCartitemConfirmationPopupComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  onClickDelete() {
    this.activeModal.close({ STATUS: MODAL_TYPE.DELETE });
  }

  close() {
    this.activeModal.close();
  }

}
