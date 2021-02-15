import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';
declare var $: any;
import {cardObject, cardType} from '../../_helpers/card.helper';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private userService: UserService
  ) { }
  s3BucketUrl = environment.s3BucketUrl;
  cardLoader: boolean = true;
  cards = []
  @Output() selectCreditCard = new EventEmitter();
  @Output() totalNumberOfcard = new EventEmitter();
  @Input() newCard;
  @Input() cardToken: string = '';
  @Input() cardListChangeCount:number=0;
  userInfo;

  cardObject =cardObject
  cardType = cardType;

  ngOnInit() {

    this.getCardlist();

    this.userService.getProfile().subscribe(res => {
      this.userInfo = res;
    })
  }

  getCardlist() {

    this.genericService.getCardlist().subscribe((res: any) => {
      this.cardLoader = false;
      this.cards = res;
      this.totalNumberOfcard.emit(res.length)
    }, (error) => {
      this.cardLoader = false;
      this.totalNumberOfcard.emit(0);
    })
  }

  selectCard(cardToken) {
    // $('#card_list_accodrio').children('div').toggleClass('current_selected_card');
    this.cardToken = cardToken;
    this.selectCreditCard.emit(cardToken);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['newCard'] !== 'undefined') {
      if (typeof this.newCard !== 'undefined') {
        this.cards.push(this.newCard);
        this.cardToken = this.newCard.cardToken;
        this.selectCreditCard.emit(this.newCard.cardToken)
      }
    }

    if(typeof changes['cardListChangeCount']!='undefined'){
      this.getCardlist();
    }

    this.cards = this.cards.filter(card => {
      return typeof card != 'undefined'
    })
  }
}
