import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, { Zoom } from 'swiper';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from 'src/app/image-modal/image-modal.page';

SwiperCore.use([Zoom]);
@Component({
  selector: 'image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss'],
})
export class ImageCardComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() imageBase64;
  @Input() reportName;
  @Input() lastUpdatedTime;
  imagenes: any[];
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  async previewImg(img){
    console.log("clicked");
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      componentProps:{
        img
      },
      cssClass: 'transparent-modal'
    })
    modal.present();
  }

}
