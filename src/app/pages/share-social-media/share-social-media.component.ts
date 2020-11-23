import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MODAL_TYPE } from '../../components/confirmation-modal/confirmation-modal.component';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-share-social-media',
  templateUrl: './share-social-media.component.html',
  styleUrls: ['./share-social-media.component.scss']
})
export class ShareSocialMediaComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  url = 'https://staging.laytrip.com';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }


  share(media){
    if(media == 'Pinterest'){
      
      window.open(`https://pinterest.com/pin/create/bookmarklet/?url=${this.url}`);
    }else if(media == 'Twitter'){
      window.open(`https://twitter.com/intent/tweet?original_referer=${this.url}&url=${this.url}`);
      
    }else if(media == 'Facebook'){
      window.open('https://www.facebook.com/sharer/sharer.php?u='+escape(this.url)+'&t='+document.title, '', 
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');      
    }else if(media == 'Google'){
      window.open(`https://plus.google.com/share?url=${this.url},"","height=550,width=525,left=100,top=100,menubar=0`);      
     
    }else if(media == 'Whatapp'){
      window.open(`whatsapp://send?text= Share via WhatsApp , See More: ${this.url}`);      
    } 
    return false;

  }
}
