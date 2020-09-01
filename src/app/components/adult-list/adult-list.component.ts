import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-adult-list',
  templateUrl: './adult-list.component.html',
  styleUrls: ['./adult-list.component.scss']
})
export class AdultListComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  @Input() travelers:any=[];
  @Input() username:string;

  ngOnInit() {
    console.log("this.traveler",this.travelers)
  }

  ngOnChanges(changes) {
    if (changes['traveler']) {
      console.log("this.traveler",this.travelers)
    }
  }
}
