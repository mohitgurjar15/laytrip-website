import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  loading;
  constructor() { }

  ngOnInit() {
    
  }
  getLoadingValue(event){
    if(event == 'false'){
      this.loading = false;
    } else {
      this.loading = true;
    }
    console.log(this.loading)
  }
}
