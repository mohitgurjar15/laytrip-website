import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { GenericService } from '../services/generic.service';
import { redirectToLogin } from '../_helpers/jwt.helper';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(
    private router: Router,
    private genericService: GenericService,

    ) {
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
            // Trigger when route change
            this.checkUserValidate();
        }
      });
   }

  ngOnInit() {    
    document.getElementById('page_loader').style.display = 'block' ? 'none' : 'block';
  }

  checkUserValidate(){
    var token = localStorage.getItem('_lay_sess');
    if(token){
      this.genericService.checkUserValidate(token).subscribe((res: any) => {        
      }, err => {
        redirectToLogin();
      });

    }
  }
  
}
