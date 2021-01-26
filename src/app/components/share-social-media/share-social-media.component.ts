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
  environment=environment;
  constructor(public activeModal: NgbActiveModal) { }
  isCopyText : boolean = false;
  ngOnInit() {
  }

  close() {
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }


  share(media){
    if(media == 'Pinterest'){     
      window.open('http://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(environment.siteUrl)+ '&media=' + encodeURIComponent('http://d2q1prebf1m2s9.cloudfront.net/assets/images/dr_logo.svg') + '&description=' + encodeURIComponent('Book now, pay in installments. Making travel affordable to all.'));
    }else if(media == 'Twitter'){
      window.open(`https://twitter.com/intent/tweet?original_referer=${environment.siteUrl}&url=${environment.siteUrl}&text=Book now, pay in installments. Making travel affordable to all.`);
      
    }else if(media == 'Facebook'){
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${escape(environment.siteUrl)}&t=${escape('Book now, pay in installments. Making travel affordable to all')}`, '', 
      'menubar=no,toolbar=no,resizable=yes,scrollbars=textyes,height=300,width=600');      
    }else if(media == 'Google'){
      window.open(`https://plus.google.com/share?url=${environment.siteUrl},"","height=550,width=525,left=100,top=100,menubar=0`);      
     
    }else if(media == 'Whatapp'){
      var message = encodeURIComponent('Laytrip');
      var whatsapp_url = "whatsapp://send?text=" + message;
      window.location.href = whatsapp_url;     
    } else if(media == 'CopiedLink'){
      // console.log('here')
      var url : any = environment.siteUrl;
      this.isCopyText = true;
      url.select();
      document.execCommand('copy');
      url.setSelectionRange(0, 0); 
    } 
    return false;

  }
  copyToClipboard() {
    var dummy = document.createElement("textarea");
    dummy.setAttribute("id", "dummy_textarea");
    document.body.appendChild(dummy);
    dummy.value = environment.siteUrl;
    dummy.select();
    document.execCommand("copy");

    this.isCopyText = true;
    document.getElementById("dummy_textarea").remove();
    $('#dummy_textarea').hide()
    setTimeout(() => {      
      this.isCopyText = false;
    }, 2000);
  }
}
