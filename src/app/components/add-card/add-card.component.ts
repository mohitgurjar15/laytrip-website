import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  constructor() { }
  @Input() showAddCardForm:boolean;

  ngOnInit() {
  }
}
