import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { cardObject, cardType } from '../../_helpers/card.helper';
import * as moment from 'moment';
import { getLoginUserInfo } from 'src/app/_helpers/jwt.helper';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private userService: UserService,
    private modalService: NgbModal,

  ) { }
  s3BucketUrl = environment.s3BucketUrl;
  cardLoader: boolean = true;
  cards = []
  @Output() selectCreditCard = new EventEmitter();
  @Input() newCard;
  @Input() cardToken: string = '';
  @Input() cardListChangeCount: number = 0;
  userInfo;
  cardId;
  closeResult;
  deleteApiError: string = '';

  cardObject = cardObject
  cardType = cardType;
  is_open_popup = false;
  loading = false;
  cardIndex;
  origin: string = '';

  ngOnInit() {
    this.origin = window.location.pathname;
    this.getCardlist();
    this.userService.getProfile().subscribe(res => {
      this.userInfo = res;
    })
  }

  getCardlist() {
    this.cardLoader = true;

    this.genericService.getCardlist().subscribe((res: any) => {
      this.cardLoader = false;
      this.cards = res;
      if (this.cardToken == '') {
        let card = this.cards.find(card => {
          return card.isDefault == true;
        });
        if (card) {
          this.cardToken = card.cardToken;
          this.selectCreditCard.emit(this.cardToken);
        }
      }
      this.genericService.setCardItems(this.cards)
    }, (error) => {
      this.cards = [];
      this.genericService.setCardItems(this.cards)
      this.cardLoader = false;
    });
  }

  selectCard(cardToken) {
    this.cardToken = cardToken;
    this.selectCreditCard.emit(cardToken);
  }

  makeDefaultCard(cardId) {
    this.cardIndex = cardId;
    this.loading = true;
    const payload = { card_id: cardId };
    this.genericService.makeDefaultCard(payload).subscribe((res: any) => {
      this.loading = false;
      this.getCardlist();
    }, (error => {
      this.loading = false;
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes",changes)
    if (typeof changes['newCard'] !== 'undefined') {
      if (typeof this.newCard !== 'undefined') {
        this.cards.push(this.newCard);
        this.cardToken = this.newCard.cardToken;
        this.selectCreditCard.emit(this.newCard.cardToken)
      }
    }

    if (typeof changes['cardListChangeCount'] != 'undefined') {
      this.getCardlist();
    }

    this.cards = this.cards.filter(card => {
      return typeof card != 'undefined'
    })
  }

  openDeleteModal(content, card) {
    let user = getLoginUserInfo();
    if (card && card.isDefault && (user.roleId && user.roleId != 7)) {      
        this.is_open_popup = true;
    } else {
      this.cardId = card.id;
      this.deleteApiError = '';
      this.modalService.open(content, {
        windowClass: 'delete_account_window', centered: true, backdrop: 'static',
        keyboard: false
      }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  convertExpiry(month, year) {
    if (!month) {
      return '';
    }
    let date = `${month}/${year}`;
    return moment(date, 'M/YYYY').format('MM/YYYY');
  }

  closePopup() {
    this.is_open_popup = false;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  deleteCreditCard() {

    this.cardLoader = true;
    this.genericService.deleteCard(this.cardId).subscribe((res: any) => {
      this.cardLoader = false;
      this.getCardlist();
      this.modalService.dismissAll();
    }, (error) => {
      this.cardLoader = false;
      this.deleteApiError = '';
      if (error.status === 409) {
        this.deleteApiError = error.message;
      } else {
        this.modalService.dismissAll();
      }
    });
  }
}
