import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunction } from '../../../../_helpers/common-function';

@Component({
  selector: 'app-hotel-policy-popup',
  templateUrl: './hotel-policy-popup.component.html',
  styleUrls: ['./hotel-policy-popup.component.scss']
})
export class HotelPolicyPopupComponent implements OnInit {

  @Input() data;
  s3BucketUrl = environment.s3BucketUrl;
  policyArray = [];
  currency;

  constructor(
    public activeModal: NgbActiveModal,
    public commonFunction: CommonFunction
  ) { }

  ngOnInit() {
    let _currency = localStorage.getItem('_curr');
    this.currency = JSON.parse(_currency);
    if (this.data && this.data.type === 'cancellation_policies') {
      this.policyArray = this.data.policyInfo;
    } else if (this.data && this.data.type === 'policies') {
      this.policyArray = this.data.policyInfo;
    }
  }

}
