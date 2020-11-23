import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareSocialMediaComponent } from 'src/app/pages/share-social-media/share-social-media.component';
import { environment } from '../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadJquery();
  }

  loadJquery(){
    // Start Back to Top Js
    $(window).scroll(function () {
      var height = $(window).scrollTop();
      if (height > 100) {
          $('#back_to_top').fadeIn();
      } else {
          $('#back_to_top').fadeOut();
      }
    });
    $(document).ready(function () {
      $("#back_to_top").click(function (event) {
          event.preventDefault();
          $("html, body").animate({
              scrollTop: 0
          }, "slow");
          return false;
      });

    });
    // Close Back to Top Js
  }

  openShare() {
    const modalRef = this.modalService.open(ShareSocialMediaComponent,{ windowClass: 'share_modal', centered: true });
    modalRef.componentInstance.name = 'World';
  }
}
