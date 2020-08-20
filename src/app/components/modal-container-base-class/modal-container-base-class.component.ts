import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export class ModalContainerBaseClassComponent {

  constructor(
    public modalService: NgbModal
  ) { }

  // MODAL BASE CLASS FUNCTION
  public openPopUp(component: any, data?: { [key: string]: any }, options?: NgbModalOptions): NgbModalRef {
    const modalRef: NgbModalRef = this.modalService
      .open(component, options || { centered: true, backdrop: 'static' });
    if (data) {
      Object.keys(data).forEach(d => modalRef.componentInstance[d] = data[d]);
    }
    return modalRef;
  }

}
