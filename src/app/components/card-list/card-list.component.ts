import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {

  constructor(
    private genericService:GenericService
  ) { }
  s3BucketUrl = environment.s3BucketUrl;
  cardLoader:boolean=true;
  cards:[]=[]
  ngOnInit() {
    this.getCardlist();
  }

  getCardlist(){

    this.genericService.getCardlist().subscribe((res:any)=>{
      this.cardLoader=false;
      this.cards=res;
      console.log(res)
    },(error)=>{
      this.cardLoader=false;
    })
  }
}
