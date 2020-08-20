import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent  implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  signUpModal = false;

  @Input() pageData;
  @Output() valueChange = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  openPage(event) {
    if (event && event.value === 'forgotPassword') {
      this.pageData = true;
      this.valueChange.emit({ key: 'forgotPassword', value: this.pageData });
    } else if (event && event.value === 'signUp') {
      this.pageData = true;
      this.valueChange.emit({ key: 'signUp', value: this.pageData });
    }
  }

  close() {
    console.log('here')
  }

}
