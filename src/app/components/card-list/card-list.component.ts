import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
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
  cards=[]
  @Output() selectCreditCard=new EventEmitter();
  @Output() totalNumberOfcard=new EventEmitter();
  @Input() newCard;
  cardToken:string;
  ngOnInit() {
    
    this.getCardlist();
  }

  getCardlist(){

    this.genericService.getCardlist().subscribe((res:any)=>{
      this.cardLoader=false;
      this.cards=res;
      this.totalNumberOfcard.emit(res.length)
    },(error)=>{
      this.cardLoader=false;
      this.totalNumberOfcard.emit(0)
    })
  }

  selectCard(cardToken){
    this.cardToken=cardToken;
    this.selectCreditCard.emit(cardToken)
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['newCard'].currentValue!='undefined') {
      if(this.newCard!='undefined'){
        this.cards.push(this.newCard)
        //console.log(this.newCard.cardToken)
        this.cardToken=this.newCard.cardToken
        this.selectCreditCard.emit(this.newCard.cardToken)
      }
    }

    this.cards= this.cards.filter(card=>{
      return typeof card!='undefined'
    })
  }
}
