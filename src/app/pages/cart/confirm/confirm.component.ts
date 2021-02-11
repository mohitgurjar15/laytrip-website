import { Component, OnInit, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  s3BucketUrl = environment.s3BucketUrl;
  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'cms-bgColor');
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'cms-bgColor');
  }
}
