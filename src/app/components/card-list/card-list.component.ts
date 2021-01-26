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
    private genericService: GenericService
  ) { }
  s3BucketUrl = environment.s3BucketUrl;
  cardLoader: boolean = true;
  cards = []
  @Output() selectCreditCard = new EventEmitter();
  @Output() totalNumberOfcard = new EventEmitter();
  @Input() newCard;
  cardToken: string = '';
  selectedCard = [];

  cardObject = {
    visa: `${this.s3BucketUrl}assets/images/card_visa.svg`,
    master: `${this.s3BucketUrl}assets/images/master_cards_img.svg`,
    american_express: `${this.s3BucketUrl}assets/images/card_amex.svg`,
    discover: `${this.s3BucketUrl}assets/images/card_discover.svg`,
    dankort: `${this.s3BucketUrl}assets/images/card_dankort.svg`,
    maestro: `${this.s3BucketUrl}assets/images/card_maestro.svg`,
    jcb: `${this.s3BucketUrl}assets/images/card_jcb.svg`,
    diners_club: `${this.s3BucketUrl}assets/images/card_dinners_club.svg`,
  }

  ngOnInit() {
    this.getCardlist();
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

  selectCard(index, cardToken) {
    if (typeof this.selectedCard[index] === 'undefined') {
      this.selectedCard[index] = true;
    } else {
      this.selectedCard[index] = !this.selectedCard[index];
    }
    this.selectedCard = this.selectedCard.map((item, i) => {
      return ((index === i) && this.selectedCard[index] === true) ? true : false;
    });
    this.cardToken = cardToken;
    this.selectCreditCard.emit(cardToken);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['newCard'].currentValue !== 'undefined') {
      if (typeof this.newCard !== 'undefined') {
        this.cards.push(this.newCard);
        this.cardToken = this.newCard.cardToken;
        this.selectCreditCard.emit(this.newCard.cardToken)
      }
    }

    this.cards = this.cards.filter(card => {
      return typeof card != 'undefined'
    })
  }
}
