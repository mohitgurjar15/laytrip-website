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
  baseUrl = "www.laytrip.com";
  ngOnInit() {
  }

  close() {
    this.activeModal.close({ STATUS: MODAL_TYPE.CLOSE });
  }


  share(media){
    var message = encodeURIComponent('Laytrip - Layaway Travel for Everyone:'+ this.baseUrl);

    if(media == 'Instagram'){       
       
      window.open('https://www.instagram.com/laytrip_travel/')
    }else if(media == 'Facebook'){
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${escape(this.baseUrl)}&t=${escape(message)}`, '', 
      'menubar=no,toolbar=no,resizable=yes,scrollbars=textyes,height=300,width=600');      
    }else if(media == 'Whatapp'){
      var whatsapp_url = "https://api.whatsapp.com/send?text=" + message;
      window.open(whatsapp_url);     
    } else if(media == 'CopiedLink'){
      var url : any = this.baseUrl;
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
    dummy.value = this.baseUrl;
    dummy.select();
    document.execCommand("copy");
    this.isCopyText = true;
    document.getElementById("dummy_textarea").remove();
    setTimeout(() => {      
      this.isCopyText = false;
    }, 2000);
  }
}
