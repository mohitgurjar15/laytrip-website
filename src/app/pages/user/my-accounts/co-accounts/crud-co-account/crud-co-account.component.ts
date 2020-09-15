import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-crud-co-account',
  templateUrl: './crud-co-account.component.html',
  styleUrls: ['./crud-co-account.component.scss']
})
export class CrudCoAccountComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  coAccountForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
