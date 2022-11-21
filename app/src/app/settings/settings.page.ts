import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddNoteComponent } from './add-note/add-note.component';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async openAddNoteModal(){
    const modal = await this.modalCtrl.create({
      component: AddNoteComponent,
      initialBreakpoint:0.25,
      breakpoints:[0, 0.25, 0.5, 0.75],
      handleBehavior:"cycle"
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Note created successfully: ',data);
    }
  }

}
