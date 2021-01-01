import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-traveler-list',
  templateUrl: './traveler-list.component.html',
  styleUrls: ['./traveler-list.component.scss']
})
export class TravelerListComponent implements OnInit {

  @Input() totalPassenger;
  constructor() { }

  ngOnInit(): void {
    console.log("this.totalPassenger...",this.totalPassenger)
  }

}
