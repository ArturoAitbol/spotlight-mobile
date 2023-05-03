import { Component, Input, OnInit } from '@angular/core';
import { ImageModalPageRoutingModule } from './image-modal-routing.module';
import { ModalController } from '@ionic/angular';

import SwiperCore, { Zoom } from 'swiper';
SwiperCore.use([Zoom]);
@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

  @Input()img: string;
  constructor(private modalCtrl: ModalController) { }
  
  ngOnInit() {
  }
  closeModal(){
    console.log("close clicked");
    this.modalCtrl.dismiss();
  }
}
