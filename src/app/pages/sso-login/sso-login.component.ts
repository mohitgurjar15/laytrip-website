import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  getUserDetails } from '../../_helpers/jwt.helper';

@Component({
  selector: 'app-sso-login',
  templateUrl: './sso-login.component.html',
  styleUrls: ['./sso-login.component.scss']
})
export class SsoLoginComponent implements OnInit {
  token;
  constructor(    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.token = params['id']);

    this.ssonLogin();
  }

  ssonLogin(){
    console.log( this.token)
    // getUserDetails('sd')
  }

}
