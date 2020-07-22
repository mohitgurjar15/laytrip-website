import { Component, OnInit } from '@angular/core';
import { GenericService } from './../../services/generic.service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent implements OnInit {

  constructor(
    private genericService:GenericService,
    public translate: TranslateService
  ) { 
    //translate.addLangs(['en','es']);
    translate.use('es');
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {

    this.genericService.getAllLangunage().subscribe((res:any)=>{

      console.log(res)
    })
  }

}
