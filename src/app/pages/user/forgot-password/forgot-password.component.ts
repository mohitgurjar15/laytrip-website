import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  s3BucketUrl = environment.s3BucketUrl;
  @Input() pageData;
  @Output() valueChange = new EventEmitter();

  constructor(public modalService: NgbModal) { }

  ngOnInit() {
  }

  openPage(event) {
    this.pageData = true;
    this.valueChange.emit({ key: 'forgotPassword', value: this.pageData });
  }

  ngOnDestroy() {
  }
}
