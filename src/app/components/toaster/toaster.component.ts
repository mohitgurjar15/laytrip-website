import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  @Input() position:string;
  @Input() title:string;
  @Input() type:string;
  @Input() message:string;
  @Input() seconds:number=10;
  @Input() closable:boolean=true;

  isVisible:boolean=true;
  s3BucketUrl=environment.s3BucketUrl
  constructor() { }

  ngOnInit() {

    this.closeToaster(this.seconds)
  }

  toggleAlert(){
    this.isVisible=!this.isVisible;
  }

  closeToaster(seconds){

    setTimeout(()=>{ this.isVisible=false; },seconds*1000)
  }

}
