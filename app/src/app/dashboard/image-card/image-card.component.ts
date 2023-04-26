import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, { Zoom } from 'swiper';

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

  constructor() { }

  ngOnInit() {}

}
