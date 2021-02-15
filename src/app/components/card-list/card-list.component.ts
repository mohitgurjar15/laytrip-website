import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { GenericService } from '../../services/generic.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

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
  @Output() totalNumberOfcard = new EventEmitter();
  @Input() newCard;
  @Input() cardToken: string = '';
  @Input() cardListChangeCount:number=0;
  userInfo;
  cardId;
  closeResult;

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

  cardType = {
    visa: 'Visa',
    master: 'Master Card',
    american_express: 'American Express',
    discover: 'Discover',
    dankort: 'Dankort',
    maestro: 'Maestro',
    jcb: 'JCB',
    diners_club: 'Diners Club',
  }

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
      this.cards=[];
      this.cardLoader = false;
      this.totalNumberOfcard.emit(0);
    });
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
  
  openDeleteModal(content,id) {
    this.cardId = id;
    console.log(id)
    this.modalService.open(content, {windowClass:'delete_account_window', centered: true, backdrop: 'static',
    keyboard: false}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  deleteCreditCard(){
    this.cardLoader = true;
    console.log(this.cardLoader)
    /* this.genericService.deleteCard(this.cardId).subscribe((res: any) => {
      this.cardLoader = false;
      this.getCardlist();
      this.modalService.dismissAll();
    }, (error) => {
      this.cardLoader = false;
    }); */
  }
  

}
