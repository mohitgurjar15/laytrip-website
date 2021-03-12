import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { GenericService } from '../services/generic.service';
import { redirectToLogin } from '../_helpers/jwt.helper';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  public lottieConfig: any;

  constructor(
    private router: Router,
    private genericService: GenericService,
    private cd: ChangeDetectorRef
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Trigger when route change
        this.checkUserValidate();
      }
    });

  }

  ngOnInit() {
    this.checkUserValidate();
    document.getElementById('loader_full_page').style.display = 'block' ? 'none' : 'block';
    this.lottieConfig = {
      path: 'assets/data.json',
      autoplay: true,
      loop: true
    };
  }

  checkUserValidate() {
    var token = localStorage.getItem('_lay_sess');
    if (token) {
      this.genericService.checkUserValidate(token).subscribe((res: any) => {
      }, err => {
        redirectToLogin();
      });
    }
  }

}
