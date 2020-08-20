import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ModalContainerBaseClassComponent } from 'src/app/components/modal-container-base-class/modal-container-base-class.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends ModalContainerBaseClassComponent implements OnInit, OnDestroy {
  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();

  constructor(public modalService: NgbModal) {
    super(modalService);
  }

  ngOnInit() {
  }

  openSignInPage() {
    this.pageData = true;
    this.valueChange.emit({ key: 'signIn', value: this.pageData });
  }

  ngOnDestroy() {
    
  }

}
