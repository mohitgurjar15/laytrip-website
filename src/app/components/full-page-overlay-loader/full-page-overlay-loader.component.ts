import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-full-page-overlay-loader',
  templateUrl: './full-page-overlay-loader.component.html',
  styleUrls: ['./full-page-overlay-loader.component.scss']
})
export class FullPageOverlayLoaderComponent implements OnInit {

  @Input() image:string;
  @Input() module:string;
  @Input() type:string;
  s3BucketUrl = environment.s3BucketUrl;
  
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
    
  constructor() { }
  
  ngOnInit() {
    this.lottieConfig = {
      path: 'https://assets3.lottiefiles.com/packages/lf20_vTKQNW.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
      this.anim.stop();
  }

  play() {
      this.anim.play();
  }

  pause() {
      this.anim.pause();
  }

  setSpeed(speed: number) {
      this.animationSpeed = speed;
      this.anim.setSpeed(speed);
  }
}
