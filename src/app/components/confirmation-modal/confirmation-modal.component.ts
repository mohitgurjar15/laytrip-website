import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

export enum MODAL_TYPE {
  OK,
  CLOSE,
  CANCEL,
  STATUS_CHANGE,
  DELETE,
  YES,
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {

  @Input() options: any;
  @Input() data;
  s3BucketUrl = environment.s3BucketUrl;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }

  delete() {
    this.activeModal.close({ STATUS: MODAL_TYPE.DELETE });
  }

  cancel() {
    this.activeModal.close({ STATUS: 'CANCEL' });
  }

  okClick() {
    this.activeModal.close({ STATUS: MODAL_TYPE.YES });
  }
}
